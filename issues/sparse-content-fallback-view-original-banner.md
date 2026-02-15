# Sparse Content Fallback: "View Original" Banner for Empty Articles

**Type:** Feature  
**Priority:** Normal  
**Effort:** Small  

## TL;DR

Some SCP articles load successfully but display near-empty content — no error state triggers, so the user sees a blank card that looks broken. Add a detection check and informational banner nudging users to view the original on the wiki.

## Current State

- 5 SCPs in Series 1–5 have &lt;100 chars of text and 0 images after recovery:

  | SCP       | Text Chars | Images | Issue                |
  |-----------|------------|--------|----------------------|
  | SCP-2212  | 0          | 0      | Completely empty     |
  | SCP-3493  | 0          | 0      | Completely empty     |
  | SCP-3677  | 0          | 0      | Completely empty (16 images in source, unrecoverable) |
  | SCP-4707  | 0          | 0      | Completely empty     |

- These pages load "successfully" — the error UI ("Failed to load content") does **not** trigger because `raw_content` exists (it's just empty/sparse).
- The user sees: article header, title, rating, bookmark/read buttons, then a near-blank content card with maybe a couple of `<hr>` tags.
- This is worse than an error — it looks like a bug rather than a known limitation.

## Expected Outcome

When rendered content is suspiciously sparse, display an **informational** banner inside the content card:

```
┌─────────────────────────────────────────────────┐
│  ℹ️  This article uses special formatting that  │
│     can't be displayed here.                     │
│                                                  │
│     [View Original on SCP Wiki →]                │
└─────────────────────────────────────────────────┘
```

- Styled in our design system (informational/neutral tone, not an error).
- "View Original" links to `https://scp-wiki.wikidot.com/{scpId.toLowerCase()}` (reuse existing `getSafeUrl` / wiki URL pattern in `scp-reader.tsx`).
- Sparse content still renders **below** the banner (in case there's partial content worth seeing).

## Detection Logic

In `scp-reader.tsx`, after sanitization, check:

```ts
const contentText = sanitizedHtml.replace(/<[^>]*>/g, '').trim()
const imgCount = (sanitizedHtml.match(/<img\b/gi) || []).length
const isSparse = contentText.length < 100 && imgCount === 0
```

If `isSparse`, render the banner above the content.

## Relevant Files

- `app/scp/[id]/scp-reader.tsx` — add sparse detection and banner component
- `app/globals.css` — banner styling (use existing design tokens)

## Notes

- This also serves as a safety net for wdfiles.com CDN outages — if recovered images fail to load, the page degrades to sparse content and the banner appears.
- The 22 "completely imageless" SCPs from the post-fix audit are candidates, but only those with truly empty text content should trigger the banner; some may have text but missing images.
- Keep the threshold conservative (&lt;100 chars **and** 0 images) to avoid false positives on legitimately short articles.
