# Changelog

All notable changes to SCP Reader are documented here.

## [Unreleased]

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
