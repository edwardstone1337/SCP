# SCP Reader — System Architecture

## Overview

SCP Reader is a web application for tracking reading progress through the SCP Foundation wiki. Users can browse SCPs by series, mark articles as read, bookmark favorites, and track their completion progress.

## Tech Stack

### Frontend
| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + CSS Variables (design tokens) |
| **State** | TanStack Query (server state caching) |
| **Components** | Custom component library (atomic design) |

### Backend
| Layer | Technology |
|-------|------------|
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (magic links / OTP) |
| **API** | Next.js Server Actions + Route Handlers |

### External Data
| Item | Details |
|------|---------|
| **Source** | SCP-Data API (`scp-data.tedivm.com`) |
| **Sync** | Manual seed script: `npm run seed` |

### Deployment
| Item | Details |
|------|---------|
| **Hosting** | Vercel |
| **CI/CD** | Vercel auto-deploy from `main` |

---

## Application Structure

### Route Architecture

| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Home (SECURE CONTAIN PROTECT, Continue → Series) | Public |
| `/series` | Series grid with progress (Series I, II, …) | Public (progress when logged in) |
| `/series/[seriesId]` | Range list for a series (001–099, 100–199, …) | Public |
| `/series/[seriesId]/[range]` | SCP list for a range; sort + read/bookmark toggles | Public |
| `/scp/[id]` | SCP reader (content from external API, prev/next, bookmark/read) | Public (toggles require login) |
| `/saved` | Bookmarked SCPs with sort | **Protected** (redirects to login) |
| `/login` | Magic-link login form | Public (redirects to `/` if already logged in) |
| `/auth/callback` | OAuth/magic-link callback; exchanges code for session | Internal |
| `/auth/logout` | POST only; signs out and redirects to `/` | Internal |
| `/auth/error` | Auth error display (Suspense + client) | Public |
| `/components-test` | Component test page | Public |
| **404** | `not-found.tsx` — SCP-themed "DOCUMENT NOT FOUND" | Public |

### Data Flow

```
┌─────────────────┐     seed script      ┌──────────────┐     Server Components     ┌─────────────┐
│ SCP-Data API    │ ──────────────────► │  Supabase    │ ◄─────────────────────── │  Next.js    │
│ (index + items) │  SUPABASE_SERVICE_   │  (scps,      │   createClient(), RPC,   │  app/       │
└─────────────────┘   ROLE_KEY           │  user_*)     │   .from().select()        └──────┬──────┘
                                         └──────┬──────┘                                   │
                                                │                                          │
                        Client (TanStack Query) │  Server Actions                          │
                                                ▼                                          ▼
                                         ┌──────────────┐     useScpContent()        ┌─────────────┐
                                         │ user_progress│     fetch(scp-data API)    │ ScpReader   │
                                         │ user_bookmarks                             │ (content)   │
                                         └──────────────┘                            └─────────────┘
```

- **Metadata (series, ranges, list):** Server Components read from Supabase (anon key, RLS). Guest users get `read=0`; authenticated get real progress/bookmarks.
- **Article content:** Server passes `content_file` to client; `useScpContent` fetches from `https://scp-data.tedivm.com/data/scp/items/{contentFile}` and caches with TanStack Query (1h stale, 24h gc).
- **Mutations:** Bookmark and read toggles call Server Actions; actions use Supabase server client (cookies), then `revalidatePath()` so the next request gets fresh data.

---

## Database Schema

### Tables

#### `scps`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `scp_number` | INT | NOT NULL |
| `scp_id` | TEXT | NOT NULL, UNIQUE (e.g. `SCP-173`) |
| `title` | TEXT | NOT NULL |
| `series` | TEXT | NOT NULL (e.g. `series-1`) |
| `rating` | INT | nullable |
| `url` | TEXT | NOT NULL |
| `content_file` | TEXT | nullable; filename for SCP-Data API |
| `created_at` | TIMESTAMPTZ | default NOW() |
| `updated_at` | TIMESTAMPTZ | default NOW(), trigger-updated |

**Indexes:** `idx_scps_series`, `idx_scps_number`, `idx_scps_rating`, `idx_scps_content_file`.

**RLS:** Enabled. Policy "Anyone can read scps" — `SELECT` for all; no INSERT/UPDATE/DELETE for anon (writes via service role only, e.g. seed).

---

#### `user_progress`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE |
| `scp_id` | UUID | NOT NULL, FK → `scps(id)` ON DELETE CASCADE |
| `is_read` | BOOLEAN | NOT NULL, default false |
| `read_at` | TIMESTAMPTZ | nullable |
| `created_at` | TIMESTAMPTZ | NOT NULL, default NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, trigger-updated |
| UNIQUE | (`user_id`, `scp_id`) | |

