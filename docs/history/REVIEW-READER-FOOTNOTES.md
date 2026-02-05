# Code Review: Reader typography, layout & footnote system

**Scope:** `app/globals.css` (.scp-content), `lib/hooks/use-footnotes.ts`, `app/scp/[id]/scp-reader.tsx` (footnote integration)  
**Reference:** Design tokens in `@theme static` in `app/globals.css`.

---

## Design tokens

| Check | Result | Notes |
|-------|--------|--------|
| All colors use CSS variables | **ISSUE** | One hardcoded value (see below). |
| All spacing use `var(--spacing-*)` | **ISSUE** | Hardcoded `2px` and transition duration (see below). |
| All font sizes use `var(--font-size-*)` | **PASS** | Intentional relative `0.75em` on sup/sub and footnote ref. |
| All border-radius use `var(--radius-*)` | **ISSUE** | One hardcoded `2px` (see below). |
| `--font-family-mono` vs `--font-mono` | **PASS** | globals.css uses `--font-family-mono`; @theme defines both (--font-mono is alias). |
| `var(--shadow-elevated)` in tooltip | **PASS** | use-footnotes.ts uses it. |
| Every token exists in @theme | **PASS** | Token audit below. |

---

## CSS patterns

| Check | Result | Notes |
|-------|--------|--------|
| No Tailwind in .scp-content | **PASS** | Only class name and element selectors. |
| No duplicate/conflicting rules | **ISSUE** | Duplicate `.scp-content a` blocks (see below). |
| Logical rule order | **PASS** | Base → elements → Phase 1 → Phase 2. |
| No `!important` | **ISSUE** | Used intentionally to override API inline styles; documented. |
| Table `display: block` + `width: 100%` | **PASS** | Intentional for horizontal scroll; block + width:100% is valid. |

---

## Hook quality (use-footnotes.ts)

| Check | Result | Notes |
|-------|--------|--------|
| Logger for error cases | **ISSUE** | Missing footnote target returns silently; no logger. |
| No console.log/console.error | **PASS** | None. |
| Event listeners cleaned up | **PASS** | Teardowns + dismiss() in effect cleanup. |
| Tooltip removed from DOM on cleanup | **PASS** | dismiss() removes tooltip; cleanup calls dismiss(). |
| No memory leak risks | **PASS** | Refs and closures scoped to effect; cleanup clears all. |
| No `any` / @ts-ignore / missing types | **PASS** | Typed throughout. |
| Testable / pure logic separated | **LOW** | getFootnoteText is pure; createTooltipElement/showTooltip are DOM-heavy. |

---

## Accessibility

| Check | Result | Notes |
|-------|--------|--------|
| Tooltip has `role="tooltip"` | **PASS** | Line 18. |
| Footnote refs: role, tabindex, keyboard | **PASS** | role="button", tabindex="0", Enter/Space. |
| aria-describedby set when open, removed when closed | **PASS** | Set in openTooltip; cleared in dismiss(). |
| Tooltip content reachable by screen readers | **PASS** | aria-describedby links ref to tooltip. |
| Focus management | **PASS** | Focus stays on ref; tooltip not focusable. |

---

## Integration in scp-reader.tsx

| Check | Result | Notes |
|-------|--------|--------|
| Ref properly typed | **PASS** | `useRef<HTMLDivElement>(null)` matches `RefObject<HTMLElement \| null>`. |
| Hook called at right point | **PASS** | After useScpContent; `!!content` gates effect. |
| No unnecessary re-renders | **PASS** | Hook has no state; effect deps [contentLoaded, containerRef] stable. |

---

## Issues found

### globals.css

- **[MEDIUM]** `app/globals.css:314` — Hardcoded color `rgba(255, 255, 255, 0.02)` for table striping.  
  **Fix:** Add a token (e.g. `--color-table-stripe`) in @theme and use it, or use a very low-opacity semantic (e.g. `var(--color-grey-1)` with opacity in a future token).

