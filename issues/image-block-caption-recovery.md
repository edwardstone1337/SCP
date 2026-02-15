# Image-Block Caption Recovery

**Type:** Improvement  
**Priority:** Low  
**Effort:** Small  

## TL;DR

When recovering `[[include component:image-block]]` images, we currently inject only the `<img>` tag and discard the `caption=` parameter. This means recovered image-block images display without their captions, losing context the original author intended.

## Current State

- `recover-wikidot-images.ts` Pattern B extracts `name=` from image-block includes but ignores `caption=`
- Captions can contain plain text or nested Wikidot markup (e.g., `caption=[[image camera_icon.png style="width:50px;"]]` in SCP-2521)
- Recovered images render as bare `<img>` inside a `<div class="recovered-image">` with no caption

## Expected Outcome

Recovered image-block components include their caption text below the image:

```html
<div class="scp-image-block" style="text-align:center;">
  <img src="..." alt="" loading="lazy" />
  <p class="scp-image-caption">Caption text here</p>
</div>
```

## Implementation Notes

- Parse `caption=` from the pipe-delimited parameter block in `[[include component:image-block name=...|caption=...|width=...]]`
- Strip any nested Wikidot markup from caption text (e.g., `[[image ...]]` references) — plain text only for v1
- HTML-escape the caption text before injection (it goes through DOMPurify anyway, but belt and suspenders)
- **Note:** `.scp-image-caption` and `.scp-image-block` are not currently in `globals.css` — add styles if needed (Image Safe Mode already references `.scp-image-block` for width detection)

## Relevant Files

- `lib/utils/recover-wikidot-images.ts` — Pattern B parsing + `buildImageHtml`
- `app/globals.css` — add `.scp-image-block` / `.scp-image-caption` styles

## Edge Cases

| Case | v1 Handling |
|------|-------------|
| Captions containing nested `[[image]]` tags (SCP-2521) | Strip for v1, render as inline `<img>` in v2 |
| Captions with Wikidot formatting (`**bold**`, `//italic//`, `[[[links]]]`) | Strip to plain text for v1 |
| Multi-line captions | Parameter block can span lines — ensure regex captures full value |
| Empty captions (`caption=\|`) | Don't render the `<p>` element |
