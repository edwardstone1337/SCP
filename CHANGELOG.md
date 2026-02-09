# Changelog

All notable changes to SCP Reader are documented here.

## [Unreleased]
### Changed
- SCP/series/home pages use static Supabase client (`createStaticClient`) for server data; auth-specific data (progress, recently viewed) fetched client-side where needed
- Navigation: auth state resolved client-side via `getUser` + `onAuthStateChange`; layout wraps Navigation in `Suspense` for loading
- SCP content: client fetches directly from SCP-Data API (`scp-data.tedivm.com`); internal proxy route removed

### Performance
- Removed SCP content proxy (`/api/scp-content/[contentFile]`); browser fetches directly from SCP-Data API, eliminating ~70% of Vercel origin transfer
- Converted Navigation from server to client component; auth via `getUser()` + `onAuthStateChange()` in `useEffect`
- Created `lib/supabase/static.ts` — cookie-free Supabase client for public data (avoids `cookies()` which forces dynamic rendering)
- Homepage (`/`) converted to ISR with `revalidate = 300`; user data hydrated client-side via `app/home-content.tsx`
- Series page (`/series/[seriesId]`), range page (`/series/[seriesId]/[range]`), and SCP reader (`/scp/[id]`) converted to ISR with `revalidate = 86400`; user data hydrated client-side via companion `*-content.tsx` components
- All public pages now served from Vercel edge CDN; serverless functions only run on cache miss

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
