# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Home/Series consolidation

#### Added

- `app/loading.tsx` for root route loading state (spinner + series-style message)

#### Changed

- Series page consolidated into home (`/`): splash replaced with value-first layout (themed header SECURE CONTAIN PROTECT, Daily Featured SCP, series grid, Recently Viewed)
- `/series` now redirects to `/`
- All breadcrumbs and revalidation paths updated from `/series` to `/` (breadcrumbs on series/range/reader; `revalidatePath('/')` in read toggle action)

#### Removed

- Splash page content: CLASSIFIED warning, Continue button, full-height layout
- `app/series/loading.tsx` (redirect doesn’t need loading state)

---

### Phase 6 (Polish & Features) — Navigation overhaul & QA

#### Added

- Series I–X as primary navigation items in the full-screen menu overlay
- docs/SYSTEM-ARCHITECTURE.md: technical architecture (routes, DB, auth, design system, features, security, dev workflow, backlog)
- Select component: styled native select matching design system
- Sorting on SCP lists: Oldest First, Newest First, Top Rated, Lowest Rated
- Sorting on Saved page: Recently Saved, Oldest Saved + standard options
- BackToTop component: shows after 400px scroll, hides near bottom
- Themed loading messages: context-based (reader, series, saved, auth)
- Custom 404 page: SCP-themed "DOCUMENT NOT FOUND"
- arrow-up icon for back-to-top button
- Mobile full-screen nav overlay: "Menu" / "Close" button, overlay with Series/Saved/Sign In/Out; focus trap and Escape to close
- Active nav state: accent color + `aria-current="page"` on current route
- Series link visible for all users (logged in and out); Saved link when authenticated only
- Minimal nav on `/login`: logo + "SCP Reader" link only
- Nav on home page and 404 for the first time (nav moved to root layout)
- Design token `--shadow-elevated` (BackToTop, overlays)
- Design token `--z-nav` (nav bar z-index)
- Recently Viewed section on home page: last 5 viewed SCPs for authenticated users
- `user_recently_viewed` database table with RLS policies (select/insert/update/delete own)
- `recordView` server action — records SCP views on reader mount (upsert + cap at 5)
- Zero state for guests: "Sign in to track your reading history"
- Zero state for new users: "Articles you read will appear here"
- `RecentlyViewedSection` component (home page)
- Daily Featured SCP on home page: deterministic date-based selection (UTC), hero-style card with title, rating, and series
- `getDailyIndex` utility for date-based deterministic selection
- `DailyFeaturedSection` component

#### Changed

- Renamed app from "SCP Continuum Tracker" to "SCP Reader"
- ScpListItem card fully clickable (not just title)
- Auth error messages: "Sign in to track progress" / "Sign in to save articles"
- Removed emoji from "All articles read" message
- Button component merges caller styles instead of replacing; `forwardRef` for ref forwarding
- Link component: `forwardRef` for ref forwarding
- BookmarkButton and ReadToggleButton use stopPropagation for nested interactivity
- Auth callback: error redirect uses encodeURIComponent for login URL
- BookmarkButton: full-page redirect to login when unauthenticated; try/catch with optimistic revert and logger
- Read toggle: optional routeId revalidates current SCP page so reader badge updates
- Design tokens: spacing in Badge, Select, SkipLink, home accent bar; mobile page padding uses var(--spacing-3); BackToTop uses --shadow-elevated
- Logo, PageHeader, ProgressText converted to server components (no "use client")
- Skip link: focus position uses -9999px off-screen, top/left/padding use spacing tokens
- ScpListWithToggle: "Hide read" checkbox has htmlFor/id for accessibility
- lib/env.ts: removed startup validation console.log
- Navigation: moved to root layout (removed from 10 individual pages/loading files)
- Navigation split into server wrapper (`navigation.tsx`: fetches user, renders client) + client component (`navigation-client.tsx`: links, menu, overlay)
- Sign In / Sign Out buttons use consistent size (`md`)
- Guest redirect pattern unified: unauthenticated bookmark/read toggle uses `window.location.href` to `/login?redirect=...` with encodeURIComponent
- Navigation uses a unified Menu button across all devices (no separate desktop/mobile layouts)
- Full-screen overlay is now the primary navigation pattern at all viewport sizes
- Active state highlighting added for series sub-routes (e.g. `/series/series-3/200` highlights Series III)
- Overlay renamed from `.mobile-nav-overlay` to `.nav-overlay` and element id from `mobile-nav-menu` to `nav-menu`
- Navigation menu series links use two-column grid layout with tighter spacing (`gridTemplateColumns: '1fr 1fr'`, `gap: var(--spacing-1)`)
- Home page: recently viewed, series progress, and daily featured SCP fetched in parallel (`Promise.all`) for better performance

#### Security

- RLS enabled on scps table (SELECT for all, no write for anon)
- Seed script uses SUPABASE_SERVICE_ROLE_KEY (not anon key)

#### Removed

- `/auth/logout` route — logout via server action only (`signOut` in app/actions/auth.ts)
- console.log in lib/env.ts validation
- Desktop inline nav items (Series, Saved, auth in nav bar)
- CSS classes `.desktop-nav-items`, `.mobile-menu-button`, `.nav-email`

