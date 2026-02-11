# Cross-references: "mentioned in" from API `references` field

## TL;DR

Persist the API `references` field and surface a "mentioned in" section on SCP pages (for example: "This SCP is referenced in: SCP-682, SCP-079...") to support lore-driven exploration.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- Many SCP articles reference other entries, but those relationships are not surfaced in the product.
- The upstream API includes `references`, but we do not store/use it today.
- Users must manually discover cross-links, which slows the rabbit-hole reading flow.

## Expected Outcome

- SCP data model stores structured reference relationships from the API.
- SCP detail pages display a clear "mentioned in" section near the bottom.
- Users can jump directly into related SCPs to continue exploration.

## Scope

- Add storage support for API `references` in the SCP dataset.
- Update seed ingestion to persist references for new and existing records.
- Render related SCP links in the SCP reader UI with graceful empty states.
- Define normalization for reference identifiers (format, dedupe, valid-ID filtering).

## Relevant Files

- `scripts/seed-scps.ts`
- `app/scp/[id]/page.tsx`
- `app/scp/[id]/scp-reader.tsx`

## Risks / Notes

- Reference quality may vary; invalid IDs or non-standard links need filtering.
- Very high-reference pages may need truncation/expand behavior for usability.
- Bidirectional phrasing ("mentioned in") should match the actual direction of stored relationships.

## Acceptance Criteria

- `references` data is persisted from the source API.
- SCP page shows a related/mentioned-in section when data exists.
- Links navigate to valid in-app SCP routes.
- Empty or invalid reference data fails gracefully without breaking page render.

## Suggested Labels

- `type:feature`
- `area:data-model`
- `area:discovery`
- `area:reader`
- `priority:normal`
- `effort:medium`
