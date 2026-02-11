# Achievements and lifetime stats accumulation (never goes down)

## TL;DR

Add permanent, non-decreasing achievement and stats systems: lifetime total articles read, series completion badges, and milestone unlocks (10/50/100/500/1000) with SCP-themed progression language.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `large`

## Current State

- Current progress metrics primarily reflect current completion state, which can fluctuate.
- There is no permanent "lifetime reviewed files" counter that only increases.
- Series completion and milestone accomplishments are not persisted as durable achievements.

## Expected Outcome

- Users see a satisfying lifetime read counter that never decreases.
- Completing a series grants a permanent badge/achievement.
- Read milestones unlock themed achievements and remain permanently earned.

## Scope

- Define immutable stats model (lifetime reads, series badges, milestone unlocks).
- Add persistence for achievements so they survive unreads/toggles and future data recalculations.
- Implement unlock logic for thresholds: 10, 50, 100, 500, 1000 reads.
- Expose achievements/stats in profile/home/progress surfaces with SCP-themed copy.

## Relevant Files

- `supabase/migrations/20260131103100_create_user_progress_table.sql`
- `app/scp/[id]/scp-content.tsx`
- `components/ui/badge.tsx`

## Risks / Notes

- Requires clear separation between mutable completion state and immutable lifetime achievements.
- Backfill and edge-case handling are needed for existing users with historical progress.
- Must prevent double-counting and race conditions during rapid read/unread interactions.

## Acceptance Criteria

- Lifetime read counter only increases and never decreases.
- Series completion awards permanent badges that remain earned.
- Milestones at 10/50/100/500/1000 unlock exactly once and persist.
- Achievement/state logic remains consistent across refresh, devices, and re-syncs.

## Suggested Labels

- `type:feature`
- `area:progress`
- `area:engagement`
- `area:data-model`
- `priority:normal`
- `effort:large`
