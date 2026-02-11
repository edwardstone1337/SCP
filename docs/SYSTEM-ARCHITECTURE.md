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
| `/` | Home: themed header (SECURE CONTAIN PROTECT), Daily Featured, series grid, Recently Viewed | Public (progress when logged in) |
| `/top-rated` | Top 100 highest-rated SCP list, with ranked links into reader context | Public (toggles require login) |
| `/series` | Redirects to `/` | — |
| `/series/[seriesId]` | Range list for a series (001–099, 100–199, …) + CollectionPage/Breadcrumb JSON-LD | Public |
| `/series/[seriesId]/[range]` | SCP list for a range; sort + read/bookmark toggles | Public |
| `/scp/[id]` | SCP reader (content via direct SCP-Data API fetch, prev/next, bookmark/read) + CreativeWork/Breadcrumb JSON-LD | Public (toggles require login) |
| `/saved` | Bookmarked SCPs with sort | **Protected** (redirects to login) |
| `/login` | Magic-link login form | Public (redirects to `/` if already logged in) |
| `/auth/callback` | OAuth/magic-link callback; exchanges code for session | Internal |
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
                                         │ user_progress, user_bookmarks,           │ ScpReader   │
                                         │ user_recently_viewed                     │ (content)   │
                                         └──────────────┘                            └─────────────┘
```

- **Metadata (series, ranges, list):** Server Components read from Supabase (anon key, RLS). Guest users get `read=0`; authenticated get real progress/bookmarks.
- **Top-rated landing data:** Home fetches top 4 rated SCP rows server-side; `/top-rated` fetches top 100 rows server-side, then hydrates user read/bookmark state client-side after auth check.
- **Article content:** Server passes `content_file` to client; `useScpContent` fetches directly from `https://scp-data.tedivm.com/data/scp/items/{contentFile}`. TanStack Query caches client-side (1h stale, 24h gc) with retry/backoff.
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

---

#### `user_recently_viewed`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `user_id` | UUID | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE |
| `scp_id` | UUID | NOT NULL, FK → `scps(id)` ON DELETE CASCADE |
| `viewed_at` | TIMESTAMPTZ | NOT NULL, default NOW() |
| UNIQUE | (`user_id`, `scp_id`) | Upsert updates viewed_at |

**Indexes:** `idx_user_recently_viewed_user_viewed` (user_id, viewed_at DESC).

**RLS:** Enabled. Users can SELECT/INSERT/UPDATE/DELETE only their own rows (`auth.uid() = user_id`).

### Row Level Security Summary

| Table | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| `scps` | All | — (service role) | — | — |
| `user_progress` | Own | Own | Own | Own |
| `user_bookmarks` | Own | Own | — | Own |
| `user_recently_viewed` | Own | Own | Own | Own |

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
3. **Session:** No middleware. Nav uses client-side Supabase (`getUser` + `onAuthStateChange`); layout wraps `Navigation` in `Suspense`. Server routes that need auth (e.g. `/saved`) use cookie-based `createClient()` and `getUser()` then redirect if unauthenticated. Authenticated users on `/login` are redirected in the callback flow (no middleware).
4. **Logout:** Logout uses the `signOut()` server action in `app/actions/auth.ts`, which calls `supabase.auth.signOut()`, then `revalidatePath('/', 'layout')` and `redirect('/')`.

**Protected routes:** Only `/saved` is protected; unauthenticated users are redirected to `/login?redirect=/saved`.
For protected client actions (nav Sign In, bookmark, mark-as-read, recently viewed sign-in), JS opens the sign-in modal and preserves current location as `pathname + search + hash`; non-JS users still fall back to `/login?redirect=...`.

---

## Design System

### Token Architecture

- **`@theme static`** (Tailwind v4) in `app/globals.css`: all tokens are emitted as CSS variables, so they work in both Tailwind utilities and inline `style`.
- **Primitive tokens:** Raw values (e.g. `--color-grey-9`, `--spacing-4`).
- **Semantic tokens:** Purpose-driven (e.g. `--color-background`, `--color-surface`, `--spacing-page-padding`, `--shadow-elevated`, `--shadow-drawer`, skeleton color tokens). Grey-7 to Grey-8 is intentionally non-linear for surface/border contrast.

### Color Palette

