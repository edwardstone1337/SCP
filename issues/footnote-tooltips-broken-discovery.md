# Discovery: Footnote tooltips broken on prod

**Issue:** Clicking a footnote superscript navigates to `#` (scrolls to top) instead of showing the tooltip. Report-only; no code changes.

---

## 1. `lib/hooks/use-footnotes.ts`

### What the hook does

- Attaches footnote tooltip behavior to the `.scp-content` container.
- **Finding refs:** `container.querySelectorAll('a[id^="footnoteref-"]')` — i.e. it only cares about the **`id`** attribute on `<a>` (e.g. `id="footnoteref-1"`).
- **Finding footnote body:** For each ref it parses the number from `id` (`footnoteref-(\d+)`), then looks up the target with `container.querySelector('#footnote-' + num)` (e.g. `#footnote-1`).
- **Preventing default / showing tooltip:** For each ref it adds a `click` listener that calls `e.preventDefault()`, `e.stopPropagation()`, and `openTooltip(refEl, num)`. It also adds `keydown` for Enter/Space. So if the listener is attached, the link never performs its default navigation.

### Selectors / class names in rendered HTML

- **Ref links:** Must be `<a>` with `id` starting with `footnoteref-` (e.g. `id="footnoteref-1"`). Class `footnoteref` is used for styling but the hook does **not** depend on it.
- **Footnote targets:** Elements with `id="footnote-N"` (e.g. `div.footnote-footer#footnote-1`).

### Conclusion for the hook

- The hook does **not** rely on `href` for finding refs; it relies only on `id^="footnoteref-"`.
- If **no** elements match `a[id^="footnoteref-"]`, the effect returns without attaching any listeners, so the link’s default behavior (navigate to `href`, e.g. `#`) will run. So the observed “navigate to #” behavior implies the click handler was **not** attached — i.e. either the selector found no nodes when the effect ran, or something else is consuming the click first (unlikely; see useContentLinks below).

---

## 2. `lib/utils/sanitize-server.ts` (async refactor)

### Does sanitization preserve footnote markup?

- **Config:** Server uses the same `SANITIZE_CONFIG` from `sanitize.ts`: `ALLOWED_ATTR` includes `href`, `class`, `id`, `style`. So DOMPurify is allowed to keep `id` and `href` on `<a>`.
- **Hook:** The server’s `afterSanitizeElements` hook only does: (1) remove `.licensebox` nodes, (2) for `<a>`, if `href` matches `javascript:`, set `href` to `#`. It does **not** strip `id` or other attributes.
- **Test run:** A one-off script was run that fetches SCP-049 raw content, runs `recoverWikidotImages` + `sanitizeHtmlServer`, and inspects the first footnote ref.

**Before sanitization (first footnote ref):**

```html
<a class="footnoteref" href="javascript:;" id="footnoteref-1" onclick="WIKIDOT.page.utils.scrollToReference('footnote-1')">
```

**After sanitization (first footnote ref):**

```html
<a class="footnoteref" href="#" id="footnoteref-1">
```

- **Footnote target:** `<div class="footnote-footer" id="footnote-1">` is present after sanitization.
- So **server-side sanitization preserves** `id="footnoteref-N"`, `id="footnote-N"`, and class; it only rewrites `href` from `javascript:;` to `#`. The `useFootnotes` selector `a[id^="footnoteref-"]` **does** match the actual DOM structure produced by sanitization.

### DOMPurify config and footnote attributes

- `id`, `href`, `class` are in `ALLOWED_ATTR`; `onclick` is not and is stripped. So footnote refs keep `id` and `href` (with `href` forced to `#` by our hook for `javascript:`). No evidence that the async refactor or JSDOM changed this.

---

## 3. `app/scp/[id]/scp-reader.tsx`

### How / where `useFootnotes` is called

- **Call:** `useFootnotes(contentContainerRef, contentLoaded)` (line 89).
- **Container:** `contentContainerRef` is attached to the `<article className="scp-content">` that receives `dangerouslySetInnerHTML={{ __html: contentHtml }}` (lines 303–306). So the footnote refs are **inside** that article element.
- **When content is ready:** `contentLoaded = hasServerContent || !!clientContent`. So when we have server content, `contentLoaded` is true on the first render that has `serverContent`, and the article is rendered with `contentHtml` in the same render. No client fetch is involved when `hasServerContent` is true.

