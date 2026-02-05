# Phase 2: Footnote styling — status report

## CSS rules added

All rules were added in `app/globals.css` inside the `.scp-content` section, after existing rules (after "Phase 2: Content max-width for readability"), before "Loading spinner keyframes".

### Inline footnote references

| Selector | Properties |
|----------|------------|
| `.scp-content sup.footnoteref a.footnoteref` | `color: var(--color-accent);` `text-decoration: none;` `font-weight: 700;` `font-size: 0.75em;` `padding: 0 2px;` `border-radius: 2px;` `transition: background-color 150ms ease;` |
| `.scp-content sup.footnoteref a.footnoteref:hover` | `background-color: var(--color-red-1);` `outline: none;` |
| `.scp-content sup.footnoteref a.footnoteref:focus-visible` | `background-color: var(--color-red-1);` `outline: none;` |

### Bottom footnote section

| Selector | Properties |
|----------|------------|
| `.scp-content div.footnote-footer` | `font-size: var(--font-size-sm);` `color: var(--color-text-secondary);` `padding: var(--spacing-2) 0;` `border-top: 1px solid var(--color-grey-8);` `line-height: 1.5;` |
| `.scp-content div.footnote-footer:first-of-type` | `margin-top: var(--spacing-6);` `padding-top: var(--spacing-4);` `border-top: 1px solid var(--color-grey-7);` |
| `.scp-content div.footnote-footer a` | `color: var(--color-accent);` `font-weight: 700;` `text-decoration: none;` `margin-right: var(--spacing-1);` |

**Total:** 6 rule blocks (3 for inline refs, 3 for bottom section). No existing rules were modified.

---

## No existing rules modified

- No edits were made to any pre-existing selectors or declarations in `app/globals.css`.
- New rules are appended after the last `.scp-content` block; no merges or overwrites.

---

## Per-page visual results

| Page | Expected | Result |
|------|----------|--------|
| **SCP-5000** | Inline refs: accent/red, bold, hover highlight. Bottom footnotes: section break (stronger border on first), smaller/secondary text. | Inline refs match (`.footnoteref` only); bottom `div.footnote-footer` gets border-top, spacing, secondary color; first gets extra margin-top, padding-top, and stronger border. |
| **SCP-7910** | Same as SCP-5000. | Same styling applied. |
| **SCP-173** | No footnotes; no visual change. | No `sup.footnoteref` or `div.footnote-footer`; no change. |
| **SCP-914** | Plain `<sup>` (e.g. scientific notation) unchanged — no `.footnoteref` class. | Selectors target `sup.footnoteref a.footnoteref` only; plain `<sup>-75</sup>` has no `.footnoteref`, so not affected. |

---

## Tooltip still works

- Tooltip behavior is implemented in `useFootnotes` (click/keyboard, positioning, dismiss). No changes were made to the hook or `scp-reader.tsx`.
- New CSS only styles appearance of the same elements (inline links and footer divs). It does not change structure, `id`/`class`, or pointer events.
- **No interference:** No `pointer-events`, `visibility`, or `display` rules were added that would block clicks. Hover/focus styles (background, outline) do not affect the tooltip open/dismiss logic.

---

## Specificity and conflicts

- **Specificity:** Inline ref rules use `.scp-content sup.footnoteref a.footnoteref` (three classes + element types). This overrides the generic `.scp-content a` and `.scp-content a:hover` for footnote links only; plain links in body stay unchanged. Footer rules use `.scp-content div.footnote-footer` (and `:first-of-type` / `a`) and do not clash with other `.scp-content` rules.
- **Conflicts:** None observed. Existing `.scp-content sup` (font-size, position) still applies to all `sup`; the new rules add styles only for `sup.footnoteref a.footnoteref`, so footnote refs get both the base sup styling and the accent/hover styles.
- **Bottom footnotes:** Not hidden; they remain visible as a fallback and for readers who prefer reading footnotes in sequence.
