# Object class filter on series pages (Safe/Euclid/Keter) from tags

## TL;DR

Add object-class filtering on series pages so readers can quickly narrow to `Safe`, `Euclid`, or `Keter` entries based on tag data.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- Series pages show SCPs by range/listing but do not support intensity-based filtering.
- Users cannot quickly self-select by object class without manual scanning.
- Object class data exists in tags but is not exposed as a dedicated filter UX.

## Expected Outcome

- Users can filter series/range lists by object class (`Safe`, `Euclid`, `Keter`).
- Filter behavior is fast, clear, and consistent with existing list controls.
- URLs/state can preserve the selected filter for shareability and navigation continuity.

## Scope

- Add object class filter controls on series and/or range pages.
- Map tags to normalized object class values (including case/format normalization).
- Apply filter logic to displayed SCP list results and counts.
- Handle missing/ambiguous class tags with graceful fallback behavior.

## Relevant Files

- `app/series/[seriesId]/page.tsx`
- `app/series/[seriesId]/[range]/page.tsx`
- `scripts/seed-scps.ts`

## Risks / Notes

- Depends on tags being stored and queryable first (`tags` data-model issue).
- Tag inconsistencies may require normalization rules and alias handling.
- Filter interactions should not regress static/ISR performance characteristics.

## Acceptance Criteria

- Series/range pages expose object class filters for `Safe`, `Euclid`, and `Keter`.
- Filtering updates list results correctly and excludes non-matching entries.
- Missing class tags do not break rendering and are handled predictably.
- Filter state is retained through expected navigation patterns.

## Suggested Labels

- `type:feature`
- `area:discovery`
- `area:series-pages`
- `depends-on:tags`
- `priority:normal`
- `effort:medium`
