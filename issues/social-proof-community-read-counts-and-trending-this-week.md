# Social proof: community read counts + "trending this week"

## TL;DR

Add social proof signals to make the archive feel active: per-SCP community read counts (anonymous aggregate) and a dynamic "Trending this week" list based on recent read activity.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `large`

## Current State

- Discovery surfaces focus on static/all-time dimensions (for example, top-rated).
- SCP detail pages do not show community activity counts.
- Returning users do not get a fresh, time-sensitive "what people are reading now" view.

## Expected Outcome

- SCP pages display an anonymous aggregate read count (for example, "12,847 agents have reviewed this file").
- Home/discovery includes a "Trending this week" module that updates regularly.
- Signals are lightweight, privacy-safe, and performant.

## Scope

- Add anonymous aggregate read-count storage per SCP (increment on read events).
- Surface aggregate count in SCP reader metadata area.
- Define and implement weekly trending ranking (for example, rolling 7-day read events).
- Add a cached "Trending this week" section on home/discovery surfaces.

## Relevant Files

- `app/scp/[id]/actions.ts`
- `app/home-content.tsx`
- `app/top-rated/page.tsx`

## Risks / Notes

- Needs anti-abuse/duplication guardrails (repeat toggles, bots, rapid repeats).
- Aggregate writes must stay cheap and avoid hot-row contention.
- Trending window/timezone rules should be explicit to avoid confusing shifts.

## Acceptance Criteria

- SCP detail pages show community read counts sourced from anonymous aggregates.
- Read-count updates are reflected without impacting core read/unread UX.
- "Trending this week" list renders from recent activity and updates predictably.
- No PII is exposed; only aggregate metrics are displayed.

## Suggested Labels

- `type:feature`
- `area:discovery`
- `area:engagement`
- `area:data-model`
- `priority:normal`
- `effort:large`
