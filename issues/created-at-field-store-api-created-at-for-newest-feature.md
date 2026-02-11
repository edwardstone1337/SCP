# Store API `created_at` on SCP records for future "newest articles" feature

## TL;DR

The upstream API provides a `created_at` field, but we currently do not persist it. Add `created_at` to the `scps` data model and seed pipeline so we can support a "newest articles" discovery feature later.

## Type / Priority / Effort

- Type: `improvement`
- Priority: `normal`
- Effort: `small`

## Current State

- SCP records are ingested without persisting API `created_at`.
- We cannot reliably sort/browse by publication date using local data.
- Future "newest articles" UX would require schema and backfill work before it can ship.

## Expected Outcome

- `scps` table stores API `created_at` for each item.
- Seed script ingests and upserts `created_at` consistently.
- Data is available for future date-based sorting/filtering features.

## Scope

- Add additive migration for a `created_at` column on `scps`.
- Update seed mapping in `scripts/seed-scps.ts` to populate the column.
- Define parsing/normalization for API date formats and null handling.
- Document backfill step so existing rows receive `created_at` where available.

## Relevant Files

- `scripts/seed-scps.ts`
- `supabase/migrations/20260131101747_create_scps_table.sql`
- `app/top-rated/page.tsx`

## Risks / Notes

- API date format/quality may vary; parsing should be defensive.
- Need clear timezone semantics to avoid inconsistent ordering later.
- Backfill can be done through the existing seed path but should be explicitly planned.

## Acceptance Criteria

- Schema includes persisted `created_at` for SCP entries.
- Seed pipeline writes `created_at` for new and existing records (with a documented backfill step).
- No regressions in existing list queries and pages.
- Field is ready for use by a future "newest articles" feature.

## Suggested Labels

- `type:improvement`
- `area:data-model`
- `area:discovery`
- `priority:normal`
- `effort:small`
