# Changelog

All notable changes to SCP Reader are documented here.

## [Unreleased]
### Added
- New `/top-rated` page listing top 100 highest-rated SCPs, with read/bookmark toggles and sign-in CTA for progress tracking
- Home page "Top Rated" section now renders top 4 entries on desktop, with responsive 1/3/4-column layout and quick links into ranked reading flow
- Dark theme QA scanner (`scripts/dark-theme-scanner.ts`) with docs (`scripts/README-dark-theme-scanner.md`) and JSON report output in `scripts/output/`
- New `docs/FEATURES.md` focused on customer-facing capabilities and value
- JSON-LD structured data for SCP pages (CreativeWork schema), series pages (CollectionPage schema), and breadcrumb navigation (BreadcrumbList schema) for improved SEO and search result rich snippets

### Changed
- SCP/series/home pages use static Supabase client (`createStaticClient`) for server data; auth-specific data (progress, recently viewed) fetched client-side where needed
- Navigation: auth state resolved client-side via `getUser` + `onAuthStateChange`; layout wraps Navigation in `Suspense` for loading
- SCP content: client fetches directly from SCP-Data API (`scp-data.tedivm.com`); internal proxy route removed
- SCP reader now preserves ranked navigation context (`context=top-rated&rank=n`) so Previous/Next follows Top 100 order when opened from top-rated links
- Sitemap now includes `/top-rated`
- Top 100 page list now defaults to rating-desc order and hides the sort dropdown to preserve rank context in links
- `sanitizeHtml` now accepts an optional custom DOMPurify instance for Node/JSDOM usage; color parsing/luminance helpers are exported for scanner reuse
- Documentation command workflow now explicitly requires updating `docs/FEATURES.md` for user-visible behavior changes

### Performance
- Removed SCP content proxy (`/api/scp-content/[contentFile]`); browser fetches directly from SCP-Data API, eliminating ~70% of Vercel origin transfer
- Converted Navigation from server to client component; auth via `getUser()` + `onAuthStateChange()` in `useEffect`
- Created `lib/supabase/static.ts` — cookie-free Supabase client for public data (avoids `cookies()` which forces dynamic rendering)
- Homepage (`/`) converted to ISR with `revalidate = 300`; user data hydrated client-side via `app/home-content.tsx`
- Series page (`/series/[seriesId]`), range page (`/series/[seriesId]/[range]`), and SCP reader (`/scp/[id]`) converted to ISR with `revalidate = 86400`; user data hydrated client-side via companion `*-content.tsx` components
- All public pages now served from Vercel edge CDN; serverless functions only run on cache miss

### Fixed
- Navigation overlay accessibility: improved focus handling, Escape handling, and explicit open/close labels/buttons
- Reader accessibility semantics: article content now uses `article` landmark + heading association, loading state announces via live region, and toggle buttons announce read/bookmark state updates
- Skip link now uses robust visually-hidden focus-reveal pattern for consistent keyboard/screen-reader behavior
- `Heading` typography component now forwards `id` so reader article content can be associated with its heading (`aria-labelledby`)
- Card component now forwards accessibility props for proper semantic markup
- Footnote tooltips broken by DOMPurify XSS prevention: `javascript:` hrefs now replaced with `#` instead of removing anchor elements, preserving tooltip functionality while neutralizing XSS vectors
- CreativeWork JSON-LD now avoids duplicate names when an SCP title matches its ID (e.g., "SCP-173")

### Removed
- Next.js middleware (session/redirect logic removed)
- `/api/scp-content/[contentFile]` proxy route

## [0.6.0] - 2026-02-10
### Added
- Google Analytics 4 integration (production only)
- GA4 custom event tracking for conversion funnel and outbound SCP wiki clicks
- Site footer with CC BY-SA 3.0 licensing attribution
- /about page with full legal attribution and project info
- Per-article author attribution on SCP reader page (creator field from API)
- Reusable Modal molecule (focus trap, animated, accessible)
- SignInPanel organism with SCP-themed copy ("Request Archive Access")
- Modal-first sign-in triggers on nav, bookmark, read, and recently viewed actions
- No-JS fallback preserved via /login page
- Reusable animation tokens (fade-in/out, slide-up/down)
- --z-skip-link token (replaces hardcoded z-index)
- QA script: qa-modal-auth-check.mjs

### Fixed
- Redirect preservation now includes pathname + search + hash
- Modified-click (Cmd/Ctrl) on sign-in links opens in new tab correctly
- URL error param scoped to page context only in SignInPanel
- recently-viewed-section sign-in link missing redirect param

### Removed
- login-form.tsx (replaced by SignInPanel)
