# Polish sign-in modal UI and add Google OAuth alongside magic link

## TL;DR

Upgrade the sign-in experience to feel more on-brand and reduce login friction by adding a first-class `Continue with Google` path while keeping magic link as a fallback.

## Metadata

- Type: `feature` (with UX improvement scope)
- Priority: `normal`
- Effort: `medium`

## Current State

- Sign-in UI is functional but visually basic and less "premium/on-theme" than the rest of the app.
- Auth flow is magic-link only (`signInWithOtp`), which adds inbox-switch friction.
- Google OAuth is already hinted in code but currently commented out in the panel.

## Expected Outcome

- Sign-in modal/page has polished, on-theme hierarchy and spacing consistent with existing design tokens.
- Users can authenticate with:
  - `Continue with Google` (primary low-friction option)
  - `Email magic link` (fallback/alternative)
- OAuth callback continues to honor safe redirect behavior after login.

## Relevant Files

- `components/ui/sign-in-panel.tsx`
  - Add Google OAuth action and modal/page UX polish.
- `app/auth/callback/route.ts`
  - Ensure callback/error messaging works cleanly for OAuth + existing magic link flow.
- `app/login/page.tsx`
  - Keep page variant aligned with modal polish and loading/fallback UX.

## Acceptance Criteria

- Google OAuth button is visible and functional in sign-in modal and login page.
- Clicking Google starts Supabase OAuth flow and returns user to intended route (`redirect`/`next`).
- Magic link flow still works unchanged.
- Sign-in UI uses existing spacing/color/token system and feels consistent with app chrome.
- Error states are clear for both OAuth and magic link failures.
- No regressions in auth analytics events or modal close behavior.

## Risk / Notes

- Requires Google provider enabled/configured in Supabase and matching redirect URIs.
- Must preserve static/ISR strategy (no server-side content proxy side effects).
- Keep scope tight: no auth architecture refactor, only UX + provider addition.

## Suggested Labels

- `type:feature`
- `area:auth`
- `area:ui-ux`
- `priority:normal`
- `effort:medium`
