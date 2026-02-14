# SEO Phase 3b: Expand Homepage with Indexable Content

## TL;DR

Add server-rendered, crawlable content sections to the homepage so search engines have stronger textual signals beyond the current series grid and top-rated cards.

## Type / Priority / Effort

- Type: `improvement`
- Priority: `normal`
- Effort: `medium` (copy-driven; requires product sign-off before implementation)

## Current State

- Homepage has series navigation grid, top-rated cards, and branding, but limited explanatory prose.
- Search engines currently receive minimal crawlable text describing what SCP Reader is, how it works, and why to use it.
- Ranking signals are likely weaker for intent-driven long-tail queries such as "track SCP reading progress" and "SCP Foundation reading order."

## Expected Outcome

- Homepage includes 3-4 concise, thematic, server-rendered content sections.
- Added content is visible to crawlers in initial HTML output (not client-only hydration).
- Improved relevance for intent-driven SEO queries without degrading visual design or performance.

## Scope

- Product drafts and approves copy before development starts.
- Add/refine below-the-fold homepage blocks (after series grid and top-rated section):
  - What is SCP Reader (one-liner + short explanatory paragraph)
  - How series work (Series I-X structure and SCP numbering)
  - Why track your progress (bookmarks, read tracking, cross-device sync)
  - Getting started (lightweight CTA to browse or sign up)
- Ensure all new content remains server-rendered in current static/ISR flow.
- Maintain design-system compliance:
  - Dark theme tokens and contrast
  - 8px spacing rhythm
  - Existing typography/component conventions
- Respect CC BY-SA 3.0 attribution requirements if SCP Foundation content is referenced directly.
- Optional: evaluate whether section IDs/anchors should be added for deep-linking.
- Out of scope: JSON-LD updates (covered in Phase 3a).

## Relevant Files

- `app/page.tsx`

## Risks / Notes

- Copy quality is the main risk; keyword stuffing or generic text can hurt SEO outcomes.
- Avoid duplicating metadata description text verbatim in body content.
- Preserve current ISR/static rendering and homepage performance profile.

## Acceptance Criteria

- Homepage includes new indexable content sections in page source (not client-only).
- Copy is product-approved before implementation begins.
- No regressions in ISR/static behavior or page performance.
- New sections are visually consistent with existing dark theme, spacing, and typography tokens.

## Suggested Labels

- `type:improvement`
- `area:seo`
- `area:homepage`
- `priority:normal`
- `effort:medium`
