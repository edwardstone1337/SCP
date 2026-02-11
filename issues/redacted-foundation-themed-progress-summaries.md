# Redacted Foundation-themed progress summaries

## TL;DR

Restyle progress summaries with in-universe Foundation memo language (for example, "CLEARANCE LEVEL: 34.2% - [REDACTED] entries remaining") while keeping the underlying progress information clear and accessible.

## Type / Priority / Effort

- Type: `improvement`
- Priority: `normal`
- Effort: `small`

## Current State

- Progress copy is clear but purely utilitarian (for example, "You've read X of Y").
- The product tone is SCP-themed, but progress summaries do not currently reflect that voice.
- Existing progress UI does not offer an immersive "Foundation document" treatment.

## Expected Outcome

- Progress summaries feel on-brand with SCP universe flavor.
- Users still quickly understand exact completion status at a glance.
- Thematic styling remains optional/flexible if usability concerns arise.

## Scope

- Define Foundation-style copy patterns for global, series, and range progress states.
- Update progress summary components to render thematic text with readable fallback wording.
- Preserve numeric clarity (percent and counts) even with redaction flavor text.
- Validate tone consistency across key progress surfaces.

## Relevant Files

- `components/ui/progress-text.tsx`
- `components/ui/series-card.tsx`
- `components/ui/range-list-item.tsx`

## Risks / Notes

- Over-stylized language could reduce clarity for new users; keep key numbers explicit.
- Accessibility and localization/readability concerns should take precedence over theme flavor.
- Need consistent copy conventions to avoid tonal mismatch across pages.

## Acceptance Criteria

- Progress summaries adopt Foundation-themed wording across targeted components.
- Percent complete and remaining/total counts remain plainly visible.
- Updated copy passes basic readability/accessibility review in dark theme.
- No regressions in progress logic or data display formatting.

## Suggested Labels

- `type:improvement`
- `area:copy`
- `area:progress`
- `priority:normal`
- `effort:small`
