# Hide ratings user preference

## TL;DR

Add a setting so users can hide SCP ratings (scores) everywhere in the app. Stored in existing `user_profiles.preferences` and toggled in Settings.

## Current state

- Ratings are shown in list items, featured sections, top-rated page, SCP reader header, and saved list.
- There is no way to hide them.

## Expected outcome

- **Settings**: New "Hide ratings" toggle under Reading Preferences (or a "Display" section).
- **When enabled**: Rating values (e.g. "★ 4.2", "Rating: 4.5") are not shown anywhere. Sort options like "Top Rated" / "Lowest Rated" can remain (sorting still by rating, just not displaying the number) — implementer can decide.
- **When disabled / default**: Current behavior (ratings visible).
- **Logged-out users**: No preference → show ratings (current behaviour).

## Relevant files

- **Preference + settings UI**
  - `lib/hooks/use-preferences.ts` — add `hideRatings?: boolean` to `UserPreferences`.
  - `app/settings/settings-content.tsx` — add toggle for "Hide ratings" (no premium gate).
- **Where ratings are displayed (conditionally hide)**
  - `components/ui/scp-list-item.tsx` — rating text in list rows.
  - `components/ui/top-rated-section.tsx` — "Rating: {scp.rating}".
  - `components/ui/daily-featured-section.tsx` — "Rating: {scp.rating}".
  - `app/scp/[id]/scp-reader.tsx` — "★ {scp.rating}" in header.
  - `app/saved/saved-list.tsx` — rating passed to `ScpListItem`; consider sort labels.
  - `app/top-rated/top-rated-content.tsx` — list items show rating.
  - `components/ui/scp-list-with-toggle.tsx` — list items show rating.

## Notes

- Reuse existing preferences flow: `usePreferences(userId)`, `updatePreference('hideRatings', boolean)`. No DB migration needed (JSONB `preferences` already exists).
- If many components need the flag, consider a small preferences context or passing `hideRatings` down from pages that already load preferences (e.g. settings, reader); list components used on static/ISR pages may need the preference passed from a client parent that has `userId`.
- **Top-rated page**: Still ordered by rating; only the displayed number is hidden when the preference is on.

## Labels

- **Type:** feature
- **Priority:** normal
- **Effort:** medium
