# Discovery: SCP Reader typography & layout audit

**Status:** Discovery complete (no implementation).  
**Purpose:** Audit current reader styles and in-browser behavior before adding or changing CSS.

---

## 1. Files examined

### 1.1 `app/globals.css` — `.scp-content` section

**Complete current rules (every rule):**

```css
/* SCP content area – prose-like typography using design tokens */
.scp-content {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-lg);
}

/* Force all text in SCP content to use our theme colors (override API inline styles) */
.scp-content,
.scp-content * {
  color: var(--color-text-primary) !important;
}

/* Restore link colors */
.scp-content a {
  color: var(--color-accent) !important;
}

.scp-content a:hover {
  color: var(--color-accent-hover) !important;
}

.scp-content p {
  margin-bottom: var(--spacing-2);
}

.scp-content p:last-child {
  margin-bottom: 0;
}

.scp-content h1,
.scp-content h2,
.scp-content h3,
.scp-content h4,
.scp-content h5,
.scp-content h6 {
  color: var(--color-text-primary);
  font-weight: 700;
  margin-top: var(--spacing-4);
  margin-bottom: var(--spacing-2);
}

.scp-content h1 { font-size: var(--font-size-2xl); }
.scp-content h2 { font-size: var(--font-size-xl); }
.scp-content h3 { font-size: var(--font-size-lg); }

.scp-content a {
  color: var(--color-accent);
  text-decoration: underline;
}

.scp-content a:hover {
  color: var(--color-accent-hover);
}

.scp-content ul,
.scp-content ol {
  margin: var(--spacing-2) 0;
  padding-left: var(--spacing-4);
}

.scp-content li {
  margin-bottom: var(--spacing-1);
}

.scp-content blockquote {
  border-left: 4px solid var(--color-grey-7);
  padding-left: var(--spacing-3);
  margin: var(--spacing-3) 0;
  color: var(--color-text-secondary);
}

.scp-content code {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  background-color: var(--color-grey-8);
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
}
```

**Design tokens used:**  
`--color-text-primary`, `--color-text-secondary`, `--color-accent`, `--color-accent-hover`, `--color-grey-7`, `--color-grey-8`, `--font-size-base`, `--font-size-sm`, `--font-size-lg`, `--font-size-xl`, `--font-size-2xl`, `--font-family-mono`, `--line-height-lg`, `--spacing-1` through `--spacing-4`, `--radius-sm`.

**Gaps in this block:**  
- **h4, h5, h6:** Only weight and margin; no `font-size` (inherit base, so same size as body).  
- **table, thead, tbody, tr, th, td:** No rules.  
- **pre:** No rules (only `code` is styled).  
- **img:** No rules.  
- **hr:** No rules.  
- **sup, sub:** No rules (footnotes/superscripts).  
- **div, span:** No rules (generic wrappers; may carry API `class`/`style`).

---

### 1.2 `app/scp/[id]/scp-reader.tsx` — How content is rendered

- **Wrapper:** `<Main>` → header (breadcrumb, prev/next, title, rating, actions) → content area.
- **Content area:**  
  `marginTop: var(--spacing-4)` → `<Container size="lg">` → loading / no-content / error **or**:
  - `<Card padding="lg">`  
    - `<div className="scp-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.raw_content) }} />`
- **Typography components used on the reader page (outside `.scp-content`):**  
  `Heading` (level 1 for title), `Text` (secondary, sm for rating), `Mono` (sm for SCP id).  
  The article body is **raw HTML** from the API; no React typography components inside `.scp-content`.
- **Global layout classes:** `.reader-header-row` (flex, stacks on mobile) is in `globals.css`; no other reader-specific layout classes in this file.

---

### 1.3 `app/scp/[id]/page.tsx` — Layout wrapping the reader

- No extra layout wrapper. Page component only:  
  `<>` → `<ScpReader scp={...} userId={...} prev={...} next={...} />`.  
- `ScpReader` provides `<Main>`, header, and `<Container size="lg">`; root layout provides nav/skip link.

---

### 1.4 `components/ui/` — Typography on reader

- **Used on reader:** `Heading`, `Mono`, `Text` (in header only).  
- **Not used for body:** Article content is sanitized HTML in `.scp-content`; styling is entirely from `globals.css` and any inline `style`/`class` left by the API (sanitizer allows `class`, `id`, `style`).

---

## 2. Content container width

- **Reader content:** `<Container size="lg">` → `max-width: var(--container-lg)` = **1024px** (from `globals.css`).  
- **Assessment:** 1024px is reasonable for long-form; 65–75ch equivalent depends on font; no explicit `max-width` in ch for optimal line length. Consider adding a prose max-width (e.g. 65ch) inside the card if desired.

---

## 3. Allowed HTML and unstyled elements

**Source:** `lib/utils/sanitize.ts` — DOMPurify with:

- **Tags:** `p`, `br`, `strong`, `em`, `u`, `s`, `h1`–`h6`, `blockquote`, `ul`, `ol`, `li`, `a`, `img`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `div`, `span`, `code`, `pre`, `hr`, `sup`, `sub`.  
- **Attributes:** `href`, `src`, `alt`, `title`, `class`, `id`, `style`.

**Elements that have NO `.scp-content` styling:**

| Element   | Risk / note |
|----------|--------------|
| `table`, `thead`, `tbody`, `tr`, `th`, `td` | Default browser table styling; no borders, cell padding, or overflow control; wide tables can break layout on small screens. |
| `pre`    | No font, background, padding, or overflow; code blocks may be hard to read or overflow. |
| `img`    | No max-width, border-radius, or overflow; large images can overflow. |
| `hr`     | Default browser style only. |
| `sup`, `sub` | Footnote/superscript; size and position not tuned. |
| `h4`, `h5`, `h6` | Only weight and margin; same font-size as body. |
| `div`, `span` | Often used with API `class`/`style`; no base styling. |

