# Progress celebrations for range/series completion milestones

## TL;DR

Add lightweight, on-theme celebration moments when users hit meaningful progress milestones (range complete, series complete, and key percentage milestones) to make progression feel more rewarding and motivating.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- Progress is tracked and displayed functionally, but milestone moments are mostly silent.
- Completing a range or series does not provide a distinct reward moment beyond updated progress UI.
- This can make long-term reading progress feel less motivating.

## Expected Outcome

- Users receive clear, tasteful celebration feedback at milestone moments.
- Celebrations feel consistent with SCP Reader dark theme and design tokens.
- Feedback is informative but non-intrusive and does not interrupt reading flow.

## Scope

- Define milestone triggers (for example: range complete, series complete, optional major percentage checkpoints).
- Add celebration UI patterns (toast, banner, or inline state) with accessible motion and reduced-motion support.
- Ensure celebrations trigger once per milestone and avoid spam or repeats across refresh/navigation.
- Validate behavior logged-out vs logged-in where relevant to progress persistence.

## Relevant Files

- `app/scp/[id]/scp-content.tsx`
- `components/ui/read-toggle-button.tsx`
- `app/series/[seriesId]/[range]/range-content.tsx`

## Risks / Notes

- Overly frequent celebrations can feel noisy; rate-limit or only trigger on meaningful milestones.
- Must respect `prefers-reduced-motion` and maintain accessibility contrast in dark mode.
- Need stable milestone dedupe logic to prevent repeat firing for already-earned milestones.

## Acceptance Criteria

- Milestone rules are documented and implemented.
- Celebration feedback appears on milestone completion and is visually consistent with theme.
- Repeat toggles/navigation do not retrigger already-earned milestone celebrations unexpectedly.
- No regressions in progress tracking behavior or read/unread flows.

## Suggested Labels

- `type:feature`
- `area:progress`
- `ui:celebrations`
- `priority:normal`
- `effort:medium`
