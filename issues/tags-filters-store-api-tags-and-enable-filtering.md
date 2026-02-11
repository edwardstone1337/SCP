# Tags/filters: store API tags and enable filtering

## TL;DR

The upstream SCP API includes a `tags` field that we do not currently persist. Add database/storage support for tags, update seeding to ingest them, and expose tag-based filtering in the UI.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- SCP records are seeded without persisting API-provided tags.
- We cannot build first-class tag filtering because tag data is missing from the local dataset.
- Users can browse by series/range, but not by thematic/content tags.

## Expected Outcome

- `scps` data model stores tags from the source API.
- Seed pipeline ingests and upserts tags reliably.
- UI can filter SCP lists by one or more tags using stored data.

## Scope

- Add a new `tags` column to the `scps` table via additive migration.
- Update seeding logic to map API tags into the new column.
- Add/extend list filtering to support tags on high-value list views.
- Ensure backward compatibility for existing rows (safe defaults, nullable or empty array handling).

## Relevant Files

- `scripts/seed-scps.ts`
- `supabase/migrations/20260131101747_create_scps_table.sql`
- `app/top-rated/page.tsx`

## Risks / Notes

- Backfill strategy is needed so old rows gain tags after migration.
- Tag format normalization (case, separators, dedupe) should be defined to avoid inconsistent filters.
- Query/index strategy may be needed if tag filtering becomes heavily used.

## Acceptance Criteria

- Database schema includes persisted tags for SCP records.
- Seeding stores tags for new and existing records (with a clear backfill step).
- At least one user-facing list view supports tag filtering end-to-end.
- No regressions in existing SCP list/query behavior.

## Suggested Labels

- `type:feature`
- `area:data-model`
- `area:discovery`
- `priority:normal`
- `effort:medium`
