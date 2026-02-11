# Related by tags: end-of-article SCP recommendations

## TL;DR

After a user finishes an SCP, show 3-4 related SCP recommendations based on shared tags to increase session depth and lore exploration.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- SCP article pages do not currently provide "next read" recommendations.
- Users must manually navigate back to lists/search to continue reading.
- Tag-based similarity is not yet surfaced in the article experience.

## Expected Outcome

- SCP pages show a compact "Related by tags" section near the end of the article.
- Recommendations are relevant, clickable, and keep users in the reading flow.
- The feature improves discovery without feeling noisy or repetitive.

## Scope

- Build relatedness logic using overlapping tags (with ranking and tie-breakers).
- Render 3-4 related SCP links at the bottom of the SCP reader page.
- Exclude the current SCP and dedupe repeated recommendations.
- Add fallback behavior when tag data is sparse/missing.

## Relevant Files

- `app/scp/[id]/page.tsx`
- `app/scp/[id]/scp-reader.tsx`
- `scripts/seed-scps.ts`

## Risks / Notes

- Depends on tags being stored first (`tags` data-model issue).
- Naive tag overlap may produce low-quality recommendations; ranking rules should be explicit.
- Need query limits and caching-aware behavior to avoid slowing page render.

## Acceptance Criteria

- SCP page displays 3-4 related items when sufficient tag data exists.
- Recommendations never include the current SCP and avoid duplicates.
- Clicking a recommendation navigates to valid SCP pages.
- Missing tag data gracefully hides or downgrades the module without breaking layout.

## Suggested Labels

- `type:feature`
- `area:discovery`
- `area:reader`
- `depends-on:tags`
- `priority:normal`
- `effort:medium`
