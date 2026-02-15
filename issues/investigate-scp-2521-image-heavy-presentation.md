# Investigate SCP-2521 (image-heavy) presentation on the website

**Type:** bug · **Priority:** normal · **Effort:** small (investigation first)

## TL;DR

SCP-2521 is a top-rated article that is mostly visual/image-based. When opened from top-rated context (e.g. `?context=top-rated&rank=2`), it may not present correctly in the in-app reader. Investigate what fails (content fetch, sanitization, image sources, layout) and either fix presentation or document a clear fallback (e.g. “View on Wiki” prominence).

## Current state

- User opens `/scp/SCP-2521?context=top-rated&rank=2` (from Top Rated flow).
- Article is “mostly an image” — may render as near-empty, broken images, or wrong aspect/sizing in `.scp-content`.

## Expected outcome

- Either: image-heavy SCPs (including SCP-2521) render correctly in the reader (images load, layout is usable).
- Or: we have a defined behavior (e.g. strong “Open original article” when content is minimal or image-only) and any known limitations documented.

## Investigation steps

1. **Content source:** Confirm SCP-Data API returns content for SCP-2521 and what the HTML structure is (e.g. one big image, Wikidot image URLs).
2. **Sanitization:** Check whether `lib/utils/sanitize.ts` or DOMPurify config strips or alters the relevant tags (e.g. `<img>`, wrapper divs).
3. **Image URLs:** If images reference Wikidot or other domains, check CORS / hotlink policy and whether we need to proxy or rewrite URLs (without re-introducing a full content proxy; see CLAUDE.md).
4. **Layout/CSS:** Review `.scp-content` in `app/globals.css` for image rules (max-width, aspect ratio) and whether they work for a single large or full-bleed image.
5. **Fallback:** Ensure “Open original article” (or equivalent) is visible and helpful when in-app presentation is limited.

## Relevant files

- `app/scp/[id]/scp-reader.tsx` — content render, error/retry and “Open original” UI
- `lib/hooks/use-scp-content.ts` — fetch from SCP-Data API
- `lib/utils/sanitize.ts` — DOMPurify and allowed tags/attributes for images
- `app/globals.css` — `.scp-content` and `img` styles

## Risk / notes

- **No server-side content proxy:** Content is fetched client-side from scp-data.tedivm.com; image URLs in that HTML may point to Wikidot or others. Fixes must not reintroduce a server proxy for full article HTML (per CLAUDE.md).
- If the fix is “prominent link to wiki” only, update docs/FEATURES.md or SYSTEM-ARCHITECTURE to note limitation for image-heavy articles.

## Labels

`bug` `investigation` `reader` `content`
