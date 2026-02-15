# Split premiumEnabled flag — upgrade CTA and premium badge hidden in production

**Type:** enhancement  
**Priority:** normal  
**Effort:** small  
**Labels:** premium, pre-launch

## TL;DR

`premiumEnabled` (lib/flags.ts) is `NODE_ENV === 'development'`, so it's always false in production. This single flag currently gates three different concerns. Split so: (1) Settings Premium badge shows whenever user has premium (not gated by flag); (2) Nav Upgrade CTA remains gated until launch; (3) Premium feature access (Stripe, Image Safe Mode) stays gated.

## Current state

| Gated by `premiumEnabled` | Current behavior in prod |
|---------------------------|---------------------------|
| Nav "Upgrade to Premium" CTA | Hidden — free users can't discover upgrade path |
| Settings Premium badge | Hidden — paying users don't see their premium status |
| Premium features (Stripe checkout, Image Safe Mode) | Correctly gated (intended for pre-launch) |

The flag does double duty: dev-only feature testing AND production UI visibility. At launch, flipping `premiumEnabled: true` would work, but it's fragile — the CTA and badge visibility shouldn't depend on the same flag that controls feature access.

## Expected outcome

- **Premium badge (Settings):** Show whenever `isPremium` — a paying user should always see their badge, regardless of `premiumEnabled` (covers early testers, manual DB grants).
- **Upgrade CTA (Nav):** Keep gated by `flags.premiumEnabled && !isPremium`. At launch, flipping the flag makes it visible.
- **Premium features:** Remain gated by `premiumEnabled` as today.

## Relevant files

- `lib/flags.ts` — add clarifying comments; consider renaming to `premiumLaunched` or `premiumCheckoutEnabled`
- `app/settings/settings-content.tsx` (~line 128) — change `flags.premiumEnabled && isPremium` → `isPremium` only
- `components/navigation-client.tsx` (~line 326) — no change needed; correctly uses `flags.premiumEnabled && !isPremium`

## Notes

- **When to fix:** Pre-launch task. Covered in docs/PREMIUM_LAUNCH.md launch checklist. Badge fix can ship anytime (no-op when nobody has premium). CTA fix is launch-day.
- **QA source:** Pre-production codebase review (40+ files). No security or data exposure risk — UI visibility only.
