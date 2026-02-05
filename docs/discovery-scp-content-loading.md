# Discovery: SCP Content Loading and Later SCP Failures

**Date:** 2026-02-05  
**Task:** Investigate why later SCPs (e.g. series 6+) fail to load content.

---

## Part 1: Current Content Fetching

### Location
`lib/hooks/use-scp-content.ts`

### How It Works
1. Hook receives `series` (e.g. `"series-10"`) and `scpId` (e.g. `"SCP-9600"`)
2. Calls `getContentFilename(series)` from `lib/utils/series.ts`
3. `getContentFilename` returns `content_series-${N}.json` for `series-N` (e.g. `content_series-10.json`)
4. Fetches `https://scp-data.tedivm.com/data/scp/items/{filename}`
5. Parses JSON and selects `data[scpId]` for the specific SCP

### URL for SCP-9600
- **Series:** `series-10`
- **Computed filename:** `content_series-10.json`
- **Actual URL called:** `https://scp-data.tedivm.com/data/scp/items/content_series-10.json`

### Result
**HTTP 404** — that file does not exist.

---

## Part 2: API Structure

### Index Files
| URL | Status | Notes |
|-----|--------|-------|
| `index.json` | 200 | ~39MB metadata for all SCPs |
| `content_index.json` | 200 | Maps series → content filename |

### Content File Naming
The API uses **two different naming schemes**:

- **Series 1–5:** `content_series-1.json`, `content_series-2.json`, … `content_series-5.json`
- **Series 6+:** Split into sub-series with decimals:
  - `content_series-6.0.json`, `content_series-6.5.json`
  - `content_series-7.0.json`, `content_series-7.5.json`
  - …
  - `content_series-10.0.json`, `content_series-10.5.json`

### Per-SCP `content_file` Field
Each entry in `index.json` includes a `content_file` field:

| SCP | series | content_file |
|-----|--------|--------------|
| SCP-9600 | series-10 | content_series-10.5.json |
| SCP-9000 | series-10 | content_series-10.0.json |
| SCP-9500 | series-10 | content_series-10.0.json |
| SCP-6000 | series-7 | content_series-7.0.json |

We derive the filename from `series` only, but for series 6+ the API uses per-SCP `content_file` because a single series spans multiple content files.

### Are We Fetching Individual or Series Content?
We fetch **series content files** (one JSON per series/sub-series). We do **not** fetch individual SCP files. Our bug is using the wrong series-level filename: `content_series-10.json` instead of `content_series-10.0.json` or `content_series-10.5.json`.

---

## Part 3: API Direct Test Results

| URL | Status | Notes |
|-----|--------|-------|
| `content_index.json` | 200 | Exists |
| `index.json` | 200 | Exists |
| `content_series-1.json` | 200 | Early series works |
| `content_series-10.json` | **404** | Our current URL — does not exist |
| `content_series-10.0.json` | 200 | Correct filename for 9000–9499 |
| `content_series-10.5.json` | 200 | Correct filename for 9500–9999 |
| `series-10/scp-9600.json` | 404 | Individual files don't exist |

---

## Part 4: Error Handling

### Error Thrown
`use-scp-content.ts` line 20:
```ts
if (!response.ok) {
  throw new Error(`Failed to fetch content: ${response.statusText}`)
}
```
For 404, this becomes: `Failed to fetch content: Not Found`.

### Display in Reader
`app/scp/[id]/scp-reader.tsx` lines 99–107:
```tsx
{contentError && (
  <div role="alert">
    <Card variant="bordered" accentBorder padding="md">
      <Text style={{ color: 'var(--color-red-7)' }}>
        Failed to load content. Please try again.
      </Text>
    </Card>
  </div>
)}
```
Generic message, no retry button. TanStack Query provides `refetch`, but it is not exposed in the UI.

### Root Cause
The failure is a **persistent 404** caused by the wrong URL. A "Try again" button would not help unless the URL logic is fixed.

---

## Part 5: Current SCP Reader Structure

### Layout
1. **Header:** Back link, title, rating, `ReadToggleButton` (Mark as Read) — in header only
2. **Content area:**
   - Loading spinner
   - Error card (if `contentError`)
   - Article content (if `content`)

### Mark as Read Button
- **Placement:** Header, top-right (via `ReadToggleButton`)
- **Not** at the bottom of the article

### Next/Previous Navigation
- None

### Error State
- Red-bordered card with "Failed to load content. Please try again."
- No retry button, no details about status code or cause

---

## Root Cause Summary

**Later SCPs fail because we compute the wrong content filename.**

- We use `getContentFilename(series)` which maps `series-10` → `content_series-10.json`
- For series 6+, the API uses `content_series-N.0.json` and `content_series-N.5.json`
- The API index provides `content_file` per SCP, which we do not use

### Fix Options

1. **Store `content_file` in the DB (recommended)**
   - Add `content_file` to `scps` table
   - Update seed script to copy `content_file` from the API index
   - Use `scp.content_file` in `useScpContent` instead of `getContentFilename(scp.series)`

2. **Lookup `content_file` at runtime**
   - Fetch `content_index.json` and/or `index.json` to resolve series → filename
   - More complex, and `index.json` is large (~39MB)

3. **Hardcode series 6+ mapping**
   - Extend `getContentFilename` to map by SCP number (e.g. 9500–9999 → `content_series-10.5.json`)
   - Fragile if the API changes splits

---

## Output Checklist

| Item | Result |
|------|--------|
| Actual API URL for SCP-9600 | `https://scp-data.tedivm.com/data/scp/items/content_series-10.json` |
| That URL returns | **404** |
| Correct URL for SCP-9600 | `content_series-10.5.json` (from `content_file` in index) |
| Current reader layout | Mark as Read in header only; no next/prev; error card with no retry |
| Root cause | Wrong content filename for series 6+; need per-SCP `content_file` |
