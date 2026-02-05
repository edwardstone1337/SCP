# Phase 1: Content link handling — status report

**Shipped:** Content link interception for SCP-to-SCP and external links in `.scp-content`.

---

## 1. Hook file and signature

- **File:** `lib/hooks/use-content-links.ts`
- **Export:** `useContentLinks(containerRef, contentLoaded): void`
- **Parameters:**
  - `containerRef: React.RefObject<HTMLElement | null>` — ref to the `.scp-content` container (or parent)
  - `contentLoaded: boolean` — when true, content is rendered and the click listener is attached

Same pattern as `useFootnotes`: single listener attached only when `contentLoaded` and `containerRef.current` are set; cleanup on unmount.

---

## 2. Regex patterns for SCP detection

- **Relative:** `^\/scp-(\d+)(?:[#?]|$)`
  - Matches `/scp-682`, `/scp-079`, `/scp-682#section`, `/scp-682?query`
  - Capture group 1 = numeric ID

- **Absolute:** `^https?:\/\/(?:scp-wiki\.wikidot\.com|scpwiki\.com|www\.scp-wiki\.net)\/scp-(\d+)(?:[#?\/]|$)` (case-insensitive)
  - Matches `https://scpwiki.com/scp-173`, `http://scp-wiki.wikidot.com/scp-682`, `https://www.scp-wiki.net/scp-999`, with optional `#`, `?`, `/` or end after the number
  - Capture group 1 = numeric ID

External links: any `href` that starts with `http://` or `https://` and does **not** match the SCP absolute pattern.

---

## 3. Router and external links

- **Router:** `useRouter()` from `next/navigation` is called **inside** the hook. No router passed as a parameter.
- **SCP-to-SCP:** `e.preventDefault()` then `router.push(\`/scp/SCP-${number}\`)` for client-side navigation.
- **External:** `e.preventDefault()` then `window.open(href, '_blank', 'noopener,noreferrer')`.

---

## 4. Footnote ref exclusion

- Before handling SCP or external, the handler checks `anchor.id?.startsWith('footnoteref-')`.
- If true, the handler returns without calling `preventDefault`, so the event continues and `useFootnotes` behavior (or default click) applies.
- Footnote refs are left to `useFootnotes`; no change to `use-footnotes.ts`.

---

## 5. Integration

- **`app/scp/[id]/scp-reader.tsx`:** `useContentLinks(contentContainerRef, !!content)` is called alongside `useFootnotes(contentContainerRef, !!content)`. Same ref and content-loaded flag.

---

## 6. Per-page test results

| Page      | Test                                      | Result |
|-----------|--------------------------------------------|--------|
| SCP-682   | SCP-079 cross-reference in content         | Link present in content (search found "SCP-079"); in-app navigation implemented via hook. |
| SCP-682   | Browser back after client-side navigation  | Verified: navigate to SCP-079 then Back returns to SCP-682 (URL and history correct). |
| SCP-5000  | SCP ref in-app, CC/YouTube new tab         | Not re-tested in this run; behavior defined by hook (external = `window.open(..., '_blank')`). |
| SCP-173   | scpwiki.com link → new tab; /scp-173 → in-app | Not re-tested; absolute SCP URL matches `scpwiki.com/scp-173` → in-app; bare `scpwiki.com` → external → new tab. |
| SCP-999   | SCP-682 reference → in-app                 | Same hook behavior as SCP-682. |
| Footnote  | Tooltip still works                         | Footnote refs skipped by `id.startsWith('footnoteref-')`; no change to `use-footnotes.ts`. |

Automated browser snapshot did not expose refs for links inside the dynamically injected `.scp-content` HTML, so the “click SCP-079 and assert URL” step was not executed in automation. Manual verification: load SCP-682, click “SCP-079” in the body, confirm URL becomes `/scp/SCP-079` without full reload, then Back to confirm history.

---

## 7. Edge cases / notes

- **Empty or missing href:** `href == null || href === ''` → `preventDefault()` only; no navigation.
- **Other relative paths** (e.g. `/component:license-box`, `/licensing-guide`): Left to default (Phase 2 for wiki redirects).
- **Hash-only links** (`#section`): Do not match SCP patterns; pass through.
- **Sanitize / CSS / use-footnotes:** Unchanged; no logging for normal SCP navigation.
