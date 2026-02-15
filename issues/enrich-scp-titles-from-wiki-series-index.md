# Enrich SCP titles from Wiki series index pages

**Type:** enhancement · **Priority:** normal · **Effort:** medium · **Status:** done

## TL;DR

SCP cards (Daily Briefing, Notable Anomalies, list items) show only the SCP number because the upstream SCP-Data API provides no descriptive titles — `title` is identical to `scp_id` for all 9,300+ entries. We've hidden the duplicate in the UI; the real fix is sourcing descriptive titles (e.g. "The Sculpture", "Plague Doctor") from the SCP Wiki series index pages and updating the `scps.title` column in Supabase.

## Current state vs expected

| Current | Expected |
|--------|----------|
| Cards/lists show only "SCP-173" (or hide title when `title === scp_id`) | Cards show "SCP-173 — The Sculpture" (descriptive title when available) |
| `scps.title` in DB mirrors SCP-Data API (always equals `scp_id`) | `scps.title` populated from Wiki index pages where possible |

## Approach

1. Fetch the 10 series index pages from `scp-wiki.wikidot.com` (`/scp-series` through `/scp-series-10`). Each page lists every SCP in that series with its descriptive title, e.g. `SCP-173 - The Sculpture`.
2. Parse the HTML, extract SCP ID → descriptive title mappings.
3. Update the `title` column in Supabase by `scp_id`, batched.

## Implementation plan

1. **Validate HTML format** — Fetch 3 sample pages (`scp-series`, `scp-series-2`, `scp-series-6`), save raw HTML, confirm the exact markup pattern for list entries (e.g. `<li><a href="/scp-XXX">SCP-XXX</a> - Descriptive Title</li>`).
2. **Write enrichment script** — New script (e.g. `scripts/enrich-titles.ts`) that:
   - Fetches all 10 series pages (plus optionally joke-scps and explained index).
   - Parses titles using a DOM parser (cheerio or node-html-parser).
   - Handles edge cases: `[ACCESS DENIED]`, `[DATA EXPUNGED]`, `-J`, `-EX` suffixes.
   - Updates `scps.title` in Supabase by `scp_id`, batched.
3. **Run locally** — Like the existing seed script, runs via Node with `.env.local` credentials. Zero Vercel cost.
4. **Update UI** — None required. Once titles are populated, the existing conditional (`title && title !== scp_id`) will automatically show them.

## Edge cases to handle

- **Placeholder titles** (`[ACCESS DENIED]`, `[DATA EXPUNGED]`, `[REDACTED]`) — keep as-is or flag; UI already hides if `title === scp_id`.
- **Joke SCPs (-J), Explained (-EX), Archived (-ARC)** — may live on separate index pages.
- **Entries with no ` - ` separator** — fall back to no title (or keep `scp_id`).
- **Multiple links in one list item** — use first SCP link.

## Done

- Implemented `scripts/enrich-titles.ts`; ran enrichment and updated **9,246** `scps.title` rows from Wiki series index pages.
- The remaining **78** DB entries (9,324 − 9,246) have no descriptive title on the wiki index (no ` - ` separator); they continue to show the SCP number only, as before.

## Relevant files

- **Data/API:** `docs/scp-data-api-shape.md` (documents that API `title` is always identical to `scp`)
- **Scripts:** `scripts/seed-scps.ts` (pattern for local Node + Supabase; add `scripts/enrich-titles.ts`)
- **UI (no code change needed):** `components/ui/daily-featured-section.tsx`, `components/ui/top-rated-section.tsx` (already use `scp.title && scp.title !== scp.scp_id`); `app/page.tsx`, `app/home-content.tsx`, `app/scp/[id]/page.tsx` (select/use `title`)

## Impact

- Unlocks descriptive titles on homepage cards, SCP list items, and anywhere `scp.title` is displayed.
- Significantly improves browsability and recognition (e.g. "The Sculpture" vs "SCP-173").

## Labels

`enhancement` `data`
