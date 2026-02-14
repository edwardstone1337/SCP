# Add a "What's New" page and feedback button

## TL;DR

Create a user-facing updates feed so people can quickly see what changed and when, plus add a prominent "Give us feedback" CTA (targeting Hotjar once URL is available).

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- `CHANGELOG.md` tracks releases for contributors, but there is no user-facing in-app updates surface.
- Users have no clear, persistent in-product path to submit product feedback.
- Discovery of recent improvements depends on users checking docs/repo context externally.

## Expected Outcome

- App has a dedicated `/whats-new` page that lists updates in reverse-chronological order with clear dates.
- Navigation or footer includes an entry point to the "What's New" page.
- A "Give us feedback" button is visible on the "What's New" page (and optionally surfaced elsewhere) linking to Hotjar once available.
- Home may include a lightweight teaser (for example, latest 1-3 updates with link to full page).

## Scope

- Add a new route/page for "What's New" content.
- Define content source strategy (initially `CHANGELOG.md`-derived/manual curated entries is acceptable).
- Add feedback CTA with temporary placeholder behavior until final Hotjar URL is provided.
- Add optional homepage preview section linking to `/whats-new`.

## Relevant Files

- `app/home-content.tsx`
- `components/ui/site-footer.tsx`
- `CHANGELOG.md`

## Risks / Notes

- Need a clear ownership/update process so the "What's New" page does not become stale.
- Hotjar URL is not finalized yet; implement with configurable link and safe fallback.
- If parsing markdown changelog automatically, keep formatting assumptions minimal to avoid brittle rendering.

## Acceptance Criteria

- `/whats-new` exists and renders update items with dates.
- At least one persistent site entry point links to `/whats-new` (nav or footer).
- "Give us feedback" CTA is present and wired via configurable URL (or disabled/placeholder until set).
- Home teaser (if implemented) links to the full "What's New" page.

## Suggested Labels

- `type:feature`
- `area:discovery`
- `area:ux`
- `priority:normal`
- `effort:medium`
