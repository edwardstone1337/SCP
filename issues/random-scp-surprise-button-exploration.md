# Random SCP: "Surprise / Scare me" exploration button

## TL;DR

Add a prominent "Surprise me" / "Scare me" action that sends users to a random SCP entry, making exploration faster and more playful.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- Discovery is primarily list-driven (series, top-rated, daily featured).
- There is no single-click random exploration flow.
- Users who want serendipitous discovery must manually browse and choose entries.

## Expected Outcome

- Users can click one action and land on a valid random SCP page.
- The interaction feels fast and on-theme for the reader experience.
- The feature works consistently across logged-in and logged-out users.

## Scope

- Add a user-facing CTA for random exploration (for example on home and/or navigation).
- Implement random SCP selection logic against available SCP IDs/data.
- Route users directly to `/scp/[id]` for the selected entry.
- Handle edge cases (no result, invalid ID, repeated same item in short window).

## Relevant Files

- `app/home-content.tsx`
- `components/ui/daily-featured-section.tsx`
- `app/scp/[id]/page.tsx`

## Risks / Notes

- Truly uniform randomness may require care depending on gaps in SCP IDs/data quality.
- Need to avoid heavy query paths that could impact performance or static rendering strategy.
- Consider optional anti-repeat logic so users do not get the same SCP repeatedly.

## Acceptance Criteria

- A visible "Surprise me" (or equivalent) control exists in the UI.
- Clicking it navigates to a valid, renderable SCP page.
- The flow works without auth and does not regress existing navigation behavior.
- Error/fallback handling exists if random selection cannot return a valid entry.

## Suggested Labels

- `type:feature`
- `area:discovery`
- `area:navigation`
- `priority:normal`
- `effort:medium`
