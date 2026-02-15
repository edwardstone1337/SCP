# Image safe mode: tap/click to reveal potentially scary images

## Status: Complete (2026-02)

Implemented as premium feature: toggle in Settings (Reading Preferences), tap-to-reveal placeholders in reader, `useImageSafeMode` hook, full keyboard/screen-reader accessibility. See CHANGELOG [Unreleased].

## TL;DR

Add an optional image safe mode in the SCP reader that hides inline images by default and reveals each image only after explicit user interaction (tap/click), reducing jump-scare moments without removing content access.

## Type / Priority / Effort

- Type: `feature`
- Priority: `high`
- Effort: `medium`

## Current State

- SCP article images render immediately as part of raw article content.
- Some entries include sudden or disturbing visuals that can feel like jump scares, especially on mobile where images appear quickly while scrolling.
- Users currently have no built-in way to opt into a safer reveal flow.

## Expected Outcome

- Users can enable an image safe mode that prevents immediate image display in article content.
- Hidden images are replaced with clear placeholders (for example: "Image hidden - tap to reveal").
- Reveal behavior is per-image and reversible in-session (hide again) or at minimum consistent across the current page.

## Scope

- Add a reader-level image safe mode toggle with a clear default and label.
- Update rendered SCP content behavior so images are hidden/revealed through explicit interaction when mode is enabled.
- Ensure placeholders and reveal controls are keyboard accessible and screen-reader friendly.
- Preserve article layout/readability as much as possible while images are hidden.

## Relevant Files

- `app/scp/[id]/scp-reader.tsx`
- `lib/utils/sanitize.ts`
- `app/globals.css`

## Risks / Notes

- SCP markup varies widely, so image handling should account for inline images, linked images, and atypical wrappers.
- Hiding images may affect visual flow on media-heavy pages; placeholder sizing strategy should avoid major layout shifts.
- Any DOM manipulation around sanitized content must keep existing security guarantees intact.

## Acceptance Criteria

- Reader exposes an image safe mode control users can enable/disable.
- When enabled, article images are not shown until the user explicitly reveals them.
- Reveal controls are operable via keyboard and announced appropriately for assistive technologies.
- Standard reader behavior remains unchanged when image safe mode is disabled.

## Suggested Labels

- `type:feature`
- `area:reader`
- `area:accessibility`
- `priority:high`
- `effort:medium`
