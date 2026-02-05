# Discovery: SCP footnote markup patterns

We need to understand exactly what footnote HTML looks like **after sanitization** so we can design an interactive tooltip/modal system. This document reports on the sanitizer config, raw markup from the SCP data API, and what survives DOMPurify.

---

## Step 1: Sanitizer configuration

**File:** `lib/utils/sanitize.ts`

### DOMPurify config

| Setting | Value |
|--------|--------|
| **ALLOWED_TAGS** | `p`, `br`, `strong`, `em`, `u`, `s`, `h1`–`h6`, `blockquote`, `ul`, `ol`, `li`, `a`, `img`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `div`, `span`, `code`, `pre`, `hr`, `sup`, `sub` |
| **ALLOWED_ATTR** | `href`, `src`, `alt`, `title`, `class`, `id`, `style` |
| **ALLOW_DATA_ATTR** | `false` |

### Implications for footnotes

- **`id` and `href`** are in `ALLOWED_ATTR`, so they are **preserved** on `<a>` and other elements — unless the **value** is unsafe.
- **`onclick`** and other event handlers are **not** in `ALLOWED_ATTR`, so they are **stripped**.
- **`data-*`** attributes are **stripped** (`ALLOW_DATA_ATTR: false`). We cannot rely on `data-footnote` or similar.
- DOMPurify’s default URI handling **blocks `javascript:`** (and `data:`, `vbscript:`) in `href`. So `href="javascript:;"` is removed or sanitized (e.g. to `#` or empty). We **cannot** rely on `href` for in-page navigation after sanitization; we must use our own JS (e.g. scroll or tooltip) keyed by **`id`**.

**Hooks that survive:** `id`, `class`, `style`. No `onclick`, no `data-*`, no `javascript:` href.

---

## Step 2: Rendered footnote HTML (raw, then post‑sanitization)

Content comes from `https://scp-data.tedivm.com/data/scp/items/{content_file}`. The following SCPs were checked: SCP-173, SCP-914, SCP-999, SCP-3008, SCP-5000, SCP-7910.

---

### SCP-173

- **Has footnotes:** No.  
- Raw content has no `footnote`, `footnoteref`, or `<sup>` with `id`/link.  
- **Inline ref HTML:** N/A  
- **Footnote container HTML:** N/A  
- **Mapping pattern:** N/A  

---

### SCP-914

- **Has footnotes:** No.  
- Raw content uses `<sup>-75</sup>` for **scientific notation** (e.g. “10<sup>-75</sup> ρ”), not a footnote reference.  
- **Inline ref HTML:** N/A (only plain `<sup>` for numbers).  
- **Footnote container HTML:** N/A  
- **Mapping pattern:** N/A  

---

### SCP-999

- **Has footnotes:** No.  
- No footnote or footnoteref markup in raw content.  
- **Inline ref HTML:** N/A  
- **Footnote container HTML:** N/A  
- **Mapping pattern:** N/A  

---

### SCP-3008

- **Has footnotes:** No.  
- One plain `<sup>2</sup>` in the body (likely an ordinal or reference number), not a Wikidot footnote.  
- **Inline ref HTML:** N/A  
- **Footnote container HTML:** N/A  
- **Mapping pattern:** N/A  

---

### SCP-5000

- **Has footnotes:** Yes.

**Inline reference (raw, example 1 and 2):**

```html
<sup class="footnoteref"><a class="footnoteref" href="javascript:;" id="footnoteref-1" onclick="WIKIDOT.page.utils.scrollToReference('footnote-1')">1</a></sup>
<sup class="footnoteref"><a class="footnoteref" href="javascript:;" id="footnoteref-2" onclick="WIKIDOT.page.utils.scrollToReference('footnote-2')">2</a></sup>
```

- Element: `<sup>` wrapping an `<a>`.  
- `href`: `javascript:;` (will be stripped or sanitized by DOMPurify).  
- `id`: `footnoteref-1`, `footnoteref-2`, … (survives).  
- `class`: `footnoteref` (survives).  
- `onclick`: stripped (not in `ALLOWED_ATTR`).

**Footnote text at bottom (raw, container + first two entries):**

```html
<div class="footnote-footer" id="footnote-1"><a href="javascript:;" onclick="WIKIDOT.page.utils.scrollToReference('footnoteref-1')">1</a>. Cause of death determined to be blunt force trauma, believed to be inflicted by impact with the ground following a long fall.</div>
<div class="footnote-footer" id="footnote-2"><a href="javascript:;" onclick="WIKIDOT.page.utils.scrollToReference('footnoteref-2')">2</a>. One of a series of installations designed to retain information following reality shifts or other temporal restructuring events.</div>
```