- **[LOW]** `app/globals.css:381-382` — Hardcoded `padding: 0 2px` and `border-radius: 2px` on footnote ref.  
  **Fix:** Use `var(--spacing-1)` for padding (8px may be too large; if so add a smaller token or keep 2px and document). For radius, use `var(--radius-sm)` (4px) or add `--radius-xs: 2px` if you want consistency.

- **[LOW]** `app/globals.css:389` — Transition uses raw `150ms ease` instead of token.  
  **Fix:** Use `transition: background-color var(--transition-fast);` (--transition-fast is 150ms ease-in-out).

- **[LOW]** `app/globals.css:328` — `line-height: 1.6` is a unitless value; no corresponding token.  
  **Fix:** Optional: add a semantic line-height token for code blocks or leave as-is (unitless is valid).

- **[MEDIUM]** `app/globals.css:261-268` — Duplicate `.scp-content a` and `.scp-content a:hover` blocks; color already forced above with !important.  
  **Fix:** Remove the second block (261-268) or keep only `text-decoration: underline` in a single `.scp-content a` rule to avoid redundancy.

### lib/hooks/use-footnotes.ts

- **[LOW]** `lib/hooks/use-footnotes.ts` — No logger when footnote target is missing (`#footnote-${num}` not found).  
  **Fix:** Import logger and log a warning when `!footnoteEl` in openTooltip (e.g. `logger.warn('Footnote target not found', { num })`).

- **[LOW]** `lib/hooks/use-footnotes.ts:22-24` — Tooltip uses hardcoded `z-index: 1400` and pixel values (TOOLTIP_GAP=8, VIEWPORT_PADDING=16, etc.).  
  **Fix:** Use `var(--z-toast)` for z-index (1400). Consider spacing tokens for gap/padding (e.g. `var(--spacing-1)`, `var(--spacing-2)`) and transition token for 150ms.

- **[LOW]** `lib/hooks/use-footnotes.ts:51` — `strong.style.marginRight = '0.25em'` is hardcoded.  
  **Fix:** Optional: use a small spacing variable if one exists, or leave for readability.

---

## Token audit

All tokens referenced in the reviewed files and their presence in `@theme static`:

| Token | In @theme? |
|-------|------------|
| --color-text-primary | yes |
| --color-accent | yes |
| --color-accent-hover | yes |
| --color-grey-7 | yes |
| --color-grey-8 | yes |
| --color-grey-9 | yes |
| --color-text-secondary | yes |
| --color-red-1 | yes |
| --spacing-1 through --spacing-6 | yes |
| --font-size-base, sm, md, lg, xl, 2xl | yes |
| --font-family-mono | yes |
| --line-height-lg | yes |
| --radius-sm | yes |
| --shadow-elevated | yes |
| --transition-fast | yes (use in footnote ref transition) |
| --color-table-stripe | yes (added in fix) |
| --z-toast | yes (use in tooltip; applied in fix) |

---

## Fixes applied (post-review)

- **globals.css:** Added `--color-table-stripe` in @theme; table striping uses it. Consolidated `.scp-content a` (single block with `text-decoration: underline`). Footnote ref uses `var(--radius-sm)` and `var(--transition-fast)`. Left `padding: 0 2px` with comment (no 2px token).
- **use-footnotes.ts:** Import and use `logger`; log warning when footnote target not found. Tooltip uses `var(--z-toast)` and `var(--transition-fast)`.

---

## Summary

- **Files reviewed:** 3 (globals.css .scp-content section, use-footnotes.ts, scp-reader.tsx).
- **Critical issues:** 0.
- **High issues:** 0.
- **Medium issues:** 2 (hardcoded rgba in table striping; redundant .scp-content a rules).
- **Low issues:** 5 (hardcoded 2px/150ms in CSS; hook logging/z-index/spacing; optional tokenization in hook).

Recommendation: Address the two MEDIUM items (table stripe token or comment, and de-duplicate .scp-content a). Apply LOW fixes as part of routine token/hook consistency.
