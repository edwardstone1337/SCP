# Report Issue button for SCP articles

## TL;DR

Add a "Report issue" button on SCP article pages that opens a Hotjar survey, so users can report content problems (missing images, formatting, wrong text, etc.). Hotjar captures responses until a dedicated backend is built.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `small`

## Current State

- Users have no way to report issues with a specific SCP article in-app.
- Content problems (e.g. missing images, upstream render gaps, formatting) can only be discovered through external channels or manual audits.

## Expected Outcome

- A "Report issue" button appears in the SCP reader chrome (e.g. article header or footer near "Open Original Article").
- Clicking it opens a Hotjar survey, preferably with the SCP ID pre-passed (e.g. via URL param or survey variable) so responses are scoped to the article.
- Button is discoverable but not intrusive to the reading experience.

## Scope

- Add a small "Report issue" button/link in the SCP reader UI.
- Wire to configurable Hotjar survey URL (env or constant); support `{scpId}` placeholder for scoped surveys.
- If no URL configured, hide the button or show disabled/placeholder until ready.

## Relevant Files

- `app/scp/[id]/scp-reader.tsx` — reader chrome; natural place for the button
- `app/scp/[id]/scp-content.tsx` — if placement prefers content wrapper
- `lib/constants.ts` or env — Hotjar survey URL config

## Risks / Notes

- Hotjar survey URL and structure not yet defined; implement with configurable link and safe fallback.
- Ensure button opens survey in new tab so reading context is preserved.
- Consider adding `rel="noopener noreferrer"` for external link.

## Acceptance Criteria

- "Report issue" (or equivalent copy) button visible on SCP article pages when URL is configured.
- Button opens Hotjar survey in new tab.
- SCP ID is passed to survey (URL param or equivalent) when supported.
- Button hidden or disabled when URL not configured.

## Suggested Labels

- `type:feature`
- `area:reader`
- `area:ux`
- `priority:normal`
- `effort:small`