| Token | Use |
|-------|-----|
| `--color-background` | Page background (grey-9) |
| `--color-text-primary` | Primary text (grey-1) |
| `--color-text-secondary` | Secondary text (#dbdbdb) |
| `--color-text-muted` | Muted (grey-7) |
| `--color-accent` | Primary actions, links (#ef4444) |
| `--color-accent-hover` | Hover (red-7) |
| `--color-surface` | Cards, inputs (grey-9) |
| `--color-surface-border` | Borders (grey-8, #595959) |
| Red scale | Danger, success states; green-5/7 for success |

### Typography

- **Fonts:** Roboto (sans), Roboto Mono (mono); loaded in `layout.tsx` via `next/font/google`, variables `--font-roboto`, `--font-roboto-mono`.
- **Semantic:** `--font-family-sans`, `--font-family-mono`; sizes `--font-size-xs` … `--font-size-5xl`; line heights `--line-height-xs` … `--line-height-5xl`.
- **Components:** `Heading` (level 1–4, optional `accent`), `Text` (variant/size), `Mono`, `Label` (see `components/ui/typography.tsx`).

### Spacing

- **Grid:** 8px base. Primitives: `--spacing-0` through `--spacing-16` (e.g. 0.5rem = 8px, 1rem = 16px).
- **Semantic:** `--spacing-page-padding` (48px desktop, 24px mobile via `var(--spacing-3)`), `--spacing-section-gap`, `--spacing-card-padding`, `--spacing-list-gap`, etc.

### Shadows

- **Semantic:** `--shadow-elevated` (e.g. BackToTop button), `--shadow-drawer` (desktop nav drawer depth).

### Z-Index

- **Scale:** `--z-base`, `--z-dropdown`, `--z-sticky`, `--z-overlay`, `--z-nav`, `--z-modal`, `--z-toast`, `--z-skip-link`. Nav bar uses `--z-nav`; full-screen nav overlay uses `--z-overlay`; skip link remains the highest layer for accessibility.

### Component Hierarchy

- **Atoms:** Button, Link, Badge, Icon, Input, Label, Text, Heading, Mono.
- **Molecules:** Card, Select, Message, Spinner, Skeleton, ProgressRing, ProgressText.
- **Organisms:** SeriesCard, RangeListItem, ScpListItem, ScpListWithToggle, TopRatedSection, PageHeader, Breadcrumb, BookmarkButton, ReadToggleButton, BackToTop.
- **Layout:** Main, Container, Stack, Grid, Navigation, SkipLink, Logo. Navigation: server wrapper (`navigation.tsx`) + client (`navigation-client.tsx`).

### Component Library (components/ui/)

| Component | Description |
|-----------|-------------|
| `back-to-top` | Fixed button after scroll threshold; smooth scroll to top. |
| `badge` | Badge variants: default, accent, progress. |
| `bookmark-button` | Save/Saved toggle; optimistic update; on error revert + logger; opens sign-in modal when unauthenticated (preserves current location). |
| `breadcrumb` | Breadcrumb trail (e.g. Series → Series I → 001–099 → SCP-173). |
| `button` | Variants: primary, secondary, ghost, danger, success; sizes sm/md/lg; supports href; forwardRef. |
| `card` | Container; variants default, interactive, bordered; optional accentBorder; forwards `role` and `aria-live`/`aria-busy` props. |
| `container` | Max-width + padding; sizes xs … 2xl, full. |
| `daily-featured-section` | Hero-style "Today's Featured SCP" block on home page; deterministic by UTC date (getDailyIndex); shows scp_id, title, rating, series; link wraps card. |
| `grid` | Responsive grid (e.g. cols="auto" → 2→3→4). |
| `heading` | Heading level 1–4, optional accent; supports `id` prop forwarding. |
| `icon` | Inline SVG icons (check, eye, star, bookmark, bookmark-filled, arrow-up, etc.). |
| `input` | Styled input with design tokens. |
| `label` | Form label. |
| `link` | Next Link wrapper; variants default, back, nav; forwardRef. |
| `logo` | SCP logo (sm/md/lg). |
| `main` | Main content wrapper (padding, background). |
| `message` | Success/error message block. |
| `page-header` | Title + optional description. |
| `progress-ring` | Circular progress (percentage). |
| `progress-text` | Percentage or "read / total" text. |
| `range-list-item` | Range row with progress ring, link. |
| `read-toggle-button` | Mark as Read/Unread; optional routeId for reader revalidation; optimistic update; opens sign-in modal when unauthenticated (preserves current location). |
| `recently-viewed-section` | Recently Viewed block: last 5 SCPs for auth users; zero states for guests ("Sign in to track your reading history") and new users ("Articles you read will appear here"). |
| `scp-list-item` | SCP row: title, rating, id, read/bookmark toggles, full-card link. |
| `scp-list-with-toggle` | Sort Select + "Hide read" toggle (label/id for a11y) + list of ScpListItem; supports `defaultSort` and optional hidden sort control. |
| `select` | Native select styled with design tokens. |
| `series-card` | Series card with progress, link to series. |
| `top-rated-section` | Home page Top Rated block (top 4 by rating) with ranked reader links and CTA to `/top-rated`; responsive 1/3/4-card layout by breakpoint. |
| `skeleton` | Tokenized dark-theme shimmer placeholder with reduced-motion support. |
| `skip-link` | Accessibility skip-to-content link using visually-hidden clipping pattern until focus/focus-visible; spacing tokens; highest layer via `--z-skip-link`. |
| `spinner` | Loading spinner. |
| `stack` | Flex stack; direction vertical/horizontal; gap tight/normal/loose. |
| `text` | Text with variant/size. |
| `typography` | Re-exports Heading, Text, Mono, Label. |

**Layout (components/, not ui/):** `navigation.tsx` — client component; uses browser Supabase client (`getUser`, `onAuthStateChange`) and renders `NavigationClient`. `navigation-client.tsx` — client nav: logo + "SCP Reader" link, top-right auth action and Menu button on all viewports (`Sign In` primary when logged out, `Sign Out` secondary when logged in, `Menu` secondary always). Menu opens as a right-side drawer on desktop (gradient backdrop + drawer shadow) and full-screen overlay on mobile. Overlay includes a close button, Escape-to-close, and Tab focus trapping while open. It lists Series I–X (two-column grid), Saved (auth), and account email; active series/saved routes are highlighted with `aria-current="page"`.

---

## Key Features

### Progress Tracking

- **Storage:** `user_progress` (user_id, scp_id, is_read, read_at). Upsert on toggle; unique on (user_id, scp_id).
- **UI:** `ReadToggleButton` on reader and list items (optional `routeId` for reader). Optimistic toggle → Server Action `toggleReadStatus(scpUuid, currentStatus, routeId?)` → `revalidatePath('/')`, series/range paths, and when `routeId` provided `revalidatePath(\`/scp/${routeId}\`, 'page')` so reader badge updates.
- **Aggregation:** `get_series_progress` and `get_range_progress` RPCs compute read counts; guest gets 0 when `user_id_param` is null.

### Bookmarks

- **Storage:** `user_bookmarks` (user_id, scp_id, bookmarked_at). Insert/delete only.
- **UI:** `BookmarkButton` on reader (header + below content) and in list items. Optimistic toggle → `toggleBookmarkStatus(scpId, isCurrentlyBookmarked, routeId)` (routeId = text id e.g. `SCP-173` for revalidation).
- **Revalidation:** `revalidatePath(\`/scp/${routeId}\`, 'page')` and `revalidatePath('/saved', 'page')` so reader and Saved list update.
- **Saved page:** `/saved` lists bookmarked SCPs with sort (Recently/Oldest Saved, number/rating); uses `SavedList` + `ScpListItem`.

### Recently Viewed

- **Storage:** `user_recently_viewed` (user_id, scp_id, viewed_at). Upsert on view; unique on (user_id, scp_id). Cap at 5: after upsert, oldest entries beyond the 5 most recent are deleted.
- **Recording:** `recordView(scpUuid)` server action in `app/scp/[id]/actions.ts`. Called once on reader mount (client `useEffect` in `ScpReader`). No-op for guests.
- **Display:** Home page (`/`) fetches last 5 for authenticated user via `getRecentlyViewed(userId)`; renders `RecentlyViewedSection`.
- **Zero states:** Guests see "Sign in to track your reading history." New users (auth but no rows) see "Articles you read will appear here."

### Daily Featured SCP

- **Selection:** Deterministic by UTC date. `getDailyIndex(totalCount)` in `lib/utils/daily-scp.ts` hashes `YYYY-MM-DD` to an integer and returns `hash % totalCount`. Same date → same SCP for all users.
- **Fetch:** Home page calls `getDailyFeaturedScp()`: count from `scps`, then one row at offset `getDailyIndex(count)` ordered by `scp_number` (selects `scp_id`, `title`, `rating`, `series`).
- **Display:** `DailyFeaturedSection` above the series grid: "Today's Featured SCP" label, card with SCP id, title, rating, series (Roman); outer `Link` to `/scp/[id]`, no nested anchor. Renders nothing when `scp` is null.

### Sorting

- **Range list (`ScpListWithToggle`):** Client-side. Options: Oldest First, Newest First, Top Rated, Lowest Rated. Optional "Hide read" filter.
- **Top 100 list (`/top-rated`):** Uses `ScpListWithToggle` with fixed default sort (`rating-desc`) and hidden sort dropdown; keeps "Hide read" filter when applicable. Item links include `?context=top-rated&rank=N` to preserve ranked navigation context in reader.
- **Saved list (`SavedList`):** Client-side. Options: Recently Saved, Oldest Saved, Oldest/Newest First, Top/Lowest Rated. Same `Select` component.

### Top Rated navigation context

- **Entry points:** Home Top Rated cards and `/top-rated` list links append `context=top-rated&rank=<1..100>` to reader URLs.
- **Reader behavior:** `ScpContent` enables `useTopRatedList()` only in top-rated context, loads ordered top-100 `scp_id` values, and overrides prev/next targets by rank instead of SCP number adjacency.
- **Reader UI:** Context banner shows `Top Rated · #N of 100` plus a link back to `/top-rated`.

### Structured data (JSON-LD)

- **SCP page (`/scp/[id]`):** Injects `CreativeWork` and `BreadcrumbList` JSON-LD via `lib/utils/json-ld.ts`.
- **Series page (`/series/[seriesId]`):** Injects `CollectionPage` and `BreadcrumbList` JSON-LD via `lib/utils/json-ld.ts`.
- **Name handling:** `CreativeWork` name uses `SCP-XXX — Title` only when title differs from `scp_id`.

### Content Loading

- **Metadata:** Server loads `scps` row (including `content_file`) in `/scp/[id]/page.tsx`. If `content_file` is null, reader shows "Content is not available."
- **Body:** Client `useScpContent(contentFile, scpId)` fetches directly from `https://scp-data.tedivm.com/data/scp/items/{contentFile}`, returns JSON keyed by scp_id; hook selects `data[scpId]` (raw_content, raw_source). TanStack Query: 1h stale, 24h gc, retry/backoff for transient failures.
- **Rendering:** `sanitizeHtml(content.raw_content)` (DOMPurify, client-side by default; optional custom instance for Node/JSDOM tooling) then `dangerouslySetInnerHTML` in an `article` with class `scp-content` and `aria-labelledby` for semantic association to the page title.
- **Failure recovery:** Reader error UI includes `Retry` (query refetch) and `Open Original Article` (external fallback).

### Reader typography & layout

All `.scp-content` styles live in `app/globals.css` and use design tokens from `@theme` (static). Covered elements:

- **Tables:** borders, padding, horizontal scroll; header background; alternating row stripe (`--color-table-stripe`).
- **Images:** max-width 100%, auto height, border-radius, vertical margin.
- **Pre/code blocks:** background, border, overflow-x, mono font, margin.
- **Horizontal rules:** border-top, margin.
- **Heading hierarchy:** h1–h6 with tokenized font sizes and margins (h4 `--font-size-md`, h5/h6 smaller with uppercase/secondary where applicable).
- **Superscript/subscript:** font-size 0.75em, vertical-align and position.
- **Content width:** `.scp-content` has `max-width: 72ch`, centered, for readability.

### Footnote system

- **Pattern:** Wikidot-style `footnoteref-N` ↔ `footnote-N` mapping via `id` attributes in the sanitized HTML. Inline refs are `<sup class="footnoteref"><a href="#footnote-N" class="footnoteref">N</a></sup>`; footnotes at bottom live in `div.footnote-footer`.
- **Hook:** `lib/hooks/use-footnotes.ts` runs after content renders. It attaches click and keyboard handlers to inline refs, resolves the target footnote by id, and shows a tooltip with the footnote text (leading "N. " stripped).
- **Tooltip:** `position: fixed`, viewport-clamped with padding; `role="tooltip"`, `aria-describedby` for accessibility; appears above or below the ref depending on space. Styled with design tokens (grey-9 background, grey-7 border, `--shadow-elevated`).
- **Bottom section:** Footnote blocks remain in the DOM as the reference section; `.footnote-footer` styled with smaller font, secondary color, border-top.
- **Inline refs:** Styled in globals.css as interactive (accent color, no underline; hover/focus uses accent underline styling).

### Content links

- **Hook:** `lib/hooks/use-content-links.ts` runs after content renders on the reader. Listens for clicks inside `.scp-content`.
- **Behavior:** SCP-to-SCP links (relative `/scp-N` or absolute wiki URLs) → client-side navigation; external http(s) → open in new tab; relative wiki paths (e.g. `/licensing-guide`) → rewrite to `https://scp-wiki.wikidot.com/...` and open in new tab; footnote refs left to `useFootnotes`; empty/missing href → preventDefault.
- **Integration:** `ScpReader` passes the same `contentContainerRef` and content-loaded flag to both `useFootnotes` and `useContentLinks`.

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

## Performance & Cost Architecture

> ⚠️ **CRITICAL: Read this before changing data fetching or rendering strategy on any page.**
>
> This architecture was designed to keep Vercel costs near-zero regardless of traffic. Regressions can cause runaway bandwidth bills — the original server-rendered architecture generated 32 GB of origin transfer in 2 days from a single user.

### Principles

1. **Never proxy public API content through serverless functions.** SCP article content is fetched directly by the browser from `scp-data.tedivm.com`. Routing it through Vercel functions multiplies origin transfer by the number of visitors.

2. **Never use the server Supabase client (`lib/supabase/server`) in page components.** It calls `cookies()` from `next/headers`, which forces dynamic rendering and bypasses ISR caching. Use `lib/supabase/static` for public data instead.

3. **Never add `export const dynamic = 'force-dynamic'` to public pages.** This disables caching and causes every visit to invoke a serverless function.

4. **User-specific data must be hydrated client-side.** Server components fetch public data only (via static client). Client wrapper components check auth and fetch user progress/bookmarks after mount.

### How it works

| Layer | What | Cost model |
|-------|------|-----------|
| Edge CDN | Serves cached HTML for all public pages | Included in plan — scales free with traffic |
| ISR revalidation | Rebuilds a page when visited after cache expiry | One function invocation per page per revalidation period |
| Client hydration | Browser fetches user-specific data from Supabase | Direct to Supabase — no Vercel cost |
| SCP content | Browser fetches article HTML from SCP-Data API | Direct to upstream — no Vercel cost |

### ISR configuration

| Route | Revalidate | Client hydration component |
|-------|-----------|--------------------------|
| `/` | 300 (5 min) | `app/home-content.tsx` |
| `/top-rated` | 2592000 (30 days) | `app/top-rated/top-rated-content.tsx` |
| `/series/[seriesId]` | 86400 (24h) | `app/series/[seriesId]/series-content.tsx` |
| `/series/[seriesId]/[range]` | 86400 (24h) | `app/series/[seriesId]/[range]/range-content.tsx` |
| `/scp/[id]` | 86400 (24h) | `app/scp/[id]/scp-content.tsx` |

### The pattern (for new pages)

1. Page server component uses `createStaticClient()` from `lib/supabase/static`
2. Fetches only public data, passes to a `'use client'` content component
3. Content component checks auth on mount, fetches user data if logged in
4. Set `export const revalidate = 86400` (or appropriate interval)
5. Never import from `lib/supabase/server` in page components

### Things that will break this and cost real money

- Adding `export const dynamic = 'force-dynamic'` to any cached page
- Importing `lib/supabase/server` (calls `cookies()`, forces dynamic)
- Creating API routes that proxy external content
- Calling `headers()` or `cookies()` in page server components

### Caching (TanStack Query & revalidation)

- **TanStack Query (QueryProvider):** Default `staleTime: 60_000`, `gcTime: 5 * 60_000`. Content hook overrides: `staleTime: 1h`, `gcTime: 24h`.
- **Next.js:** Revalidation via `revalidatePath()` after bookmark/read actions. `/saved` uses `dynamic = 'force-dynamic'`.

### Parallel Data Loading

- **Home page:** `getRecentlyViewed`, `getSeriesProgress`, and `getDailyFeaturedScp` run in parallel via `Promise.all` so the page does not wait for them sequentially.

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
│   └── error/client.tsx, page.tsx
├── login/
│   └── page.tsx             # Login route; renders SignInPanel (page context)
├── saved/
│   ├── saved-list.tsx       # Client list + sort
│   ├── page.tsx, loading.tsx
├── scp/[id]/
│   ├── actions.ts           # toggleReadStatus, toggleBookmarkStatus, recordView
│   ├── page.tsx             # Server: metadata + adjacent (createStaticClient)
│   ├── scp-content.tsx      # Wrapper; passes scp/prev/next to ScpReader
│   ├── scp-reader.tsx       # Client: content + toggles
│   └── loading.tsx
├── top-rated/
│   ├── page.tsx             # Top 100 rated route (static client + ISR)
│   └── top-rated-content.tsx # Client auth hydration + ranked list context links
├── series/
│   ├── page.tsx             # Redirect to /
│   ├── [seriesId]/page.tsx, series-content.tsx  # Range list (static client)
│   ├── [seriesId]/[range]/page.tsx, range-content.tsx  # SCP list (static client)
│   └── [seriesId]/loading.tsx, [seriesId]/[range]/loading.tsx
├── components-test/page.tsx
├── layout.tsx               # Fonts, QueryProvider, SkipLink, Navigation
├── globals.css               # @theme, tokens, .scp-content
├── home-content.tsx         # Client: series grid, Daily Featured, Recently Viewed (auth-aware)
├── page.tsx                 # Home server (createStaticClient; series + daily → HomeContent)
├── loading.tsx              # Root route loading state
└── not-found.tsx            # 404

components/
├── ui/                      # Design system (see Component Library table; includes daily-featured-section, top-rated-section, recently-viewed-section, skeleton)
├── navigation.tsx           # Client nav (getUser, onAuthStateChange, renders NavigationClient)
└── navigation-client.tsx    # Client nav (top auth+menu, responsive drawer/overlay)

lib/
├── constants.ts             # Site/authorship constants (name, description, license)
├── supabase/client.ts       # Browser client (anon)
├── supabase/server.ts       # Server client (cookies, env)
├── supabase/static.ts       # createStaticClient (no cookies; static/ISR pages)
├── env.ts                   # Server env validation
├── hooks/
│   ├── use-content-links.ts # In-article link interception (SCP→client nav, external→new tab, wiki→rewrite)
│   ├── use-footnotes.ts     # Footnote tooltip handlers (refs ↔ footnote-N)
│   ├── use-scp-content.ts   # TanStack Query content fetch from SCP-Data API (direct)
│   └── use-top-rated-list.ts # Top 100 ranked `scp_id` list for reader contextual prev/next
├── providers/query-provider.tsx
├── utils/cn.ts, daily-scp.ts, json-ld.ts, loading-messages.ts, sanitize.ts, series.ts, site-url.ts
└── logger.ts

scripts/
├── dark-theme-scanner.ts    # QA: scan top 100 SCPs for dark-theme legibility issues
├── README-dark-theme-scanner.md # Scanner usage and interpretation guide
├── output/                  # Scanner JSON reports (generated artifacts)
└── seed-scps.ts             # SCP-Data API → scps table (service role)

supabase/
└── migrations/              # SQL migrations (see Database Schema)
    └── 20260205_create_user_recently_viewed.sql

docs/
└── *.md                     # Documentation
```

---

## Backlog

| Priority | Feature | Effort | Notes |
|----------|---------|--------|-------|
| 1 | Progress celebration | Medium | Range/series complete |
| 2 | Reading settings | Medium–High | Font, size, line-height (Kindle-style) |
| 3 | Search | Medium | By SCP number |
| 4 | Tags/Filters | Medium | Classification filters |
| 5 | SSO (e.g. Google Auth) | Low–Medium | Alternative to magic link |

---

*Document generated from codebase verification. Keep in sync with implementation.*
