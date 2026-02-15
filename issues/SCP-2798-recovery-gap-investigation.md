# SCP-2798 Recovery Gap Investigation

The image audit flagged SCP-2798 as the #1 most affected article (23 missing images), but `recoverWikidotImages` finds **0** to recover. This report documents the root cause.

---

## Step 1 — Raw Data Summary

**Source:** `content_series-3.json` from `scp-data.tedivm.com`

| Field       | Length   |
|-------------|----------|
| raw_source  | 100,167 chars |
| raw_content | 200,172 chars |

**Temp files saved:** `/tmp/scp-2798-raw_source.txt`, `/tmp/scp-2798-raw_content.txt`

---

## Step 2 — Images in raw_content (already rendered)

**IMG tags in raw_content:** 33 total

| # | src | Notes |
|---|-----|-------|
| 1 | `http://scpdsandbox.wikidot.com/local--files/billith9/starlorn.png` | article image |
| 2–33 | `avatar.php?userid=3042342...` (31×) + `planet.png`, `mercy.png` | avatars + 2 more article images |

**Extracted filenames (for dedup):** `starlorn.png`, `planet.png`, `mercy.png` (plus avatar URLs)

---

## Step 3 — The 23 Matches the Audit Script Finds

`countSourceImages()` in `scripts/image-gap-audit.mjs` uses:

1. `[[([=<>]?)image\s` — matches `[[image `, `[[=image `, `[[<image `, `[[>image `
2. `[[include\s+[^\]]*image-block` — matches any `[[include ... image-block`

**Breakdown for SCP-2798:**

| Pattern | Count | Matches |
|---------|-------|---------|
| `[[=image ` | 20 | All 20 [[=image http://...]] or https://... refs |
| `[[include ... image-block` | 3 | Three image-block includes (starlorn, planet, mercy) |
| **Total** | **23** | |

**Full list of 23 matches:**

| # | Line (approx) | Type | Full match (truncated) |
|---|---------------|------|------------------------|
| 1–20 | various | [[=image | `[[=image http://scpdsandbox.wikidot.com/local--files/billith9/scan.jpg]]`, scan3, scan2, plant3, plant2, visage, scan4–13, plant, plant4, filament, scan7–12, horizon, plant5 |
| 21 | 12 | include image-block | starlorn.png (name=full URL) |
| 22 | 430 | include image-block | planet.png (name=full URL) |
| 23 | 580 | include image-block | mercy.png (name=full URL) |

---

## Step 4 — Debug Console Output from recoverWikidotImages

```
[recoverWikidotImages SCP-2798] rawSource length: 100167
[recoverWikidotImages SCP-2798] trimmed length: 92763
[recoverWikidotImages SCP-2798] trimmed cut: 7404 chars
[recoverWikidotImages SCP-2798] rendered (already in raw_content): [
  'starlorn.png', 'planet.png', 'mercy.png',
  'avatar.php?userid=3042342&amp;amp;size=small&amp;amp;timestamp=...'
]

Pattern A #1–20:  filename = http://scpdsandbox.wikidot.com/... or https://scpdsandbox.wdfiles.com/...
                  skip: true, reason: 'isExternal'

Pattern B #1–3:   filename = http://scpdsandbox.wikidot.com/local--files/billith9/starlorn.png (etc.)
                  skip: true, reason: 'isExternal'

[recoverWikidotImages SCP-2798] Pattern A total: 20 skipped: 20
[recoverWikidotImages SCP-2798] Pattern B total: 3
[recoverWikidotImages SCP-2798] recovered after dedup: 0
[recoverWikidotImages SCP-2798] Final recovery count: 0
```

---

## Step 5 — Diff: What We Miss and Why

| Audit count | Recovery finds | Missed | Reason |
|-------------|----------------|--------|--------|
| 20 [[=image | 20 Pattern A | 0 | All 20 **match** Pattern A regex |
| 3 image-block | 3 Pattern B | 0 | All 3 **match** Pattern B regex |
| **23** | **23 matched** | **23 skipped** | **`isExternal()` filters every one** |

**Root cause:** SCP-2798 uses **full URLs** in both syntaxes:

- `[[=image http://scpdsandbox.wikidot.com/local--files/billith9/scan.jpg]]`
- `[[include component:image-block | name=http://scpdsandbox.wikidot.com/local--files/billith9/starlorn.png]]`

Our recovery expects **bare filenames** (e.g. `scan.jpg`, `starlorn.png`) and builds:

```
https://scp-wiki.wdfiles.com/local--files/scp-2798/<filename>
```

We explicitly skip anything `isExternal()` (starts with `http` or contains `:`), so all 23 are filtered out before recovery.

---

## Step 6 — Image Syntax Patterns We Don't Handle

| Pattern | Example | Our behavior |
|---------|---------|--------------|
| `[[=image <full URL>]]` | `[[=image http://scpdsandbox.wikidot.com/local--files/billith9/scan.jpg]]` | Matched by Pattern A, skipped by `isExternal()` |
| `[[include component:image-block name=<full URL>]]` | `name=http://scpdsandbox.wikidot.com/local--files/billith9/starlorn.png` | Matched by Pattern B, skipped by `isExternal()` |

**Other image references in raw_source (not counted by audit):**

- `background-image:url(http://scpdsandbox.wikidot.com/local--files/billith9/field.png)` — CSS
- `--header-logo:url(https://scp-wiki.wdfiles.com/...)` — CSS variable
- `containment-image= https://scp-wiki.wdfiles.com/...` — component param
- `clearance-five-image=http://scpdsandbox.../catspaw.png` — component param
- `secondary-icon= http://scpdsandbox.../skol.svg` — component param

---

## Conclusion

1. **Audit is correct** — 23 image refs in source; 3 already rendered (starlorn, planet, mercy) → 20 missing.
2. **Recovery regexes work** — Pattern A and B both match all 23.
3. **`isExternal()` is the blocker** — Every SCP-2798 image uses a full URL (scpdsandbox), so all are skipped.

**Possible fixes (for future work):**

- **Option A:** For `[[=image <url>]]` and `name=<url>`, if URL is `*.wikidot.com/local--files/*` or `*.wdfiles.com/local--files/*`, extract the filename (last path segment) and use it with `scp-wiki.wdfiles.com/local--files/{scpSlug}/{filename}`. Caveat: SCP-2798 uses `billith9` (sandbox) not `scp-2798` — images may live on a different page; we’d need to test whether copying to scp-2798 works or if we must use the original URL.
- **Option B:** For local Wikidot URLs, use the URL as `src` directly (no rewriting). Simpler but depends on scpdsandbox staying reachable.
- **Option C:** Document SCP-2798 as out-of-scope for recovery (sandbox-hosted images) and leave as-is.

---

*Investigation completed. Temp data: `/tmp/scp-2798-raw_source.txt`, `/tmp/scp-2798-raw_content.txt`, `/tmp/cs3.json`.*
