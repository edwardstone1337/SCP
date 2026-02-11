# Estimated read time from `raw_content` on SCP pages

## TL;DR

Show an estimated read time (for example `~3 min read` or `~25 min read`) for SCP entries so users can quickly choose articles that fit their available time.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- SCP entries vary widely in length, but users have no pre-read signal for time commitment.
- Selection is currently based on title/number/context rather than expected reading duration.
- We already have `raw_content`, but no surfaced read-time metadata.

## Expected Outcome

- Each SCP page shows a simple estimated read-time label.
- Read time is computed from article content and is consistent across render paths.
- Users can make faster reading decisions based on article length.

## Scope

- Define a read-time formula (word count divided by target words-per-minute, rounded and floor-capped).
- Compute/read this value from `raw_content` during ISR/static generation path where possible.
- Display the estimate in reader UI near existing SCP metadata.
- Ensure fallback behavior when content is missing or malformed.

## Relevant Files

- `app/scp/[id]/page.tsx`
- `app/scp/[id]/scp-reader.tsx`
- `scripts/seed-scps.ts`

## Risks / Notes

- Word counting on raw text should normalize punctuation/markup artifacts to avoid noisy estimates.
- Large-content edge cases need guardrails so values remain user-friendly.
- If calculation is moved to seed time later, ensure backfill consistency for existing rows.

## Acceptance Criteria

- SCP reader displays `~X min read` for entries with available content.
- Estimate is derived from `raw_content` using a documented formula.
- Missing/invalid content does not break page rendering.
- No regressions to ISR behavior or SCP page performance.

## Suggested Labels

- `type:feature`
- `area:reader`
- `area:discovery`
- `priority:normal`
- `effort:medium`