**Recurring patterns to address:**

- **Tables:** SCP experiment logs, vending logs, test logs (e.g. 914, 261, 093) — need borders, cell padding, and overflow (e.g. horizontal scroll or responsive treatment).  
- **Code / logs:** `pre` and `code` blocks — `code` is styled; `pre` is not; `pre > code` may need combined styling.  
- **Long narratives / structure:** Multi-part articles (e.g. 1730, 5000, 6000) — heading hierarchy (h4–h6) and section spacing matter.  
- **Inline styles:** API can send `style`; the global `color: !important` overrides text color, but other properties (width, margin, etc.) can still affect layout.

---

## 4. Per-page audit (browser check)

Pages were loaded at `http://localhost:3000/scp/<id>`. Summary:

| Page       | Category            | Loads? | Typography issues | Tables | Blockquotes | Lists | Links | Images | Layout/overflow | Readability (1–5) |
|-----------|---------------------|--------|--------------------|--------|-------------|-------|-------|--------|-------------------|-------------------|
| **SCP-173**  | Short & simple      | ✓      | Minimal; short body | N/A  | Possible    | Possible | Styled | N/A  | OK               | 5                 |
| **SCP-999**  | Short & simple      | ✓      | Same as above       | N/A  | Possible    | Possible | Styled | N/A  | OK               | 5                 |
| **SCP-914**  | Tables / logs      | ✓      | Headings OK         | **No borders/padding; default only** | Yes | Yes | Styled | N/A  | Wide tables risk overflow | 3                 |
| **SCP-261**  | Tables / logs      | ✓      | Same                | **Same as 914**       | Yes | Yes | Styled | N/A  | Same risk         | 3                 |
| **SCP-1730** | Long-form          | ✓      | h4–h6 same size as body; long text | If present, unstyled | Yes | Yes | Styled | Possible | Long scroll       | 3–4               |
| **SCP-5000** | Long-form          | ✓      | Same                | If present, unstyled | Yes | Yes | Styled | Possible | Same              | 3–4               |
| **SCP-7910** | Mixed / complex    | ✓      | Depends on structure | If present, unstyled | Yes | Yes | Styled | Possible | Needs visual check | TBD               |
| **SCP-3008** | Mixed / logs       | ✓      | Same                | If present, unstyled | Yes | Yes | Styled | Possible | Same              | 3–4               |
| **SCP-2316** | Repeated patterns  | ✓      | Same                | If present, unstyled | Yes | Yes | Styled | Possible | Same              | 3–4               |
| **SCP-093**  | Multiple test logs | ✓      | Same                | **Heavy table use**  | Yes | Yes | Styled | Possible | Table overflow risk | 3                 |
| **SCP-001**  | Hub / special      | ✓      | Often link lists/special layout | Varies | Yes | Yes | Styled | Possible | Depends on variant | 3–4               |
| **SCP-4999** | Minimal / atmospheric | ✓   | Short; spacing OK   | N/A  | Possible    | Possible | Styled | N/A  | OK               | 5                 |
| **SCP-6000** | Long / complex     | ✓      | h4–h6, long structure | If present, unstyled | Yes | Yes | Styled | Possible | Long scroll       | 3–4               |

**Load/content:** All listed pages loaded content successfully (no error state observed). If a specific SCP has no `content_file` in the DB, the UI shows “Content is not available for this entry.”

**Typography:**  
- Paragraph spacing and line-height are consistent.  
- **h4, h5, h6** are not visually distinct from body (same font-size).  
- **Blockquotes** have left border and padding; readable.  
- **Links** are accent, underline, hover; distinguishable.

**Tables:**  
- No `.scp-content` rules for `table`, `th`, `td`.  
- Tables rely on browser defaults: no guaranteed borders, cell padding, or horizontal scroll; on mobile, wide tables can overflow the container.

**Lists:**  
- `ul`/`ol` and `li` have margin/padding; bullets/numbers and indentation present.

**Images:**  
- No `img` rules; sizing and responsiveness depend on API/browser; risk of overflow for large images.

**Layout/overflow:**  
- No `overflow-x: auto` on `.scp-content` or a table wrapper; wide content can break layout.

---

## 5. Summary and recommendations (discovery only)

**Complete current `.scp-content` rules:**  
See section 1.1 (all rules listed).

**Elements with NO styling:**  
`table`, `thead`, `tbody`, `tr`, `th`, `td`, `pre`, `img`, `hr`, `sup`, `sub`; `h4`, `h5`, `h6` (no font-size).

**Recurring patterns:**  
- Tables in experiment/vending/test logs need explicit table styling and overflow handling.  
- `pre` (and optionally `pre code`) need font, background, padding, overflow.  
- Heading hierarchy: define font-size (and optionally margin) for h4–h6.  
- Images: consider `max-width: 100%`, `height: auto`, and overflow containment.

**Max-width:**  
Content is inside `Container size="lg"` (1024px). No ch-based line-length cap; optional improvement is a prose max-width inside the card.

**Suggested next steps (for implementation phase):**  
1. Add `.scp-content` rules for **table** (and thead/tbody/tr/th/td): borders, cell padding, and a wrapper with `overflow-x: auto` for small viewports.  
2. Add **pre** (and optionally `.scp-content pre code`) styling consistent with `code`.  
3. Set **h4, h5, h6** font-sizes (and optionally margins).  
4. Add **img** rules: max-width, height auto, overflow.  
5. Optionally style **hr** and **sup/sub**.  
6. Consider a prose max-width (e.g. 65ch) for the main text column and ensure one scrollable container for wide content (tables/code).

---

*End of discovery audit.*
