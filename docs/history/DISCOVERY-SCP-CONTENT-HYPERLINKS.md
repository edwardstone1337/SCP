# Discovery: Hyperlinks within SCP article content

We need to understand what types of links appear in SCP content after sanitization, where they point, and how they currently behave. This document reports on link handling in code, link types in the API `raw_content`, and implications for rewriting and behavior.

---

## Step 1: Current link handling

### 1.1 `lib/utils/sanitize.ts`

- **`<a>` tags and `href`:** Preserved. DOMPurify config uses `ALLOWED_TAGS: [..., 'a', ...]` and `ALLOWED_ATTR: ['href', ...]`.
- **URL filtering:** No custom hook. DOMPurify’s default behavior applies:
  - **`javascript:`** (and `data:`, `vbscript:`) in `href` is **stripped** (href removed or sanitized). So `href="javascript:;"` in API content will not appear in the DOM after sanitization (link may render as plain text or with empty href).
  - `http:`, `https:`, relative URLs, and `#fragment` are allowed.
- **Conclusion:** Only dangerous protocols are removed. All wiki/internal/external HTTP(S) and relative links survive.

### 1.2 `app/globals.css` — `.scp-content` link styles

| Selector | Styles |
|----------|--------|
| `.scp-content a` | `color: var(--color-accent) !important; text-decoration: underline;` |
| `.scp-content a:hover` | `color: var(--color-accent-hover) !important;` |
| `.scp-content div.footnote-footer a` | `color: var(--color-accent); font-weight: 700; text-decoration: none; margin-right: var(--spacing-1);` |

Comment in CSS: “Restore link colors (override API inline styles)”. So content links are explicitly styled; no `target`, `rel`, or pointer logic in CSS.

### 1.3 JS/React click interception

- **`app/scp/[id]/scp-reader.tsx`:** No click handler on `.scp-content`. Content is rendered via `dangerouslySetInnerHTML`; links use default browser behavior (navigate to `href`).
- **`lib/hooks/use-footnotes.ts`:** Only anchors with `id^="footnoteref-"` get `preventDefault` and open the tooltip. All other `<a>` in `.scp-content` are **not** intercepted and behave as normal links.

**Conclusion:** Aside from footnote refs, every content link triggers a full navigation to its `href` (same tab, no in-app routing).

---

## Step 2: Per-page link inventory (from API `raw_content`)

Links were extracted from the SCP-Data API `raw_content` (HTML) for each sample page. **After sanitization:** `javascript:` hrefs are stripped by DOMPurify; all other hrefs below are preserved as-is unless noted.

### SCP-173

**Total links in raw_content:** 8 (excluding footnotes; this page has no footnotes).

| # | href | Category | Click behavior (current) |
|---|------|----------|---------------------------|
| 1 | `javascript:;` | Broken/empty (stripped by DOMPurify) | No navigation; may render as text |
| 2 | `javascript:;` | Broken/empty (stripped) | Same |
| 3 | `/scp-173` | Internal wiki (same SCP, relative) | Navigates to `/scp-173` on current origin → **404** (app has `/scp/SCP-173`) |
| 4 | `https://scpwiki.com` | External (SCP wiki) | Leaves app → scpwiki.com |
| 5 | `https://scpwiki.com/scp-173` | Internal SCP link (external domain) | Leaves app → wiki |
| 6 | `https://creativecommons.org/licenses/by-sa/3.0/` | External | Leaves app |
| 7 | `/component:license-box` | Internal wiki (non-SCP) | Navigates to same-origin `/component:license-box` → **404** |
| 8 | `/licensing-guide` | Internal wiki (non-SCP) | Same-origin → **404** |

### SCP-682

**Total links:** 23.

| Sample href | Category | Click behavior (current) |
|-------------|----------|---------------------------|
| `javascript:;` (×2) | Broken (stripped) | — |
| `/scp-079`, `/scp-409`, `/scp-689`, `/scp-182` | Internal SCP (relative) | Same-origin `/scp-XXX` → **404** (app uses `/scp/SCP-XXX`) |
| `/experiment-log-t-98816-oc108-682` | Internal wiki (tale) | Same-origin → **404** |
| `/scp-682`, scpwiki.com, CC, component, licensing | Same pattern as SCP-173 | Same / leave app |
| `http://scp-wiki.wikidot.com/...`, `http://www.wikidot.com/user:info/...` | External (wiki / user pages) | Leaves app |
| `https://web.archive.org/...` | External | Leaves app |
| `http://scp-wiki.wikidot.com/local--files/.../682.mp3` | External (wiki file) | Leaves app |

### SCP-999

**Total links:** 9.

