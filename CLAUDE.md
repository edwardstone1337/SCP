See @CHANGELOG.md for release history
See @docs/SAFE-OPERATIONS.md for full safe operations guide
See @docs/SYSTEM-ARCHITECTURE.md for detailed architecture
See @docs/FEATURES.md for customer-facing features

# CLAUDE.md

## Project Context

**SCP Reader** — a Next.js 16 + Supabase reading tracker for SCP Foundation completionists. Users browse SCP articles, mark as read, bookmark, and track progress through 10 series (I–X). Auth supports magic links and Google OAuth. Article content is fetched from scp-data.tedivm.com (public, CORS-enabled, daily updates). Deployed on Vercel with ISR for cost optimization (pages served from edge CDN after initial generation, costs scale with content not visitors).

## Commands

```bash
npm run dev          # Start development server (uses webpack)
npm run build        # Production build
npm run lint         # Run ESLint
npm run verify       # Run lint + build + auth smoke test (use before merge)
npm run smoke:auth   # Auth smoke test only
npm run seed         # Seed SCP data from scp-data.tedivm.com (requires .env.local)

# QA Tools
npx tsx scripts/dark-theme-scanner.ts  # Scan top 100 SCPs for dark theme issues (run after modifying lib/utils/sanitize.ts)
```

## Architecture

### Critical Constraint: Client-Side Content Fetching

**SCP article HTML content is fetched directly by the browser** via `useScpContent` hook from the public SCP-Data API (`scp-data.tedivm.com`). There is **NO server-side content proxy**.

⚠️ **DO NOT re-introduce a server-side content proxy** (e.g., `/api/scp-content/`). A previous proxy implementation generated 32 GB of Vercel origin transfer in 2 days from a single user. The upstream API is public and CORS-enabled—there is no reason to proxy it.

If you need to modify content fetching, edit `lib/hooks/use-scp-content.ts`.

### Three Supabase Client Patterns

1. **Server Client** (`lib/supabase/server.ts`): For Server Components and Server Actions. Reads cookies via Next.js `cookies()`.
2. **Browser Client** (`lib/supabase/client.ts`): For Client Components. Uses `NEXT_PUBLIC_*` env vars.
3. **Static Client** (`lib/supabase/static.ts`): Cookie-free client for static/ISR pages querying public data. Does NOT access cookies, so it won't force dynamic rendering. Only use for reading public data (relies on RLS: "Anyone can read scps"). Never use for authenticated operations.

### Database