**Indexes:** `idx_user_progress_user_id`, `idx_user_progress_scp_id`, `idx_user_progress_user_read` (partial WHERE is_read = true).

**RLS:** Enabled. Users can SELECT/INSERT/UPDATE/DELETE only their own rows (`auth.uid() = user_id`).

---

#### `user_bookmarks`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE |
| `scp_id` | UUID | NOT NULL, FK → `scps(id)` ON DELETE CASCADE |
| `bookmarked_at` | TIMESTAMPTZ | NOT NULL, default NOW() |
| UNIQUE | (`user_id`, `scp_id`) | |

**Indexes:** `idx_user_bookmarks_scp_id`, `idx_user_bookmarks_user_bookmarked_at` (user_id, bookmarked_at DESC).

**RLS:** Enabled. Users can SELECT/INSERT/DELETE only their own rows; no UPDATE policy (bookmarks are insert/delete only).

### Row Level Security Summary

| Table | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| `scps` | All | — (service role) | — | — |
| `user_progress` | Own | Own | Own | Own |
| `user_bookmarks` | Own | Own | — | Own |

---

### RPCs

| Function | Purpose |
|----------|---------|
| `get_series_progress(user_id_param UUID)` | Returns `(series, total, read)` per series; pass `null` for guests (read=0). |
| `get_range_progress(series_id_param TEXT, user_id_param UUID)` | Returns `(range_start, total, read_count)` per 100-number range; used for range list. |

---

## Authentication Flow

1. **Login:** User visits `/login`, enters email. Client calls `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: SITE_URL/auth/callback?next=... } })`. Supabase sends magic link to email.
2. **Callback:** User clicks link → `/auth/callback?code=...&next=...`. Route handler creates server Supabase client, calls `exchangeCodeForSession(code)`, then redirects to `next` (or `/`). On failure, redirects to `/login?error=...`.
3. **Session:** Middleware runs on each request; uses `@supabase/ssr` to read/set cookies and refresh session. Authenticated user on `/login` is redirected to `/`.
4. **Logout:** Form POST to `/auth/logout` (or Server Action `signOut()`); server calls `supabase.auth.signOut()` then redirects to `/`.

**Protected routes:** Only `/saved` is protected; unauthenticated users are redirected to `/login?redirect=/saved`.

---

## Design System

### Token Architecture

- **`@theme static`** (Tailwind v4) in `app/globals.css`: all tokens are emitted as CSS variables, so they work in both Tailwind utilities and inline `style`.
- **Primitive tokens:** Raw values (e.g. `--color-grey-9`, `--spacing-4`).
- **Semantic tokens:** Purpose-driven (e.g. `--color-background`, `--color-surface`, `--spacing-page-padding`). Grey-7 to Grey-8 is intentionally non-linear for surface/border contrast.

### Color Palette

