# Phase 2: Wiki link redirects + broken link cleanup — status report

**Shipped:** Relative wiki links (non-SCP) rewritten to `https://scp-wiki.wikidot.com${href}` and opened in a new tab. Classification order updated. Broken `javascript:` links left as preventDefault-only (no style change).

---

## 1. What changed in the click handler classification order

**File:** `lib/hooks/use-content-links.ts`

Order is now:

1. **Skip if footnoteref** — `anchor.id?.startsWith('footnoteref-')` → return (no preventDefault; useFootnotes handles tooltip).
2. **SCP-to-SCP** (relative or absolute) → `e.preventDefault()`, `router.push(\`/scp/SCP-${num}\`)`.
3. **External** (any `http(s):` that is not an SCP wiki URL) → `e.preventDefault()`, `window.open(href, '_blank', 'noopener,noreferrer')`.
4. **Relative wiki** (path starts with `/` and does not match SCP pattern) → `e.preventDefault()`, rewrite to `https://scp-wiki.wikidot.com${path}`, `window.open(rewrittenUrl, '_blank', 'noopener,noreferrer')`.
5. **Empty/missing href** — already handled at top of handler → `e.preventDefault()`, return.
6. **Everything else** — default behavior (e.g. in-page `#anchor`).

Important: Step 3 (external) runs **before** step 4 (relative wiki). Absolute wiki URLs (e.g. `https://scp-wiki.wikidot.com/some-tale`) are already external and open in a new tab; step 4 only applies to **relative** paths like `/licensing-guide`.

---

## 2. How relative wiki links are detected and rewritten

- **Detection:** `isRelativeWikiLink(href)`:
  - `(href || '').trim().startsWith('/')` **and**
  - `getScpNumber(href) === null` (so `/scp-682` is not treated as wiki; it’s SCP and handled in step 2).
- **Examples:** `/component:license-box`, `/licensing-guide`, `/experiment-log-t-98816-oc108-682`, `/classification-committee-memo`, `/days-gone-by`, `/disgusting`.
- **Rewrite:** `WIKI_BASE = 'https://scp-wiki.wikidot.com'`; rewritten URL = `${WIKI_BASE}${path}` with `path = href.trim()` (ensure single leading `/` if needed).
- **Behavior:** `e.preventDefault()` then `window.open(rewrittenUrl, '_blank', 'noopener,noreferrer')`.

---

## 3. Absolute wiki non-SCP links

Links like `https://scp-wiki.wikidot.com/some-tale`, `http://www.scp-wiki.net/some-page`, `http://www.wikidot.com/user:info/username` are already **external** (they match `http(s):` and do not match the SCP absolute pattern). They are handled in step 3 and open in a new tab. No code change.

---

## 4. Broken `javascript:` links

After DOMPurify strips `javascript:`, anchors may have empty or missing `href`. The existing empty-href branch (step 5) already calls `e.preventDefault()`. **Decision:** no CSS or style change; leave as-is (underlined accent-colored text that does nothing on click). Tooltip like "This feature is not available" can be added later if needed.

---

## 5. Per-page test results (wiki redirects)

| Page    | Link / action | Expected | Result |
|---------|----------------|----------|--------|
| SCP-682 | Click "experiment log" (`/experiment-log-t-98816-oc108-682`) | Opens `https://scp-wiki.wikidot.com/experiment-log-t-98816-oc108-682` in new tab | Manual: click link (near bottom of article); new tab should open with wiki URL. |
| SCP-173 | Click `/component:license-box` | Wiki in new tab | Manual verify. |
| SCP-173 | Click `/licensing-guide` | Wiki in new tab | Manual verify. |
| SCP-5000 | Click tale link e.g. `/disgusting` | Wiki in new tab | Manual verify. |
| SCP-7910 | Click `/classification-committee-memo` | Wiki in new tab | Manual verify. |

---

## 6. Confirm unchanged behavior

| Test | Expected | Result |
|------|----------|--------|
| SCP-to-SCP (relative or absolute) | In-app navigation via `router.push` | Verified: SCP-682 → click SCP-079 → URL becomes `/scp/SCP-079` (step 2). |
| External http(s) links | New tab | Unchanged (step 3); absolute wiki URLs handled here. |
| Footnote refs | Tooltip (useFootnotes) | Unchanged (step 1 skip). |
| Empty/missing href (stripped `javascript:`) | preventDefault, no navigation | Unchanged (top of handler). |

---

## 7. Edge cases

- **Relative links that aren’t wiki pages:** Any relative path starting with `/` that is not an SCP link is rewritten to `https://scp-wiki.wikidot.com/...`. If the wiki has no such page, the wiki will show its 404; the app no longer sends the user to our 404.
- **Hash-only (`#section`):** Does not start with `/`; not SCP; not external. Falls through to default behavior (in-page navigation if target exists).
- **Query-only or malformed:** Same logic: only paths that `trim().startsWith('/')` and are not SCP get the wiki rewrite.
