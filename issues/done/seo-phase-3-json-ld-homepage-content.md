# SEO Phase 3: Add JSON-LD (SCP + Series) and expand indexable homepage content

## TL;DR
Improve search visibility by adding structured data markup for key page types and increasing meaningful server-rendered text on the homepage so crawlers have richer, indexable context.

## Type / Priority / Effort
- Type: improvement
- Priority: normal
- Effort: medium

## Current State
- SCP and series pages have strong metadata (`title`, `description`, OG/Twitter), but no JSON-LD structured data.
- Homepage is visually branded and useful, but has relatively limited server-rendered explanatory/indexable content for SEO depth.
- Result: missed opportunities for rich snippets and lower semantic clarity for search engines.

## Expected Outcome
- SCP detail pages emit JSON-LD using `CreativeWork` schema.
- Series pages emit JSON-LD using `BreadcrumbList` schema.
- Homepage includes additional server-rendered, crawlable content (clear product intent + topical SCP index context) without sacrificing design/performance.
- Search engines have stronger structured and textual signals for ranking/snippet generation.

## Scope (Implementation Notes)
- Add JSON-LD script blocks in SSR output for:
  - SCP page (`CreativeWork`)
  - Series page (`BreadcrumbList`)
- Expand homepage with concise, indexable content sections (server-rendered), e.g.:
  - What SCP Reader is
  - How series/ranges work
  - Why use bookmarks/progress tracking
- Keep existing ISR/static behavior intact.

## Relevant Files (max 3)
- `app/scp/[id]/page.tsx`
- `app/series/[seriesId]/page.tsx`
- `app/page.tsx`

## Risks / Notes
- Ensure schema fields are valid and reflect canonical URLs (`getSiteUrl()` usage).
- Avoid duplicate/conflicting structured data if later added elsewhere.
- Keep homepage additions content-rich but not keyword-stuffed; maintain current UX and performance.
- Verify output is server-rendered and visible in page source (not client-only).

## Acceptance Criteria
- SCP pages include valid `CreativeWork` JSON-LD in HTML source.
- Series pages include valid `BreadcrumbList` JSON-LD in HTML source.
- Homepage has additional meaningful SSR copy that is crawlable and thematically aligned.
- No regression to ISR/static rendering strategy or page performance baseline.