| Token | Use |
|-------|-----|
| `--color-background` | Page background (grey-9) |
| `--color-text-primary` | Primary text (grey-1) |
| `--color-text-secondary` | Secondary text (#dbdbdb) |
| `--color-text-muted` | Muted (grey-7) |
| `--color-accent` | Primary actions, links (#e41c2c) |
| `--color-accent-hover` | Hover (red-7) |
| `--color-surface` | Cards, inputs (grey-9) |
| `--color-surface-border` | Borders (grey-8) |
| Red scale | Danger, success states; green-5/7 for success |

### Typography

- **Fonts:** Roboto (sans), Roboto Mono (mono); loaded in `layout.tsx` via `next/font/google`, variables `--font-roboto`, `--font-roboto-mono`.
- **Semantic:** `--font-family-sans`, `--font-family-mono`; sizes `--font-size-xs` … `--font-size-5xl`; line heights `--line-height-xs` … `--line-height-5xl`.
- **Components:** `Heading` (level 1–4, optional `accent`), `Text` (variant/size), `Mono`, `Label` (see `components/ui/typography.tsx`).

### Spacing

- **Grid:** 8px base. Primitives: `--spacing-0` through `--spacing-16` (e.g. 0.5rem = 8px, 1rem = 16px).
- **Semantic:** `--spacing-page-padding` (48px desktop, 24px mobile), `--spacing-section-gap`, `--spacing-card-padding`, `--spacing-list-gap`, etc.

### Component Hierarchy

- **Atoms:** Button, Link, Badge, Icon, Input, Label, Text, Heading, Mono.
- **Molecules:** Card, Select, Message, Spinner, ProgressRing, ProgressText.
- **Organisms:** SeriesCard, RangeListItem, ScpListItem, ScpListWithToggle, PageHeader, Breadcrumb, BookmarkButton, ReadToggleButton, BackToTop.
- **Layout:** Main, Container, Stack, Grid, Navigation, SkipLink, Logo.

### Component Library (components/ui/)

| Component | Description |
|-----------|-------------|
| `back-to-top` | Fixed button after scroll threshold; smooth scroll to top. |
| `badge` | Badge variants: default, accent, progress. |
| `bookmark-button` | Save/Saved toggle; optimistic update; redirects to login if not authenticated. |
| `breadcrumb` | Breadcrumb trail (e.g. Series → Series I → 001–099 → SCP-173). |
| `button` | Variants: primary, secondary, ghost, danger, success; sizes sm/md/lg; supports href. |
| `card` | Container; variants default, interactive, bordered; optional accentBorder. |
| `container` | Max-width + padding; sizes xs … 2xl, full. |
| `grid` | Responsive grid (e.g. cols="auto" → 2→3→4). |
| `heading` | Heading level 1–4, optional accent. |
| `icon` | Inline SVG icons (check, eye, star, bookmark, bookmark-filled, arrow-up, etc.). |
| `input` | Styled input with design tokens. |
| `label` | Form label. |
| `link` | Next Link wrapper; variants default, back, nav. |
| `logo` | SCP logo (sm/md/lg). |
| `main` | Main content wrapper (padding, background). |
| `message` | Success/error message block. |
| `page-header` | Title + optional description. |
| `progress-ring` | Circular progress (percentage). |
| `progress-text` | Percentage or "read / total" text. |
| `range-list-item` | Range row with progress ring, link. |
| `read-toggle-button` | Mark as Read/Unread; optimistic update; login redirect when needed. |
| `scp-list-item` | SCP row: title, rating, id, read/bookmark toggles, full-card link. |
| `scp-list-with-toggle` | Sort Select + "Hide read" toggle + list of ScpListItem. |
| `select` | Native select styled with design tokens. |
| `series-card` | Series card with progress, link to series. |
| `skip-link` | Accessibility skip-to-content link. |
| `spinner` | Loading spinner. |
| `stack` | Flex stack; direction vertical/horizontal; gap tight/normal/loose. |
| `text` | Text with variant/size. |
| `typography` | Re-exports Heading, Text, Mono, Label. |

---

## Key Features

### Progress Tracking

- **Storage:** `user_progress` (user_id, scp_id, is_read, read_at). Upsert on toggle; unique on (user_id, scp_id).
- **UI:** `ReadToggleButton` on reader and list items. Optimistic toggle → Server Action `toggleReadStatus(scpUuid, currentStatus)` → `revalidatePath('/series', …)` and series/range paths.
- **Aggregation:** `get_series_progress` and `get_range_progress` RPCs compute read counts; guest gets 0 when `user_id_param` is null.

### Bookmarks

- **Storage:** `user_bookmarks` (user_id, scp_id, bookmarked_at). Insert/delete only.
- **UI:** `BookmarkButton` on reader (header + below content) and in list items. Optimistic toggle → `toggleBookmarkStatus(scpId, isCurrentlyBookmarked, routeId)` (routeId = text id e.g. `SCP-173` for revalidation).
- **Revalidation:** `revalidatePath(\`/scp/${routeId}\`, 'page')` and `revalidatePath('/saved', 'page')` so reader and Saved list update.
- **Saved page:** `/saved` lists bookmarked SCPs with sort (Recently/Oldest Saved, number/rating); uses `SavedList` + `ScpListItem`.

### Sorting

- **Range list (`ScpListWithToggle`):** Client-side. Options: Oldest First, Newest First, Top Rated, Lowest Rated. Optional "Hide read" filter.
- **Saved list (`SavedList`):** Client-side. Options: Recently Saved, Oldest Saved, Oldest/Newest First, Top/Lowest Rated. Same `Select` component.

### Content Loading

- **Metadata:** Server loads `scps` row (including `content_file`) in `/scp/[id]/page.tsx`. If `content_file` is null, reader shows "Content is not available."
- **Body:** Client `useScpContent(contentFile, scpId)` fetches `https://scp-data.tedivm.com/data/scp/items/{contentFile}`, returns JSON keyed by scp_id; hook selects `data[scpId]` (raw_content, raw_source). TanStack Query: 1h stale, 24h gc.
- **Rendering:** `sanitizeHtml(content.raw_content)` (DOMPurify, client-only) then `dangerouslySetInnerHTML` in a div with class `scp-content` (prose styles in globals.css).

---

## Security

### Environment Variables

| Variable | Purpose | Exposed to client? |
|----------|---------|--------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key for browser/server | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS (seed script only) | No |
| `SUPABASE_DB_PASSWORD` | DB password for CLI | No |
| `NEXT_PUBLIC_SITE_URL` | Base URL for auth redirects | Yes |

Server-side validation in `lib/env.ts` (used by `lib/supabase/server.ts`); client uses `process.env` for `NEXT_PUBLIC_*` only.

### RLS Policies

- **scps:** Read-only for all; writes only via service role (e.g. seed).
- **user_progress / user_bookmarks:** Full CRUD (or insert/delete for bookmarks) restricted to own rows by `auth.uid() = user_id`.

### Service Role Key Usage

- **Where:** `scripts/seed-scps.ts` only. Creates Supabase client with `SUPABASE_SERVICE_ROLE_KEY` to insert/upsert into `scps` while RLS blocks anon writes.
- **Never** used in Next.js app code or exposed to the client.

---

## Performance Considerations

### Caching

- **TanStack Query (QueryProvider):** Default `staleTime: 60_000`, `gcTime: 5 * 60_000`. Content hook overrides: `staleTime: 1h`, `gcTime: 24h`.
- **Next.js:** Dynamic routes use `export const dynamic = 'force-dynamic'`. Revalidation via `revalidatePath()` after bookmark/read actions.

### Optimistic Updates

- **BookmarkButton:** Sets local state to toggled, calls action, on error reverts; on success `router.refresh()`.
- **ReadToggleButton:** Same pattern. Both use `stopPropagation` so card link and button don’t double-fire.

---

## Development Workflow

### Local Setup

1. Clone repo, `npm install`.
2. Copy `.env.example` to `.env.local`, set Supabase URL, anon key, `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`).
3. Run migrations (see below).
4. Optional: `npm run seed` (requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`).
5. `npm run dev` → app at `http://localhost:3000`.

### Database Migrations

- Migrations live in `supabase/migrations/` (timestamped SQL).
- Apply via Supabase CLI: `supabase db push` (or your project’s workflow). No in-app migration runner.

### Seeding Data

- **Command:** `npm run seed` (runs `tsx scripts/seed-scps.ts`).
- **Requires:** `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
- **Process:** Fetches `https://scp-data.tedivm.com/data/scp/items/index.json`, maps to `scps` schema, upserts in batches (500) with `onConflict: 'scp_id'`.

---

## File Structure

```
app/
├── actions/
│   └── auth.ts              # signOut server action
├── auth/
│   ├── callback/route.ts    # Magic link code exchange
│   ├── error/client.tsx, page.tsx
│   └── logout/route.ts      # POST sign out
├── login/
│   ├── login-form.tsx       # Client form (OTP)
│   └── page.tsx
├── saved/
│   ├── saved-list.tsx       # Client list + sort
│   ├── page.tsx, loading.tsx
├── scp/[id]/
│   ├── actions.ts           # toggleReadStatus, toggleBookmarkStatus
│   ├── page.tsx             # Server: metadata + adjacent
│   ├── scp-reader.tsx       # Client: content + toggles
│   └── loading.tsx
├── series/
│   ├── page.tsx             # Series grid
│   ├── [seriesId]/page.tsx  # Range list
│   ├── [seriesId]/[range]/page.tsx  # SCP list
│   └── loading.tsx (per segment)
├── components-test/page.tsx
├── layout.tsx               # Fonts, QueryProvider, SkipLink
├── globals.css               # @theme, tokens, .scp-content
├── page.tsx                 # Home
└── not-found.tsx            # 404

components/
├── ui/                      # Design system (see Component Library table)
└── navigation.tsx           # Server nav (logo, Series, Saved, user, Sign Out/In)

lib/
├── supabase/client.ts       # Browser client (anon)
├── supabase/server.ts       # Server client (cookies, env)
├── env.ts                   # Server env validation
├── hooks/use-scp-content.ts # TanStack Query content fetch
├── providers/query-provider.tsx
├── utils/cn.ts, loading-messages.ts, sanitize.ts, series.ts, site-url.ts
└── logger.ts

scripts/
└── seed-scps.ts             # SCP-Data API → scps table (service role)

supabase/
└── migrations/              # SQL migrations (see Database Schema)

docs/
└── *.md                     # Documentation
```

---

## Backlog

| Priority | Feature | Effort | Notes |
|----------|---------|--------|-------|
| 1 | Progress celebration | Medium | Range/series complete |
| 2 | Reading settings | Medium–High | Font, size, line-height (Kindle-style) |
| 3 | Random SCP / Daily Featured | Low | Discovery |
| 4 | Recently Viewed | Low | Continuity |
| 5 | Search | Medium | By SCP number |
| 6 | Tags/Filters | Medium | Classification filters |
| 7 | SSO (e.g. Google Auth) | Low–Medium | Alternative to magic link |

---

*Document generated from codebase verification. Keep in sync with implementation.*
