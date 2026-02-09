# Safe Operations Playbook

This is the default workflow for all future code changes in this project.
Goal: ship safely with minimal break risk for a one-person team.

## Non-Negotiables

1. One branch per change.
2. One purpose per branch.
3. No merge unless verification passes.
4. No database-destructive migration in feature branches.
5. Rollback path must be clear before deploy.

## Standard Flow (Every Change)

1. Create a branch from `main`:
`git checkout -b codex/<short-change-name>`
2. Make the smallest possible change.
3. Run verification:
`npm run verify`
4. Run manual smoke checks:
- `/`
- `/scp/SCP-173` (or any known valid SCP)
- `/login`
- `/saved` while logged out (expects redirect to login)
- `/saved` while logged in (expects page to load)
5. Record risk log entry (template below).
6. Merge only if all checks pass and behavior matches expectation.

## Deploy Safety

1. Deploy small batches only (one feature or one fix).
2. Watch logs/errors for 15-30 minutes.
3. Revert immediately if critical behavior regresses.

## Database Safety

1. Prefer additive migrations.
2. Back up before applying schema changes.
3. Separate schema changes from feature changes when possible.

## Risk Log Template (Copy Per Change)

Date:
Branch:
Change Summary:
Potential Break Risk:
Verification Run:
Manual Smoke Results:
Rollback Plan:
Status:

## Current Known Baseline Issue

- `npm run lint` currently fails on:
`components/ui/progress-ring.tsx` (`react-hooks/set-state-in-effect`)

Do not ignore new failures. Track and resolve known baseline issues deliberately.
