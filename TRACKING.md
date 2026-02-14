# Analytics & Tracking

## Overview
SCP Reader uses Google Analytics 4 for basic usage analytics. No other tracking, advertising, or third-party analytics tools are in use.

## Google Analytics 4
- **Property ID:** G-1TXXCCK1WN (configured via `NEXT_PUBLIC_GA_ID`)
- **Implementation:** `components/ui/analytics.tsx` via `next/script` (`afterInteractive`)
- **Environment:** Production only (gated on `NODE_ENV`)
- **Data collected:** Standard GA4 pageviews and selected custom conversion/engagement events
- **PII:** No personally identifiable information is sent to GA. Supabase user IDs are not passed to analytics.

## Cookie Consent
- **Current state:** No cookie consent banner implemented.
- **Risk:** GA4 sets cookies (`_ga`, `_gid`). Under GDPR/ePrivacy, users in the EU/EEA should consent before non-essential cookies are set. Australian Privacy Act is less strict but evolving.
- **Recommendation:** Add a lightweight cookie consent mechanism before significant EU traffic is expected. For launch, this is low priority given the niche audience but should be revisited.

## Custom Events

| Event Name | Trigger | Parameters | Purpose |
| --- | --- | --- | --- |
| `sign_in_modal_open` | User triggers auth from any entry point | `trigger_source`: `nav`, `bookmark`, `read_toggle`, `recently_viewed`, `top_rated` | Identify which actions drive sign-up intent |
| `sign_in_submit` | User submits sign-in action in `SignInPanel` (magic link or Google) | `sign_in_method`: `magic_link` or `google` | Measure modal/page sign-in conversions by method |
| `sign_in_modal_close` | User closes modal without submitting | `trigger_source` | Measure drop-off by trigger |
| `auth_complete` | User returns from auth verification/callback | — | Measure end-to-end conversion |
| `outbound_wiki_click` | User clicks "View original on SCP Wiki" | `scp_id` | Track content leakage to source wiki |

When adding new events, define the typed function in `lib/analytics.ts` first, then update this table. The utility file is the single source of truth for event names and parameters.

## Related Files
- `components/ui/analytics.tsx` — GA4 script loader
- `app/layout.tsx` — Analytics mount point
- `lib/analytics.ts` — Typed GA4 custom event utility
- `components/ui/auth-complete-tracker.tsx` — Client-side `auth=complete` handler and URL cleanup
- `app/auth/callback/route.ts` — Server-side auth success redirect annotates `auth=complete`