#### Fixed

- Bookmark revalidation uses route ID (e.g., "SCP-173") not UUID
- Duplicate SCP number display removed from list items
- BookmarkButton: try/catch with optimistic revert on error
- Read toggle revalidates current SCP page when routeId passed (reader badge updates)
- Navigation padding div wrapping (content no longer incorrectly wrapped)
- Pre-existing lint issues across 7 files (card, logo, page-header, progress-text, stack, series-card, scp-reader)
- Sign Out form in navigation overlay submits correctly without preventing default (server action still runs)
- Navigation overlay now scrollable when content exceeds viewport (`overflow-y: auto` on `.nav-overlay`)

#### Improved (accessibility & tokens)

- "Hide read" checkbox: proper label via htmlFor/id (no suppression); series/context used for a11y where relevant
- Skip-link and Button/Link: ref support (forwardRef) for focus management
- Token consistency: badge, select, back-to-top, home accent bar, mobile page padding

---

### Added

- Saved (bookmarks): `/saved` page (auth required, redirect to login); lists bookmarked SCPs with sort (Recently Saved, Oldest Saved, number, rating); `SavedList` + `ScpListItem` with Save/Read toggles
- `user_bookmarks` table: user_id, scp_id (FK scps.id), bookmarked_at; RLS (select/insert/delete own); indexes on scp_id and (user_id, bookmarked_at DESC)
- `BookmarkButton`: Save/Saved toggle, optimistic update, redirect to login if unauthenticated; used in SCP reader (header + below content) and list items
- `toggleBookmarkStatus` server action; revalidates `/scp/[id]` and `/saved`
- Nav: "Saved" link when authenticated
- Custom 404 (`app/not-found.tsx`): SCP-themed copy (DOCUMENT NOT FOUND, redacted/reclassified), Return to Archive / Home
- Loading messages: `lib/utils/loading-messages.ts` — context-based random messages (default, reader, series, saved, auth); `getLoadingMessage(context)` used in loading.tsx and login/reader
- `BackToTop` on SCP reader: fixed bottom-right, shows after scroll threshold, hides near bottom; smooth scroll to top
- Icon: `bookmark`, `bookmark-filled` for BookmarkButton
- SCP article page: Previous/Next navigation (same series); nav in header and below content
- `ScpListWithToggle` component: range list with "Hide read" checkbox (authenticated only, when any read); empty state when all filtered
- Series range page uses `ScpListWithToggle` for list + hide-read filter

- TanStack React Query: `QueryProvider` in root layout (1min default stale, 5min gc); `useScpContent(contentFile, scpId)` hook for cached SCP content from scp-data.tedivm.com (uses per-SCP `content_file` from DB)
- Supabase client utilities for App Router (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- Supabase CLI config, migrations, seed setup, link runbook (`docs/supabase-link-runbook.md`)
- `scps` table migration: id, scp_number, scp_id, title, series, rating, url, content_file, timestamps; indexes on series, number, rating, content_file; auto-updating `updated_at` trigger
- `user_progress` table: user_id, scp_id, is_read, read_at; RLS policies for authenticated users (CRUD own progress); indexes on user_id, scp_id, read status
- Database test page at `/test-data`: total SCP count, series breakdown, sample Series 1 entries
- SCP data ingestion script (`scripts/seed-scps.ts`): fetches from scp-data.tedivm.com, upserts in batches of 500 (includes `content_file` from API index); run with `npm run seed`
- Environment config template (`.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_DB_PASSWORD`, `NEXT_PUBLIC_SITE_URL`
- Magic link auth: `/login` (OTP email), `/auth/callback` (verify OTP), `/auth/error` (error page); logout via server action `signOut` in app/actions/auth.ts
- Middleware: session refresh, redirect authenticated users away from `/login`
- `getSiteUrl()` utility (`lib/utils/site-url.ts`) for auth redirect URLs

### Changed

- SCP page: fetches bookmark status for authenticated user; passes `is_bookmarked` to reader
- Series range page: fetches bookmarks for range; passes `is_bookmarked` to `ScpListWithToggle` / `ScpListItem`
- SCP reader: BookmarkButton in header and below content; Read toggle below article; Prev/Next repeated below content; `BackToTop` below content
- `ScpListItem`: `isBookmarked` prop and `BookmarkButton`; uses DB UUID for bookmark/read actions
- Loading states: series/range/scp/saved/login use `getLoadingMessage(context)` for spinner text
- Home page: Phase 3 status, auth status (signed in / sign out), database connection status, link to `/test-data`; "Ready for Phase 4: The Tracker"
- README: project title, env setup steps, Supabase migrations/seed/runbook section

### Removed

- Docs: `discovery-page-markup-patterns.md`, `discovery-scp-content-loading.md`, `discovery-theme-vs-root-tokens.md`

### Fixed

- Series 6+ SCPs (e.g. SCP-9600) now load content: reader uses per-SCP `content_file` from DB instead of series-derived filename (`content_series-N.json`); `content_file` migration and seed script populate from API index
- Connection status treats "relation does not exist" / "Could not find the table" as "Connected (no tables yet)" instead of an error
- README phase description now matches current state (Phase 3: Authentication)