| Sample href | Category | Click behavior (current) |
|-------------|----------|---------------------------|
| `javascript:;` (×2) | Broken (stripped) | — |
| `/scp-682` | Internal SCP (relative) | Same-origin → **404** |
| `/scp-999`, scpwiki, CC, component, licensing | Same as SCP-173 | Same / leave app |

### SCP-3008

**Total links:** 20.

| Sample href | Category | Click behavior (current) |
|-------------|----------|---------------------------|
| `javascript:;` (×6) | Broken (stripped) | — |
| `/scp-3088`, `/scp-3688`, `/scp-4144`, `/scp-4533` | Internal SCP (relative) | Same-origin → **404** |
| `http://www.wikidot.com/user:info/...`, `http://www.scp-wiki.net/...` | Internal wiki / external | Leaves app |
| `/scp-3008`, scpwiki, CC, component, licensing | Same pattern | Same / leave app |

### SCP-5000

**Total links:** 50.

| Sample href | Category | Click behavior (current) |
|-------------|----------|---------------------------|
| `javascript:;` (×6) | Broken (stripped) | — |
| `/scp-579`, `/scp-096`, `/scp-169`, `/scp-682`, `/scp-610`, `/scp-055`, `/scp-2000`, etc. | Internal SCP (relative) | Same-origin → **404** |
| `/disgusting`, `/last-of-the-hand` | Internal wiki (tales/hubs) | Same-origin → **404** |
| scpwiki, CC, component, licensing, wikidot user, web.archive | External / wiki | Leaves app |

### SCP-7910

**Total links:** 35.

| Sample href | Category | Click behavior (current) |
|-------------|----------|---------------------------|
| `javascript:;` (×28) | Broken (stripped) | — |
| `/classification-committee-memo` | Internal wiki | Same-origin → **404** |
| `/scp-7910`, scpwiki, CC, component, licensing | Same pattern | Same / leave app |

### SCP-2316

**Total links:** 42.

| Sample href | Category | Click behavior (current) |
|-------------|----------|---------------------------|
| `javascript:;` (×22) | Broken (stripped) | — |
| `https://scp-wiki.wikidot.com/djkaktus`, `component:info-ayers` | Internal wiki / author | Leaves app / 404 |
| `/classification-committee-memo`, `/days-gone-by`, `/not-fade-away` | Internal wiki (tales) | Same-origin → **404** |
| `/scp-1833` | Internal SCP (relative) | Same-origin → **404** |
| `/scp-2316`, scpwiki, CC, component, licensing, commons.wikimedia | Same / external | Same / leave app |

### SCP-001

**Total links:** 27.

| Sample href | Category | Click behavior (current) |
|-------------|----------|---------------------------|
| `javascript:;` (×3) | Broken (stripped) | — |
| `http://www.wikidot.com/user:info/...` | External (wiki user) | Leaves app |
| `https://www.youtube.com/...`, `https://youtu.be/...` | External | Leaves app |
| `https://scp-wiki.wikidot.com/anorrack-s-author-page` | Internal wiki (author) | Leaves app |
| `/lord-stonefish`, `/the-communitys-proposal` | Internal wiki (slug) | Same-origin → **404** |
| `https://commons.wikimedia.org/...` (multiple) | External | Leaves app |
| scpwiki, CC, component, licensing | Same pattern | Same / leave app |

---

## Step 3: Quantify the patterns

### Category counts (across sampled pages, from raw_content before sanitization)

| Category | Approx. count (all 8 pages) | Notes |
|----------|----------------------------|--------|
| **Internal SCP link** (points to another SCP) | ~60+ | `/scp-XXX` or `https://scp-wiki.wikidot.com/scp-XXX` or `https://scpwiki.com/scp-XXX` |
| **Internal wiki link** (tales, hubs, author, component) | ~25+ | `/tale-slug`, `/component:...`, `scp-wiki.wikidot.com/...`, wikidot user |
| **Footnote link** | 0 in this sample | footnoteref/footnote-N handled by useFootnotes (tooltip) |
| **External link** | ~25+ | scpwiki.com, creativecommons.org, youtube, commons.wikimedia, web.archive, etc. |
| **Broken/empty** (`javascript:;`) | ~70+ | Stripped by DOMPurify; no navigation |
| **Anchor/fragment** | 0 observed | — |

### Common href patterns

| Pattern | Example | After sanitization |
|---------|---------|--------------------|
| Relative SCP | `/scp-173`, `/scp-682` | Kept; navigates to same origin → **404** in app |
| Full wiki SCP | `https://scp-wiki.wikidot.com/scp-682`, `https://scpwiki.com/scp-682` | Kept; navigates away to wiki |
| Relative wiki page | `/component:license-box`, `/licensing-guide`, `/experiment-log-...` | Kept; same-origin → **404** |
| Wikidot user | `http://www.wikidot.com/user:info/username` | Kept; leaves app |
| `javascript:;` | Various (collapsible, etc.) | **Stripped** by DOMPurify |

