# Phase 2: SCP Reader — typography refinement — Status report

**Completed:** CSS and one theme token added. Verification run against test pages.

---

## 1. Every CSS rule added

| Selector | Summary |
|----------|---------|
| `.scp-content h4` | font-size md, font-weight 700, margin spacing-5 top/bottom spacing-2 bottom. |
| `.scp-content h5` | font-size sm, font-weight 700, uppercase, letter-spacing 0.05em, margin spacing-4 top spacing-2 bottom. |
| `.scp-content h6` | font-size sm, font-weight 600, color text-secondary, margin spacing-4 top spacing-2 bottom. |
| `.scp-content sup, .scp-content sub` | font-size 0.75em, line-height 0, position relative, vertical-align baseline. |
| `.scp-content sup` | top -0.5em. |
| `.scp-content sub` | bottom -0.25em. |
| `.scp-content` (second block) | max-width 72ch, margin-left auto, margin-right auto. |

**Theme token added (required for h4):** `--font-size-md: 1.125rem; /* 18px */` in `@theme static` — the design system had no `--font-size-md`; it was added between `--font-size-base` and `--font-size-lg` so the Phase 2 h4 rule could use it as specified.

---

## 2. How max-width was applied

- **Finding:** The existing `.scp-content` block (lines 326–330) has only `color`, `font-size`, and `line-height`. It has **no margin**.
- **Application:** A **new, separate** `.scp-content { ... }` block was added after the Phase 2 sup/sub rules, containing:
  - `max-width: 72ch;`
  - `margin-left: auto;`
  - `margin-right: auto;`
- **Conflict:** None. The existing block was not modified. The new block only adds these three properties; the cascade merges them with the existing `.scp-content` rules.

---

## 3. Per test page — visual changes and any issues

| Page | What changed / what to check | Issues |
|------|------------------------------|--------|
| **SCP-1730** | Long-form; h4/h5/h6 (where present) now have distinct sizes and margins (h4 md, h5/h6 sm; h5 uppercase). Prose is constrained to 72ch and centered. | None observed. |
| **SCP-5000** | Narrative; line length is capped at 72ch (~65–80 characters per line), content centered. | Line length feels comfortable. |
| **SCP-914** | Tables unchanged: still `display: block` and `overflow-x: auto`. At 375px width, tables scroll horizontally; max-width applies to the text column, not the table’s scroll area. | Tables still scroll properly; no constraint conflict. |
| **SCP-173** | Short content; 72ch cap and centering applied. No h4–h6. | Nothing looks off. |
| **Sup/footnotes** | Any `<sup>`/`<sub>` in sanitized content get 0.75em size, baseline positioning, and sup/sub offsets. SCP wiki footnote markup is often JS/collapsible and does not survive DOMPurify — parked per product decision. | N/A for full footnote UX; inline sup/sub are styled. |

---

## 4. Confirmation: no existing rules modified

- All Phase 2 rules were **appended** after the Phase 1 horizontal rules block and before `/* Loading spinner keyframes */`.
- No existing `.scp-content` selectors or properties were changed. The only addition to the existing `.scp-content` “section” is a second declaration block for the same selector (max-width + margin).
- The only edit outside the Phase 2 block was adding the new **theme** variable `--font-size-md` in the `@theme static` block; no existing theme or `.scp-content` rules were modified.

---

## 5. Files changed

- **`app/globals.css`**
  - In `@theme static`: added `--font-size-md: 1.125rem; /* 18px */`.
  - After Phase 1: added Phase 2 block (h4, h5, h6, sup/sub, and second `.scp-content` block for max-width and margin).
