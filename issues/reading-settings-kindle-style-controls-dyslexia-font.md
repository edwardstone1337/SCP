# Reading settings: Kindle-style typography controls + dyslexia-friendly font

## TL;DR

Add per-user reading settings for SCP content pages with Kindle-style controls (font size, font family, line height) and a dyslexia-friendly font option to improve readability and accessibility.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `medium`

## Current State

- Reader typography is mostly static and driven by global/theme defaults.
- Users cannot personalize key reading variables like font size, line height, or typeface.
- There is no explicit dyslexia-friendly reading mode/font option.

## Expected Outcome

- Users can adjust reading typography in the SCP reader with simple, discoverable controls.
- Preferences persist per user/session (as appropriate) and apply consistently across SCP pages.
- A dyslexia-friendly font option is available and integrated into the same settings model.

## Scope

- Add reader controls for font size, font family, and line height (Kindle-style UX).
- Add dyslexia-friendly font toggle/selection as a first-class option.
- Persist settings and restore them automatically on subsequent page views.
- Ensure controls and rendered content remain accessible and dark-theme compatible.

## Relevant Files

- `app/scp/[id]/scp-reader.tsx`
- `app/scp/[id]/scp-content.tsx`
- `app/globals.css`

## Risks / Notes

- Must avoid layout breakage in complex SCP HTML when line-height/font changes are applied.
- Font loading and fallback behavior should avoid CLS/perf regressions.
- Ensure settings do not conflict with sanitization/content rendering logic.

## Acceptance Criteria

- Reader exposes controls for font size, family, and line height.
- Dyslexia-friendly font option can be selected and visibly applied.
- Settings persist and are reapplied after refresh/navigation.
- No regressions in SCP content rendering, readability, or dark-theme contrast.

## Suggested Labels

- `type:feature`
- `area:reader`
- `area:accessibility`
- `priority:normal`
- `effort:medium`
