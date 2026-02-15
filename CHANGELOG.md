# Changelog

All notable changes to SCP Reader are documented here.

## [Unreleased]
### Added
- **HeroSection** (`app/hero-section.tsx`): Auth-aware hero ("SECURE CONTAIN PROTECT" for guests; "Welcome back, Researcher" for signed-in)
- **ProfileDropdown**: Avatar-based account menu for signed-in users; Settings and Sign Out in dropdown
- **Avatar, MenuItem, PremiumBadge, SectionLabel, Toggle** UI components
- **docs/scp-data-api-shape.md**: API response shape and field documentation for SCP-Data
- **20260215_enforce_premium_preferences.sql**: RPC rejects non-premium `imageSafeMode` updates
- **Premium tier (Clearance Level 5):** Stripe-powered upgrade flow; users can purchase lifetime premium from nav menu or Settings; checkout success/cancel redirects to `/premium/success` and `/premium/cancelled`
- **Image Safe Mode:** Premium feature that hides article images by default with tap-to-reveal placeholders; toggle in Settings (Reading Preferences); uses `user_profiles.preferences.imageSafeMode`
- **Settings page (`/settings`):** Protected route for reading preferences and account; Reading Preferences (Image Safe Mode toggle, premium-gated); Account section with Delete Account in Danger Zone
- **user_profiles table:** Stores `premium_until` (Stripe-managed) and `preferences` JSONB; auto-created on signup; `update_user_preferences` RPC for preference writes
- **Stripe integration:** `/api/stripe/checkout` (POST) creates checkout session; `/api/stripe/webhook` handles `checkout.session.completed` and sets `premium_until` via service role
- **PremiumGate and UpgradeModal components:** Gate premium features behind sign-in + premium status; modal opens Stripe checkout
- **usePreferences, usePremium, useImageSafeMode hooks:** TanStack Query-backed preference/premium checks; DOM-based image hide/reveal with placeholders, eye-off SVG icon, full keyboard/screen-reader accessibility
- **Feature flag (`lib/flags.ts`):** `premiumEnabled` (dev only), `maintenanceMode`, `degradedMode`; Premium upgrade UI hidden in production; all infrastructure (Stripe routes, DB, webhooks) deployed but UI gated; see `docs/PREMIUM_LAUNCH.md` for launch checklist
- **Maintenance mode:** SCP-themed "FOUNDATION ARCHIVE COMPROMISED" full-page lockdown; activated via `NEXT_PUBLIC_MAINTENANCE_MODE=true`; `proxy.ts` rewrites all non-API routes to `/maintenance`; self-contained inline styles, skips API routes for Stripe webhooks
- **Degraded mode:** Warning banner ("PARTIAL CONTAINMENT FAILURE"); activated via `NEXT_PUBLIC_DEGRADED_MODE=true`; design-token compliant; renders in layout when `degradedMode` flag is on
- Google OAuth sign-in: users can now sign in with their Google account via "Continue with Google" button, available in both the sign-in modal and `/login` page; magic link remains as an alternative
- `getSiteUrl()` now auto-detects the current browser origin when `NEXT_PUBLIC_SITE_URL` is not set, fixing OAuth redirect mismatches in local dev
- Analytics `sign_in_submit` event now includes `sign_in_method` property (`magic_link` or `google`) to distinguish auth methods
- Account deletion flow: signed-in users can permanently delete their account from Settings > Account > Danger Zone (with confirmation modal), including progress, bookmarks, and recently viewed data
- Home page now shows a dismissible success toast after account deletion (`/?account_deleted=true`)
- Toast atom (`components/ui/toast.tsx`): reusable, auto-dismissing notification with success/error variants and close button
- Delete account confirmation modal (`components/ui/delete-account-modal.tsx`): warns about permanent data loss, requires explicit confirmation
- New legal pages: `/privacy` (Privacy Policy) and `/terms` (Terms of Service), linked from the site footer
- New `/top-rated` page listing top 100 highest-rated SCPs, with read/bookmark toggles and sign-in CTA for progress tracking
- Home page "Top Rated" section now renders top 4 entries on desktop, with responsive 1/3/4-column layout and quick links into ranked reading flow
- Dark theme QA scanner (`scripts/dark-theme-scanner.ts`) with docs (`scripts/README-dark-theme-scanner.md`) and JSON report output in `scripts/output/`
- New `docs/FEATURES.md` focused on customer-facing capabilities and value
- JSON-LD structured data for SCP pages (CreativeWork schema), series pages (CollectionPage schema), and breadcrumb navigation (BreadcrumbList schema) for improved SEO and search result rich snippets
- Homepage now injects JSON-LD `WebApplication` and `WebSite` schemas for better homepage search context
- New guest onboarding block on home ("New to the Foundation?") with quick actions: classics, top-rated, and random file
- **Title enrichment:** Script `scripts/enrich-titles.ts` (npm run enrich-titles) populates `scps.title` from SCP Wiki series index pages; 9,246 entries updated. The remaining ~78 entries have no ` - ` separator on the index and continue to display the SCP number only.

