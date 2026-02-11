# Reading streak tracker from `user_recently_viewed`

## TL;DR

Add a lightweight reading streak indicator (for example, "You've read 5 days in a row") using timestamps from `user_recently_viewed` to increase motivation for completion-focused readers.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- Reading activity is tracked via recently viewed entries, but no streak metric is surfaced to users.
- Users do not get feedback on reading consistency over time.
- Existing gamification is limited to completion/progress views, not daily habit reinforcement.

## Expected Outcome

- Logged-in users can see their current reading streak in days.
- Streak updates when a user reads on consecutive calendar days.
- UX messaging is encouraging but lightweight and non-intrusive.

## Scope

- Define streak rules (calendar day boundaries, timezone approach, grace/reset behavior).
- Compute streak from `user_recently_viewed` activity timestamps.
- Surface streak UI in a high-visibility location (for example, home/recently viewed area).
- Ensure duplicate views on the same day do not artificially increment streak count.

## Relevant Files

- `app/scp/[id]/actions.ts`
- `app/home-content.tsx`
- `supabase/migrations/20260205_create_user_recently_viewed.sql`

## Risks / Notes

- Day-boundary/timezone definition must be explicit to avoid confusing streak resets.
- Query strategy should stay efficient as `user_recently_viewed` grows.
- Consider behavior for users with sparse history and first-day onboarding states.

## Acceptance Criteria

- Current streak count is computed correctly from recent activity history.
- Same-day repeated reads do not increase streak.
- Missing days reset streak according to documented rules.
- Streak display does not regress existing recently viewed/progress flows.

## Suggested Labels

- `type:feature`
- `area:progress`
- `area:engagement`
- `priority:normal`
- `effort:medium`