See `supabase/migrations/` for schema. Key tables: `scps` (public, read-only), `user_progress`, `user_bookmarks`, `user_recently_viewed` (all RLS: user's own rows only via `auth.uid() = user_id`).

### Non-Obvious File Locations

- Three Supabase clients: `lib/supabase/{server,client,static}.ts`
- Content hooks: `lib/hooks/use-scp-content.ts` (API fetch), `use-footnotes.ts` (tooltip UI), `use-content-links.ts` (routing logic)
- Sanitization pipeline: `lib/utils/sanitize.ts` (DOMPurify + dark theme legibility fixes)
- Auth URL helper: `lib/utils/site-url.ts` (`NEXT_PUBLIC_SITE_URL` or browser origin fallback)
- Account deletion flow: `components/ui/delete-account-modal.tsx` + `app/actions/auth.ts::deleteAccount`

## Design System

- **CSS variables over Tailwind abstractions** for all design tokens. Tokens are defined in `app/globals.css`. Do NOT create new Tailwind theme extensions — use CSS custom properties.
- **8px grid spacing system** — all spacing values must be multiples of 8px (primitives: `--spacing-1` through `--spacing-16`, semantic tokens like `--spacing-page-padding`)
- **Tokenized colors**: background `#141414` (`--color-grey-9`), borders `#303030` (`--color-grey-8`), accent red `#e41c2c` (`--color-accent`), grey scale 1-10 (white to black). See `app/globals.css` for full token list.
- **Atomic design methodology**: Atoms (`components/ui/`), Molecules (composed components like `SeriesCard`, `Modal`, `BookmarkButton`). New components go in the appropriate atomic level.
- **Z-index scale**: Uses CSS variable tokens (`--z-skip-link`, `--z-modal`, `--z-toast`, etc.). Do not use arbitrary z-index values.

## Content Rendering Pipeline

1. **Fetch from API**: `useScpContent` fetches HTML from `scp-data.tedivm.com/data/scp/items/{contentFile}` (React Query, 1h stale, 24h gc)
2. **DOMPurify sanitization**: Strips disallowed tags/attributes, removes `.licensebox` elements, blocks `javascript:` hrefs
3. **Dark theme legibility fixes**: `applyInlineStyleLegibilityFixes` in `sanitize.ts` handles author inline styles that conflict with dark theme:
   - Replaces near-black text colors (`luminance < 0.4`) with light grey background
   - Replaces near-black border colors (`luminance < 0.15`) with grey-6
   - Adds dark text color when background is specified without explicit color
4. **Footnote handling**: `useFootnotes` attaches click/keyboard handlers to `a[id^="footnoteref-"]`, shows tooltip with footnote body on interaction
5. **Link routing**: `useContentLinks` intercepts clicks — SCP-to-SCP links use in-app navigation, external links open new tab, relative wiki paths rewritten to scpwiki.com

## ISR & Cost Strategy

**ISR (Incremental Static Regeneration) pages:**
- `/` (homepage): `revalidate = 300` (5 minutes)
- `/scp/[id]`: `revalidate = 86400` (24 hours)
- `/series/[seriesId]`: `revalidate = 86400` (24 hours)
- `/series/[seriesId]/[range]`: `revalidate = 86400` (24 hours)

**Why this matters**: Pages are pre-rendered and served from edge CDN. Costs scale with content volume (on cache miss), not visitor count. Authentication is client-side to enable static rendering of public content.

## Workflow

**IMPORTANT: Before making changes**, propose a plan in bullets and wait for approval. Keep diffs minimal — no unrequested refactors.

**Exploration first**: For unfamiliar areas, read the relevant code before proposing changes. Do not assume requirements — ask clarifying questions.

**Standard workflow** (see `docs/SAFE-OPERATIONS.md` for full details):

1. Create branch: `git checkout -b codex/<short-change-name>`
2. Make the smallest possible change
3. Run: `npm run verify` (lint + build + auth smoke test)
4. Manual smoke checks: `/`, `/scp/SCP-173`, `/login`, `/saved` (logged out and logged in)
5. Merge only if all checks pass

**Docs workflow**: For any user-visible behavior change, update `CHANGELOG.md`, `docs/SYSTEM-ARCHITECTURE.md`, and `docs/FEATURES.md`.

**Known lint baseline**: If `npm run lint` shows ONLY the `progress-ring.tsx` warning (`react-hooks/set-state-in-effect`), that's the known baseline — treat as passing. Do not introduce new lint failures.

**Logging**: No `console.log` statements — use `logger` (from `lib/logger.ts`) with context for server-side logging.

## Pitfalls

1. **DO NOT** create a server-side SCP content proxy → use direct browser fetch (see "Critical Constraint" above)
2. **DO NOT** use the browser client for Server Components → use server client (`lib/supabase/server.ts`)
3. **DO NOT** use the server/browser client in static/ISR pages if you want them to remain static → use static client (`lib/supabase/static.ts`) for public data queries
4. **DO NOT** skip the `npm run verify` step before merging → always run verify + manual smoke checks
5. **DO NOT** destructive database migrations in feature branches → use additive migrations; coordinate destructive changes on main
6. **DO NOT** use `console.log` for logging → use `logger` from `lib/logger.ts` with context
7. **DO NOT** expose `SUPABASE_SERVICE_ROLE_KEY` to client code; it is server-only (seed + account deletion server action)
