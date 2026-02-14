# SCP Link Preview Tooltips (Navigation Popups)

## TL;DR

When a user hovers over an SCP cross-reference link inside article content, show a lightweight preview tooltip with key metadata (similar to Wikipedia Navigation Popups) so users can decide whether to click through.

## Type / Priority / Effort

- Type: `feature`
- Priority: `low (backlog)`
- Effort: `needs discovery`

## Current State

- SCP article content includes cross-reference links to other SCPs (for example, `SCP-682` mentioned in `SCP-173`).
- `useContentLinks` already identifies and routes internal SCP links.
- `useFootnotes` provides an existing inline tooltip interaction pattern.
- Clicking an SCP cross-reference currently navigates immediately with no preview context.

## Expected Outcome

- Hovering over an SCP cross-reference link (desktop) shows a preview card.
- Card includes key metadata: SCP number, title (if available), series, rating, and optionally a short 1-2 sentence excerpt.
- Users can click through to the SCP page or dismiss by moving pointer/focus away.

## Open Questions (Discovery Required)

- Data source: can preview data come from `scps` table only, or is content API fetch required for excerpt quality?
- Mobile behavior: no hover on touch; skip, long-press, or first-tap preview with second-tap navigate?
- Trigger UX: should there be a hover delay/debounce (for example, 300ms), and should nested preview-to-preview behavior be blocked?
- Link scope: apply only to article body links in `scp-reader.tsx`, or broader UI surfaces as well?
- Performance: for content with many links, should previews lazy-load on hover vs prefetch in batches?
- Reuse strategy: extend `useFootnotes` tooltip infrastructure or create a dedicated preview tooltip primitive?

## Reference

- Wikipedia Navigation Popups: https://en.wikipedia.org/wiki/Wikipedia:Tools/Navigation_popups
- Inspiration: delayed hover preview with quick dismiss behavior on mouse-out.

## Relevant Files

- `lib/hooks/use-content-links.ts`
- `lib/hooks/use-footnotes.ts`
- `app/scp/[id]/scp-reader.tsx`

## Risks / Notes

- Tooltip fatigue if trigger is too aggressive; needs tunable delay and potential user preference toggle.
- Accessibility requirements: keyboard activation, focus management, ARIA semantics, and screen reader behavior.
- Must not interfere with existing footnote tooltip interactions on the same page.

## Acceptance Criteria

- Desktop hover/focus on internal SCP cross-reference can show a preview tooltip without immediate navigation.
- Preview displays available metadata fields without blocking core link navigation.
- Behavior remains performant on pages with many SCP cross-reference links.
- Existing footnote tooltip behavior remains intact.
- Accessibility behavior is specified and testable for keyboard and assistive technology users.

## Suggested Labels

- `type:feature`
- `area:reader`
- `area:ux`
- `priority:low`
- `effort:discovery`