- Container: **sibling `<div>`s**, each with `class="footnote-footer"` and `id="footnote-N"`.  
- No wrapper `<ol>` or single parent with a dedicated “footnotes” id; just a sequence of `div.footnote-footer#footnote-N`.  
- Each footnote is identified by **`id="footnote-N"`**.  
- Number in text is inside an `<a>` (same `javascript:`/`onclick`; after sanitization the link is inert but the div and id remain).

**Mapping pattern:** Inline `id="footnoteref-N"` corresponds to bottom `id="footnote-N"`. Numeric suffix `N` links reference to definition.

---

### SCP-7910

- **Has footnotes:** Yes.

**Inline reference (raw, example):**

```html
<sup class="footnoteref"><a class="footnoteref" href="javascript:;" id="footnoteref-1" onclick="WIKIDOT.page.utils.scrollToReference('footnote-1')">1</a></sup>
```

Same structure as SCP-5000.

**Footnote container (raw, first two entries):**

```html
<div class="footnote-footer" id="footnote-1"><a href="javascript:;" onclick="WIKIDOT.page.utils.scrollToReference('footnoteref-1')">1</a>. A senior researcher, ranking security officer, or Lead Researcher Yu, depending on severity.</div>
<div class="footnote-footer" id="footnote-2"><a href="javascript:;" onclick="WIKIDOT.page.utils.scrollToReference('footnoteref-2')">2</a>. Standard safety precautions for SCP objects may vary from site to site in detail but never in intent. Speak to an on-site psychologist ...
```

Same pattern as SCP-5000: sibling `div.footnote-footer` with `id="footnote-N"`.

**Mapping pattern:** Same as SCP-5000 — `footnoteref-N` ↔ `footnote-N` by numeric id.

---

## Step 3: What survives DOMPurify (summary)

After sanitization with the current config:

| Item | Survives? | Notes |
|------|-----------|--------|
| `<sup>`, `<a>`, `<div>` | Yes | In `ALLOWED_TAGS`. |
| `id` (e.g. `footnoteref-1`, `footnote-1`) | Yes | In `ALLOWED_ATTR`. |
| `class` (e.g. `footnoteref`, `footnote-footer`) | Yes | In `ALLOWED_ATTR`. |
| `href="javascript:;"` | No | Dangerous scheme removed. |
| `onclick` | No | Not in `ALLOWED_ATTR`. |
| `data-*` | No | `ALLOW_DATA_ATTR: false`. |

So in the DOM we have:

- Inline: `<sup class="footnoteref"><a class="footnoteref" id="footnoteref-N">N</a></sup>` (no working href/onclick).
- Bottom: `<div class="footnote-footer" id="footnote-N"><a>N</a>. Footnote text.</div>`.

The **only reliable hooks** for connecting refs to content are:

- **Inline:** `id="footnoteref-N"` (and optionally `class="footnoteref"`).
- **Footnote body:** `id="footnote-N"` (and optionally `class="footnote-footer"`).

---

## Summary

### How many distinct footnote markup patterns?

- Among the six SCPs checked, **one** footnote pattern appears: the **Wikidot-style** pattern used in SCP-5000 and SCP-7910.
- SCP-173, SCP-914, SCP-999 have no footnotes; SCP-3008 has only a plain `<sup>2</sup>` (not a footnote).

### Is there a dominant pattern we can reliably target?

- **Yes.** Where footnotes exist in the sampled data, they use:
  - Inline: `<sup class="footnoteref"><a ... id="footnoteref-N">N</a></sup>`.
  - Bottom: `<div class="footnote-footer" id="footnote-N">...text...</div>`.
- We can target:
  - Refs: `a[id^="footnoteref-"]` or `.scp-content a.footnoteref` (with id parsing for N).
  - Definitions: `.scp-content div.footnote-footer` or `#footnote-N` by id.

### What attributes survived DOMPurify that we can use as hooks?

- **`id`** — primary hook: `footnoteref-N` (inline) and `footnote-N` (definition). Safe and stable for JS (scroll, focus, or clone-into-tooltip).
- **`class`** — `footnoteref`, `footnote-footer` for selectors and styling.
- **`href`** and **`onclick`** do **not** survive in a usable form; we must implement behavior (e.g. tooltip/modal or scroll) in our own JS using the `id` mapping above.

---

## Recommendation for tooltip/modal design

1. **Query** `.scp-content a[id^="footnoteref-"]` (or equivalent) after content is rendered and sanitized.
2. **Parse** the numeric suffix from each `id` (e.g. `footnoteref-1` → `1`).
3. **Resolve** the footnote body via `document.getElementById('footnote-' + n)` (or `.scp-content #footnote-N`). The footnote text is already in the DOM inside that div.
4. **Implement** interaction (click/focus/keyboard) to show that text in a tooltip or modal; optionally clone or reference the `#footnote-N` content so we don’t rely on `href` or `onclick` from the wiki.

No post-sanitization HTML changes are required for this pattern; the surviving `id`/`class` structure is sufficient.
