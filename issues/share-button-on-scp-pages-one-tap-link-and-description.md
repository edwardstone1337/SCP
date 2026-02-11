# Share button on SCP pages (one-tap link + description)

## TL;DR

Add a "Share this SCP" action on SCP pages that generates a pre-formatted share payload (link + short description) so users can quickly post to Discord, Reddit, and other platforms.

## Type / Priority / Effort

- Type: `feature`
- Priority: `normal`
- Effort: `small`

## Current State

- SCP pages do not have a dedicated one-tap sharing action.
- Users must manually copy URLs and write context when sharing.
- This adds friction for common community behavior (Discord/Reddit sharing).

## Expected Outcome

- SCP pages include a clear share CTA.
- Share action uses native share when available, with copy-to-clipboard fallback.
- Shared payload includes a clean link and concise descriptive text.

## Scope

- Add share UI on SCP detail pages near title/meta/actions.
- Build pre-formatted share text from SCP metadata (title/id + URL + short prompt).
- Use `navigator.share` where supported; fallback to clipboard copy with success feedback.
- Ensure sharing works on desktop/mobile and preserves canonical route URLs.

## Relevant Files

- `app/scp/[id]/scp-reader.tsx`
- `app/scp/[id]/scp-content.tsx`
- `app/scp/[id]/page.tsx`

## Risks / Notes

- Platform-specific formatting can vary; keep payload generic and readable.
- Clipboard and share APIs require permission/feature detection and graceful fallback.
- Avoid overlong share text and ensure no unsafe content is injected.

## Acceptance Criteria

- A visible "Share this SCP" action exists on SCP pages.
- On supported devices, native share sheet opens with prefilled content.
- On unsupported devices, link/text can be copied in one tap with user feedback.
- No regressions to existing SCP page actions/layout.

## Suggested Labels

- `type:feature`
- `area:reader`
- `area:growth`
- `priority:normal`
- `effort:small`
