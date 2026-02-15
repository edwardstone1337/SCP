# Image Recovery v2: Remaining Syntax Patterns

**Type:** Feature Enhancement  
**Priority:** Low  
**Effort:** Medium  

## TL;DR

Image recovery v1 fixed 83 of 146 affected SCPs (57%). The remaining 63 SCPs still have missing images due to unhandled Wikidot syntax patterns. This ticket covers investigating and recovering those.

## Current State

- `recover-wikidot-images.ts` handles two patterns:
  - **Pattern A:** `[[=image]]`, `[[<image]]`, `[[>image]]`, `[[image]]` (aligned/plain image tags)
  - **Pattern B:** `[[include component:image-block name=...]]`
- 63 SCPs still have ≥1 missing image (135 total missing images across them).
- 22 SCPs are completely imageless when they should have images.

## Expected Outcome

Recover images from additional Wikidot syntax patterns, reducing the remaining 63 affected SCPs further.

## Known Gaps to Investigate

| Pattern | Example | Est. Impact |
|--------|---------|-------------|
| `[[f<image]]` / `[[f>image]]` (float variants) | `[[f<image file.png style="..."]]` | Unknown — regex exists but may not match all variants |
| CSS `background-image: url(...)` | `background-image:url(http://...field.png)` | Low — typically theme chrome, not content |
| Custom component params | `clearance-five-image=http://...`, `containment-image=...` | Low — theme/layout, not article content |
| `[[include component:image-block-wide]]` | Wide variant of image block | Unknown |
| `[[include component:image-block-quoted]]` | Quoted variant | Unknown |
| Other `[[include]]` variants with images | `image-features-source`, `image-block-peppo`, `image-block-base` | Unknown |

## Suggested Approach

1. Run debug logging on the top 10 still-affected SCPs (SCP-3677, SCP-3575, SCP-2746, etc.) to identify which patterns they actually use.
2. Group by pattern — likely 1–2 new patterns cover the majority.
3. Add regex patterns to `recover-wikidot-images.ts`.
4. Re-run audit to measure improvement.

## Top Still-Affected SCPs

| SCP | Still Missing | Rating | Notes |
|-----|---------------|--------|-------|
| SCP-3677 | 16 | 92 | Highest missing count remaining |
| SCP-3575 | 10 | 84 | |
| SCP-2746 | 8 | 46 | 30 recovered — fully broken |
| SCP-3626 | 4 | 71 | Highest-rated fully imageless |
| SCP-4444 | ? | 1,119 | High-profile, flagged in original audit |

## Relevant Files

- `lib/utils/recover-wikidot-images.ts` — add new patterns
- `scripts/image-gap-audit.mjs` — re-run for measurement
- `scripts/image-gap-audit-postfix.mjs` — post-fix measurement

## Notes

- **Diminishing returns** — v1 recovered 546 images with 167 lines. v2 targets 135 remaining images and will likely require more complex patterns for less impact.
- Some articles (CSS animations, JS-driven content, iframes) may never be recoverable via static image injection — those are Phase 2 (sparse content fallback) candidates.
