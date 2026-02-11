# Dark Theme Scanner

A standalone QA tool that scans the top 100 highest-rated SCPs for dark theme legibility issues.

## When to Run

**⚠️ REQUIRED: Run this scanner after any changes to `lib/utils/sanitize.ts`**

Specifically, run after modifying:
- `applyInlineStyleLegibilityFixes()` — the core dark theme fix logic
- `sanitizeHtml()` — if changing allowed tags/attributes
- Color parsing or luminance calculation functions

```bash
# After modifying sanitization logic, verify dark theme legibility:
npx tsx scripts/dark-theme-scanner.ts
```

A clean scan (0 issues) means your changes preserve dark theme legibility across the most-viewed content.

## What it does

1. **Fetches top 100 SCPs** from Supabase (by rating)
2. **Downloads raw HTML** from SCP-Data API for each article
3. **Runs through sanitization pipeline** (the same one used in production)
4. **Scans for dark theme issues** across 5 categories:
   - **Category A**: Contrast failures (dark text on dark bg, light on light, etc.)
   - **Category B**: Border/visual issues (near-black borders)
   - **Category C**: Opacity/visibility problems (low opacity, transparent text, hidden content)
   - **Category D**: Nested context conflicts (poor contrast between child text and parent background)
   - **Category E**: Unhandled patterns (gradients, filters, blend modes with dark colors)
5. **Outputs JSON report** + console summary

## Prerequisites

- `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Node.js and npm installed
- Dependencies installed (`npm install`)

## How to run

```bash
npx tsx scripts/dark-theme-scanner.ts
```

The script will:
- Fetch 100 SCPs (takes ~20-30 seconds total with 200ms delay between fetches)
- Display progress for each SCP
- Write a detailed JSON report to `scripts/output/dark-theme-report.json`
- Print a summary table to the console

## Output

### JSON Report Structure

```json
{
  "scannedAt": "2026-02-12T...",
  "totalScps": 100,
  "scpsWithIssues": 42,
  "summary": {
    "categoryA": { "count": 85, "affectedScps": ["SCP-173", ...] },
    "categoryB": { "count": 12, "affectedScps": [...] },
    "categoryC": { "count": 8, "affectedScps": [...] },
    "categoryD": { "count": 3, "affectedScps": [...] },
    "categoryE": { "count": 15, "affectedScps": [...] }
  },
  "details": [
    {
      "scpId": "SCP-173",
      "rating": 8200,
      "issues": [
        {
          "category": "A",
          "description": "Dark text without background",
          "element": "span",
          "selector": "div > span:nth-child(3)",
          "inlineStyle": "color: #333",
          "details": { "color": "#333", "luminance": "0.180" },
          "suggestion": "Add background or remap color"
        }
      ]
    }
  ]
}
```

### Console Output

```
🔍 Dark Theme Scanner

Step 1: Fetching top 100 SCPs from Supabase...
✓ Fetched 100 SCPs

Step 2-4: Fetching content, sanitizing, and scanning...

[1/100] SCP-173: The Sculpture - The Original
  ⚠ Found 3 issue(s)

[2/100] SCP-087: The Stairwell
  ✓ No issues

...

═══════════════════════════════════════════════════════════
                      SUMMARY REPORT
═══════════════════════════════════════════════════════════

Total SCPs scanned:      100
SCPs with issues:        42
SCPs without issues:     58

Issues by category:
  Category A (Contrast failures):        85 (35 SCPs)
  Category B (Border/visual):            12 (8 SCPs)
  Category C (Opacity/visibility):       8 (7 SCPs)
  Category D (Nested context):           3 (3 SCPs)
  Category E (Unhandled patterns):       15 (12 SCPs)

Most affected SCPs (by total issue count):
  1. SCP-173 (rating: 8200) — 15 issues
  2. SCP-682 (rating: 7500) — 12 issues
  ...

═══════════════════════════════════════════════════════════

✓ Scan complete!
```

## What's being scanned

The scanner checks sanitized HTML for:

### Category A: Contrast Failures
- Dark text (luminance < 0.3) without explicit background
- Light text (luminance > 0.85) on light background (luminance > 0.85)
- Light backgrounds (luminance > 0.7) without explicit text color

### Category B: Border/Visual Issues
- Border colors with luminance < 0.2 (near-black)

### Category C: Opacity/Visibility
- Opacity values below 0.3 on content-bearing elements
- Transparent text color on visible text
- `display: none` on content-bearing elements

### Category D: Nested Context Conflicts
- Contrast ratio < 3:1 between child text color and parent background color

### Category E: Unhandled Patterns
- Background images/gradients without explicit text color
- Dark colors in `filter`, `mix-blend-mode`, or `text-shadow`

## Notes

- The scanner runs **outside of Next.js** — it's a standalone Node script
- It uses the **same sanitization pipeline** as the production reader
- It fetches content **directly from scp-data.tedivm.com** (no Vercel cost)
- 200ms delay between API requests to be respectful to the upstream service
- Output is written to `scripts/output/` (gitignored)

## Interpreting results

- **Category A issues** are the highest priority — they directly affect readability
- **Category C issues** may be intentional (redactions, spoilers) — flag for manual review
- **Category E issues** may be edge cases — verify if the sanitizer needs enhancement
- **Categories B and D** are moderate priority — visual quality improvements

Use the JSON report to identify patterns and prioritize fixes to the sanitization pipeline.
