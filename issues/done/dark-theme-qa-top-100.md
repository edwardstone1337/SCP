# Dark theme QA for top 100 SCP pages (legibility + author styling fixes)

## TL;DR

Audit the HTML rendering of the 100 highest-rated SCPs in dark mode and fix legibility problems (hardcoded dark text, invisible borders, low-contrast inline styles, and broken author-specific styling) on the pages users visit most.

## Type / Priority / Effort

- Type: `improvement`
- Priority: `high`
- Effort: `large`

## Current State

- Some SCP article HTML includes inline styles that conflict with dark mode.
- Known failure patterns include near-black text on dark backgrounds, invisible borders, and author styling that becomes unreadable after sanitization/rendering.
- Issues are discovered ad hoc, not through a systematic high-traffic audit.

## Expected Outcome

- Top 100 highest-rated SCP pages are audited with a repeatable checklist.
- Legibility issues are fixed in the sanitization/legibility pipeline (not one-off hacks per page unless absolutely necessary).
- Reader experience is consistently readable and visually stable in dark mode across those pages.

## Scope

- Build and execute a QA pass for the top 100 highest-rated SCPs.
- Categorize issues by type (text color, border contrast, background contrast, inline author style conflicts).
- Implement fixes in shared rendering/sanitization logic where possible.
- Validate no regressions on representative SCPs with complex formatting.

## Relevant Files

- `lib/utils/sanitize.ts`
- `app/scp/[id]/scp-reader.tsx`
- `lib/hooks/use-scp-content.ts`

## Risks / Notes

- Over-aggressive style normalization could remove intentional author visual semantics.
- Preserve readability while respecting SCP-specific presentation quirks.
- Watch for performance impact if additional DOM processing is added; keep transforms targeted and measurable.

## Acceptance Criteria

- Top 100 list has been audited and issue categories documented.
- Critical legibility issues are fixed for all audited pages.
- No new lint/build failures; reader still renders expected SCP content safely.
- Spot checks on high-complexity pages confirm no major styling regressions.

## Suggested Labels

- `type:improvement`
- `area:reader`
- `theme:dark-mode`
- `priority:high`
- `effort:large`