### Changed
- **SCP page metadata:** Document title and meta description use descriptive title when available (e.g. "The Sculpture | SCP-173"); otherwise SCP number only.
- **Recent Files:** Home shows up to 6 recently viewed items in a responsive grid (1/2/3 columns); cards display descriptive title when available, with SCP number below.
- **Guest home sections:** Notable Anomalies and "New to the Foundation?" wait for auth to resolve before rendering, avoiding brief flash of content for signed-in users.
- **Typography consolidation:** `Heading`, `Text`, `Mono`, `Label` merged into `typography.tsx`; standalone heading, hero-subhead, label, message, text components removed
- **Navigation:** Signed-in users see avatar ProfileDropdown (Settings, Sign Out); overlay shows Series, Notable Anomalies, Upgrade (if applicable), Saved; Delete Account moved to Settings > Account > Danger Zone
- Navigation overlay: Upgrade to Premium link for signed-in non-premium users
- `lib/env.ts` now requires Stripe env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PRICE_ID` (used by checkout and webhook routes)
- Sign Out and Settings moved into ProfileDropdown (avatar menu); top bar shows Sign In (logged out), ProfileDropdown + Menu (logged in)
- SCP/series/home pages use static Supabase client (`createStaticClient`) for server data; auth-specific data (progress, recently viewed) fetched client-side where needed
- Navigation: auth state resolved client-side via `getUser` + `onAuthStateChange`; layout wraps Navigation in `Suspense` for loading
- SCP content: client fetches directly from SCP-Data API (`scp-data.tedivm.com`); internal proxy route removed
- SCP reader now preserves ranked navigation context (`context=top-rated&rank=n`) so Previous/Next follows Top 100 order when opened from top-rated links
- Sitemap now includes `/top-rated`
- Top 100 page list now defaults to rating-desc order and hides the sort dropdown to preserve rank context in links
- `sanitizeHtml` now accepts an optional custom DOMPurify instance for Node/JSDOM usage; color parsing/luminance helpers are exported for scanner reuse
- Documentation command workflow now explicitly requires updating `docs/FEATURES.md` for user-visible behavior changes
- Homepage copy and section labels now use SCP dossier terminology ("Daily Briefing", "Notable Anomalies", "Recent Files", "Containment Series")
- Added home section dividers plus subtle background texture and top classification stripe for stronger themed presentation

### Performance
- Removed SCP content proxy (`/api/scp-content/[contentFile]`); browser fetches directly from SCP-Data API, eliminating ~70% of Vercel origin transfer
- Converted Navigation from server to client component; auth via `getUser()` + `onAuthStateChange()` in `useEffect`
- Created `lib/supabase/static.ts` — cookie-free Supabase client for public data (avoids `cookies()` which forces dynamic rendering)
- Homepage (`/`) converted to ISR with `revalidate = 300`; user data hydrated client-side via `app/home-content.tsx`
- Series page (`/series/[seriesId]`), range page (`/series/[seriesId]/[range]`), and SCP reader (`/scp/[id]`) converted to ISR with `revalidate = 86400`; user data hydrated client-side via companion `*-content.tsx` components
- All public pages now served from Vercel edge CDN; serverless functions only run on cache miss

### Fixed
- Error handling and logging in settings page and `usePremium` hook; avoids silent failures when profile fetch fails
- Replaced `console.log` with `logger` in `useFootnotes`; removed stray debug logging
- Navigation: added mounted guard in `onAuthStateChange` handler to prevent state updates after unmount
- Navigation overlay accessibility: improved focus handling, Escape handling, and explicit open/close labels/buttons
- Reader accessibility semantics: article content now uses `article` landmark + heading association, loading state announces via live region, and toggle buttons announce read/bookmark state updates
- Skip link now uses robust visually-hidden focus-reveal pattern for consistent keyboard/screen-reader behavior
- `Heading` typography component now forwards `id` so reader article content can be associated with its heading (`aria-labelledby`)
- Card component now forwards accessibility props for proper semantic markup
- Footnote tooltips broken by DOMPurify XSS prevention: `javascript:` hrefs now replaced with `#` instead of removing anchor elements, preserving tooltip functionality while neutralizing XSS vectors
- CreativeWork JSON-LD now avoids duplicate names when an SCP title matches its ID (e.g., "SCP-173")
- Fixed focus restoration bug in navigation overlay that could steal focus on re-renders
- Fixed toast exit animation timer not being cleaned up on unmount
- Added error handling and unmount guards to core client-side auth/user-data hydration effects (home, navigation, SCP, series, range, top-rated)
- Added URL scheme validation for external wiki links to prevent protocol-based XSS
- Fixed incorrect CSS variable names in content sanitizer (--grey-* → --color-grey-*)
- Replaced `any` types with proper DOMPurify types in sanitizer
- Switched auth callback to use centralized Supabase client with env validation

### Removed
- **Standalone typography components:** `heading.tsx`, `hero-subhead.tsx`, `label.tsx`, `message.tsx`, `text.tsx` (replaced by `typography.tsx` exports)
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