### Lifecycle / timing

- The effect runs when `contentLoaded` and `containerRef.current` are truthy. It does **not** re-run when the container’s children change (e.g. no dependency on the container’s innerHTML or child count).
- If for any reason the **first** time the effect runs the article has not yet received its `innerHTML` (e.g. streaming or commit order), `querySelectorAll('a[id^="footnoteref-"]')` would return 0 nodes, no listeners would be attached, and later when the content appears the effect would not run again. That would explain “click → navigate to #” with no tooltip.

---

## 4. Server-rendered HTML check (prod)

- **Method:** `curl -sS 'https://scp-reader.co/scp/SCP-049'` was saved to a file; the full response is ~75KB.
- **Finding:** A search for `footnoteref` in that file **does** find a match (in a long minified line), so the **prod server does send** markup that includes the string `footnoteref`. The exact `<a ...>` snippet was not extracted (minified/concatenated HTML); the local sanitization test above confirms that with the same code path the anchor has `id="footnoteref-1"` and `href="#"`.
- So we do **not** have evidence that prod is stripping `id` or sending a different structure; the more likely failure mode is that **no click handlers are attached** (selector finds 0 refs at effect time) rather than prod sending wrong markup.

---

## 5. Summary

| Item | Result |
|------|--------|
| **Footnote markup before sanitization** | `<a class="footnoteref" href="javascript:;" id="footnoteref-1" onclick="...">` (SCP-049). |
| **Footnote markup after sanitization** | `<a class="footnoteref" href="#" id="footnoteref-1">`; `#footnote-1` div preserved. |
| **useFootnotes selector vs DOM** | Selector `a[id^="footnoteref-"]` matches the sanitized markup. |
| **DOMPurify / async** | No indication that DOMPurify or the async JSDOM refactor strips `id` or footnote-related attributes; test shows ids and targets preserved. |

### Assessment: what’s broken and where

- **Not broken:** Server (and client) sanitization keeps footnote ref `id`s and target `id`s; `href` is correctly normalized to `#`. The hook’s selector matches the actual DOM structure.
- **Likely broken:** The footnote **click handler is not attached** on the affected pages. So when the user clicks the ref, the browser performs the default action for `<a href="#">` (navigate to `#`, scroll to top).
- **Plausible cause:** The `useFootnotes` effect runs **once** when `contentLoaded` and `containerRef.current` are set. If at that moment the article’s `innerHTML` has not yet been applied (e.g. streaming, or ref set before children are in the DOM), `querySelectorAll('a[id^="footnoteref-"]')` returns 0, so no listeners are ever attached. The effect does not re-run when the container later gets its content, so the links stay “plain” and trigger default navigation.
- **Alternative (less likely):** Prod-only difference (e.g. `serverContent` null so client fetches and something in the client path drops ids), or another listener calling `preventDefault` before the footnote handler (inspection of `useContentLinks` shows it skips `footnoteref-` and does not preventDefault on those links, so footnote handler should still run if attached).

### Recommended next steps (for implementation phase)

1. **Defer attachment until refs exist:** e.g. run the ref query after a microtask or `requestAnimationFrame`, or use a `MutationObserver` on the container to attach footnote handlers when `a[id^="footnoteref-"]` appear, so that even if the first effect run sees an empty container, handlers are attached once the content is in the DOM.
2. **Optional:** Add a short (e.g. 0ms) `setTimeout` before `querySelectorAll` in the effect so the query runs after the current commit has been applied; or re-run the effect when the container’s child count or innerHTML length changes (e.g. via a state that updates when content is known to be in the DOM).
3. **Verify on prod:** In browser devtools, on an SCP page with footnotes, check whether the footnote `<a>` elements have `id="footnoteref-N"` and whether any click listeners are attached. If ids are present but no listeners, that confirms the “effect ran before content” (or similar) theory.

---

**Test script used:** `npx tsx scripts/test-footnote-sanitize.ts` (run once to reproduce before/after sanitization for SCP-049; can be removed or kept for regression use.)
