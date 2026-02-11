# Cookie consent for GDPR compliance

## TL;DR

Implement a GDPR-compliant cookie consent flow so non-essential tracking/cookies are blocked until user consent is granted, with clear controls to review and change preferences later.

## Type / Priority / Effort

- Type: `feature`
- Priority: `high`
- Effort: `medium`

## Current State

- The app includes analytics/tracking integration but has no explicit GDPR consent UI or preference center.
- There is no clear consent gate that prevents non-essential tracking before opt-in.
- Users cannot explicitly grant/deny categories of non-essential cookies from the UI.

## Expected Outcome

- Users in GDPR scope are shown a consent banner/modal before non-essential cookies fire.
- Non-essential analytics/tracking is disabled by default until consent is given.
- Users can later reopen settings and change consent choices.

## Scope

- Add consent UI (banner/modal) with accept, reject, and manage options.
- Implement consent state persistence and a preference update path.
- Gate analytics/tracking initialization/events behind consent checks.
- Add policy/copy hooks for legal language and retention/versioning of consent decisions.

## Relevant Files

- `components/ui/analytics.tsx`
- `lib/analytics.ts`
- `app/layout.tsx`

## Risks / Notes

- Compliance requirements vary by region and legal interpretation; legal review of final copy/behavior is required.
- Existing analytics behavior may need refactoring to ensure no pre-consent leakage.
- Need to avoid regressions in core app behavior when consent is denied.

## Acceptance Criteria

- Non-essential tracking does not initialize before consent.
- Consent choices persist and can be updated from a visible settings entry point.
- Rejecting consent keeps app fully usable with essential functionality only.
- Behavior is documented and validated in a GDPR test checklist.

## Suggested Labels

- `type:feature`
- `area:privacy`
- `area:analytics`
- `compliance:gdpr`
- `priority:high`
- `effort:medium`
