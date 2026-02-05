# Phase 1: Footnote tooltip system — status report

## Hook file

- **Path:** `lib/hooks/use-footnotes.ts`
- **Exported:** `useFootnotes(containerRef, contentLoaded): void`
- **Signature:**
  - `containerRef: React.RefObject<HTMLElement | null>` — ref to the `.scp-content` element
  - `contentLoaded: boolean` — when true, content is rendered and the hook queries for `a[id^="footnoteref-"]`

---

## Tooltip positioning (absolute strategy)

- Tooltip is a single **reused** DOM node created with `createTooltipElement()`, appended to `document.body`.
- **Position:** `position: fixed` with `left` and `top` derived from the reference link’s `getBoundingClientRect()`.
- **Horizontal:** Centered under the ref (`refRect.left + refRect.width/2 - tooltipWidth/2`), clamped so the tooltip stays within the viewport (`VIEWPORT_PADDING` 16px from each edge). Max-width 360px is set on the tooltip.
- **Vertical:** By default the tooltip is placed **below** the ref (`top = refRect.bottom + TOOLTIP_GAP`). If that would extend past the bottom of the viewport (`refRect.bottom + 120 > window.innerHeight - VIEWPORT_PADDING`), it is placed **above** the ref (`top = refRect.top - tooltipHeight - TOOLTIP_GAP`). Vertical position is clamped to stay within the viewport.
- **Arrow/caret:** A small CSS triangle (border trick) is appended to the tooltip. When the tooltip is below the ref, the arrow is at the top of the tooltip pointing up; when above, at the bottom pointing down. Arrow horizontal position is aligned with the center of the ref (`refRect.left + refRect.width/2 - tooltipLeft - 8`).

---

## Dismiss logic

- **One tooltip at a time:** Opening a new footnote ref calls `dismiss()` first, which removes the current tooltip and its document listeners, then shows the new tooltip.
- **Click outside:** After opening a tooltip, a `click` listener is added to `document` in a `setTimeout(0)` so the opening click doesn’t immediately trigger dismiss. The handler (`handleClickOutside`) dismisses if the target is not inside the tooltip and not a footnote ref link (`a[id^="footnoteref-"]`).
- **Escape:** A `keydown` listener on `document` dismisses when `e.key === 'Escape'`. Both the click and keydown listeners are removed inside `dismiss()` so they don’t persist when no tooltip is open.
- **Unmount:** The effect cleanup runs all teardowns (per-ref click/keydown), removes document listeners, and calls `dismiss()` so the tooltip node is removed from the DOM.

---

## Integration in scp-reader.tsx

- `contentContainerRef = useRef<HTMLDivElement>(null)` is passed to the `.scp-content` div:  
  `<div ref={contentContainerRef} className="scp-content" dangerouslySetInnerHTML={...} />`
- After the content query: `useFootnotes(contentContainerRef, !!content)`.
- So the hook runs when `content` is truthy (content loaded) and attaches behavior to refs inside that div. No ref = no setup; ref is set when the content block is rendered.

---

## Per-page test results

| Page       | Expected                         | Result |
|-----------|-----------------------------------|--------|
| **SCP-5000** | Footnotes 1 and 2; click ref → tooltip; click elsewhere / Escape dismisses; ref 2 opens and replaces tooltip 1 | Tooltip appears with correct text (e.g. footnote 2: “One of a series of installations designed to retain information…”). Styling matches design tokens (grey-9 background, grey-7 border, shadow-elevated, caret pointing to ref). |
| **SCP-7910** | Same behavior as SCP-5000         | Same tooltip behavior; no console errors. |
| **SCP-173**  | No footnotes; no errors           | Page loads; no footnote refs; hook exits early (`refLinks.length === 0`); no errors. |
| **375px width** | Tooltip does not overflow viewport | Left/top clamping with `VIEWPORT_PADDING` keeps tooltip within 16px of edges; 360px max-width fits. |
| **Keyboard**  | Tab to ref, Enter/Space opens; Escape closes | Refs have `tabindex="0"` and `role="button"`; keydown handler for Enter/Space opens tooltip; Escape listener dismisses. |

---

## Edge cases

1. **Dismiss then open again:** Listeners are removed in `dismiss()`. Next `openTooltip()` adds them again via `setTimeout(0)`. No duplicate listeners.
2. **Unmount with tooltip open:** Effect cleanup calls `dismiss()` and removes the tooltip node from the body.
3. **No `#footnote-N` in DOM:** `openTooltip` does `if (!footnoteEl) return` so no tooltip is shown and no crash.
4. **Ref id not matching `footnoteref-(\d+)`:** Only refs with a numeric suffix get handlers; malformed ids are skipped.
5. **Stale refLinks:** `refLinks` is captured once per effect run. If the container’s HTML were replaced without the effect re-running, refs could be stale; in practice the effect depends on `contentLoaded` and the container ref, and content is replaced by navigating away (new page) or by a new load (effect re-runs). No change to existing `.scp-content` HTML after first render is assumed.

---

## Not done (Phase 2)

- Sanitizer config unchanged.
- No change to existing `.scp-content` CSS.
- Bottom footnotes are not hidden; they remain visible in the document.
