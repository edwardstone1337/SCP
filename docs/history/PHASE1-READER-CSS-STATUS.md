# Phase 1: SCP Reader — critical layout & overflow fixes — Status report

**Completed:** CSS added in `app/globals.css`. Verification run against test pages.

---

## 1. Every CSS rule added (selector + summary)

| Selector | Summary |
|----------|---------|
| `.scp-content table` | Full width, border-collapse, margin, smaller font; `display: block` + `overflow-x: auto` + `-webkit-overflow-scrolling: touch` for horizontal scroll on narrow viewports. |
| `.scp-content th, .scp-content td` | 1px border grey-7, padding (spacing-2 vertical, spacing-3 horizontal), left-align, top vertical-align. |
| `.scp-content th` | Background grey-9, font-weight 700. |
| `.scp-content tr:nth-child(even)` | Alternating row background `rgba(255,255,255,0.02)`. |
| `.scp-content img` | max-width 100%, height auto, border-radius radius-sm, margin spacing-4 vertical. |
| `.scp-content pre` | Background grey-9, 1px border grey-7, radius-sm, padding spacing-4, overflow-x auto, touch scroll, mono font, font-size sm, line-height 1.6, margin spacing-4 vertical. |
| `.scp-content pre code` | Reset: no background, no padding, no border, font-size inherit (from pre). |
| `.scp-content hr` | No border; top border 1px solid grey-7; margin spacing-6 vertical. |

**Total:** 8 rule blocks (4 for tables, 1 images, 2 pre/code, 1 hr). All appended after existing `.scp-content` styles; no existing rules modified.

---

## 2. Per test page — what changed visually, any issues

| Page | What changed | Issues |
|------|----------------|--------|
| **SCP-914** | Tables now have visible borders, cell padding, header background, and alternating row shading. On 375px viewport the table scrolls horizontally instead of breaking layout. | None observed. |
| **SCP-173** | No structural change (no tables, pre, or images). Paragraphs, headings, lists, blockquotes unchanged. | None. Simple content looks unchanged. |
| **SCP-7910** | If the article includes tables, pre, images, or hr, they now use the new styles. General prose unchanged. | None observed; mixed content did not break. |
| **SCP-3008** | Long exploration logs: any tables/pre/hr/img in content use the new rules. Text and layout remain consistent. | None observed. |

**Mobile (375px) on SCP-914:** Table is scrollable horizontally; borders and padding remain; no overflow breaking the container.

**Images:** No SCP with images was explicitly opened during this run. The new `img` rules apply site-wide to `.scp-content` and will apply whenever an article includes images.

---

## 3. Confirmation: no existing rules modified

- All new rules were **appended** after `.scp-content code { ... }` and before `/* Loading spinner keyframes */`.
- No selectors or properties in the existing `.scp-content` block (base, `*`, `a`, `p`, `h1–h6`, `ul`/`ol`/`li`, `blockquote`, `code`) were changed.
- Only additions; no deletions or edits to prior rules.

---

## 4. Elements that still look unstyled or broken

- **h4, h5, h6:** Still no font-size (same as body). Deferred to Phase 2 (typography refinement).
- **sup / sub:** No styling. Deferred to Phase 2.
- **Content width:** No ch-based max-width for prose. Deferred to Phase 2.
- **Collapsibles / custom divs:** If the API sends collapsible markup or custom classes, they are not styled by these rules; only generic `table`, `img`, `pre`, `pre code`, and `hr` were added. Any remaining unstyled or broken elements would be from content that uses other tags or heavy inline styles.

---

## 5. File changed

- **`app/globals.css`** — Added Phase 1 block (tables, images, pre/pre code, hr) immediately after the existing `.scp-content code` rule.