### What works today

- **External links** (scpwiki.com, CC, YouTube, Wikimedia, etc.): Work; user leaves the app.
- **Footnote refs** (where present): Work in-app via tooltip (useFootnotes).

### What navigates away

- Any `https://` to scp-wiki, scpwiki.com, wikidot, youtube, commons, archive.org, etc.: full navigation away from the app.

### What is broken or does nothing

- **Same-origin relative SCP links** (`/scp-173`, `/scp-682`, …): Browser goes to `https://our-app.com/scp-173` → **404** (app route is `/scp/SCP-173`).
- **Same-origin wiki slugs** (`/component:license-box`, `/licensing-guide`, tales, hubs): **404** (app has no such routes).
- **`javascript:;`**: Removed by DOMPurify; no effect or inert link.

---

## Step 4: SCP-to-SCP links specifically

### href format

- **Relative:** `/scp-682`, `/scp-999` (lowercase, hyphen).
- **Absolute wiki:** `https://scp-wiki.wikidot.com/scp-682`, `https://scpwiki.com/scp-682` (path lowercase `scp-NNN`).

So SCP links in content use **lowercase** `scp-NNN` in the path; app routes use **mixed case** `SCP-NNN` in the segment (`/scp/SCP-682`).

### Reliable detection

- **Regex (path or href):**  
  - Relative: `^/scp-\d+$`  
  - Wiki: `(?:scp-wiki\.wikidot\.com|scpwiki\.com)/scp-(\d+)` or similar.  
- **Normalize to SCP ID:** Extract number, then format as `SCP-{N}` for app route.

### Rewriting to app routes

- For **relative** `/scp-NNN`: replace with `/scp/SCP-NNN` (or resolve via router) so the link stays in-app.
- For **absolute** `https://scp-wiki.wikidot.com/scp-NNN` or `https://scpwiki.com/scp-NNN`: same logic; replace with `/scp/SCP-NNN` (or full origin + path) to keep user in app.
- **Target existence:** App uses `scps` table keyed by `scp_id` (e.g. `SCP-682`). If the seed/API has the SCP, it will be in the DB. Links to SCPs not in the DB would still hit `/scp/SCP-XXXX` and can show the existing “not found” or “content not available” behavior.

### Recommendation for SCP-to-SCP

- **Detect:** Match `href` (relative `/scp-\d+` or wiki host + path `scp-\d+`).
- **Rewrite:** Set `href` to `/scp/SCP-{N}` (same origin) so in-app navigation works.
- **Where:** Either (1) in a **sanitize step** (e.g. transform hrefs in HTML string before or after DOMPurify), or (2) **client-side** in a container of `.scp-content`: delegate click on `<a>` and, if href matches SCP pattern, `preventDefault` and `router.push('/scp/SCP-{N}')`. Option (2) avoids re-sanitizing and keeps one source of truth for sanitized HTML.

---

## Summary

### Category counts (approximate, all 8 pages)

- Internal SCP (rewritable): **~60+**
- Internal wiki (tales, hubs, author, component): **~25+**
- External: **~25+**
- Broken/empty (`javascript:;`): **~70+** (stripped by DOMPurify)

### Common href patterns

- Relative: `/scp-NNN`, `/some-wiki-slug`, `/component:...`.
- Absolute: `https://scp-wiki.wikidot.com/...`, `https://scpwiki.com/...`, `https://creativecommons.org/...`, YouTube, Wikimedia, etc.

### Recommendations

1. **SCP-to-SCP:** Rewrite or handle `/scp-NNN` and wiki `scp-NNN` links to `/scp/SCP-NNN` so they stay in-app (either href rewrite in HTML or click delegation + `router.push`).
2. **Internal wiki (tales, hubs, component):** Either leave as-is (404 or external) or map known slugs to wiki URLs and open in new tab (e.g. `https://scp-wiki.wikidot.com/...`) so users don’t hit app 404s.
3. **External (scpwiki, CC, YouTube, etc.):** Consider `target="_blank"` and `rel="noopener noreferrer"` for non-SCP external links so the app stays open in the original tab.
4. **DOMPurify:** Keep default; no need to allow `javascript:`.

---

## Verification note

Per-page link inventory above is taken from the **API `raw_content`** (pre–client sanitization). To confirm **exact** post-sanitization DOM and click behavior (including any middleware or base URL effects), run the app, open each of the eight SCP pages, and in DevTools inspect `.scp-content` and each `<a>`’s `href` and behavior.
