# SCP-Data API Response Shape

Base URL: `https://scp-data.tedivm.com/data/scp/items/`

## Index (`index.json`)

Returns a JSON object keyed by SCP ID (e.g. `"SCP-173"`). Total entries: **9,359**.

| Field | Type | Example (SCP-0000-EX) | Notes |
|-------|------|-----------------------|-------|
| `scp` | string | `"SCP-0000-EX"` | SCP identifier |
| `title` | string | `"SCP-0000-EX"` | **Always identical to `scp`** — not a descriptive title |
| `scp_number` | int | `0` | Numeric portion |
| `series` | string | `"explained"` | Series grouping (e.g. `"series-1"`, `"explained"`) |
| `rating` | int | `325` | Community rating |
| `url` | string | `"https://scp-wiki.wikidot.com/scp-0000-ex"` | Canonical wiki URL |
| `content_file` | string | `"content_explained.json"` | Filename for content fetch |
| `created_at` | string | `"2020-11-11T12:02:00"` | Page creation timestamp |
| `creator` | string | `"Ralliston"` | Original author |
| `domain` | string | `"scp-wiki.wikidot.com"` | Source domain |
| `link` | string | `"scp-0000-ex"` | Wiki page slug |
| `page_id` | string | `"1305780022"` | Wikidot page ID |
| `tags` | string[] | `["_licensebox", "explained", "memetic", ...]` | Wiki tags |
| `hubs` | string[] | `["and-every-time-we-meet-again-hub", "scp-ex"]` | Hub memberships |
| `images` | any[] | `[]` | Image references (usually empty) |
| `references` | string[] | `["ralliston-s-authorpage", "scp-0110-j", ...]` | Outbound page references |
| `history` | object[] | `[{author, author_href, comment, date}, ...]` | Edit history |

### Key finding: `title` field

Checked all 9,359 entries — **every single one** has `title` identical to `scp`. The API does not provide descriptive titles (e.g. "The Sculpture" for SCP-173).

---

## Content files (`content_*.json`)

Fetched by `content_file` value from the index. Returns a JSON object keyed by SCP ID. Each content file covers a group (e.g. `content_series-1.json` covers Series I).

Example: `content_series-1.json` → key `"SCP-173"`

| Field | Type | Example (SCP-173) | Notes |
|-------|------|-----------------------|-------|
| `scp` | string | `"SCP-173"` | SCP identifier |
| `title` | string | `"SCP-173"` | Same as `scp` (no descriptive title here either) |
| `scp_number` | int | `173` | Numeric portion |
| `series` | string | `"series-1"` | Series grouping |
| `rating` | int | `10439` | Community rating |
| `url` | string | `"https://scp-wiki.wikidot.com/scp-173"` | Canonical wiki URL |
| `content_file` | — | Not present in content entries | Only in index |
| `created_at` | string | `"2008-07-25T20:49:00"` | Page creation timestamp |
| `creator` | string | `"Lt Masipag"` | Original author |
| `domain` | string | `"scp-wiki.wikidot.com"` | Source domain |
| `link` | string | `"scp-173"` | Wiki page slug |
| `page_id` | string | `"1956234"` | Wikidot page ID |
| `tags` | string[] | `["_licensebox", "autonomous", "euclid", "featured", ...]` | Wiki tags |
| `hubs` | string[] | `["scp-series", "april-fools-2021", ...]` | Hub memberships |
| `images` | any[] | `[]` | Image references |
| `references` | string[] | `["scp-172", "scp-174", "component:license-box", ...]` | Outbound page references |
| `history` | object[] | `[{author, author_href, comment, date}, ...]` | Full edit history |
| `raw_content` | string | `"<html><body><div id=\"page-content\">..."` | **Full article HTML** |
| `raw_source` | string | `"[[>]]\n[[module Rate]]\n..."` | **Wikidot source markup** |

### Content-only fields

These fields appear in content entries but **not** in the index:

- `raw_content` — Full rendered HTML of the article
- `raw_source` — Original Wikidot markup

### Fields shared between index and content

All other fields (`scp`, `title`, `scp_number`, `series`, `rating`, `url`, `created_at`, `creator`, `domain`, `link`, `page_id`, `tags`, `hubs`, `images`, `references`, `history`) appear in both.

---

## What we seed into the database

From [scripts/seed-scps.ts](../scripts/seed-scps.ts), we map index fields to the `scps` table:

| API field | DB column | Value |
|-----------|-----------|-------|
| `scp` | `scp_id` | `"SCP-173"` |
| `title` | `title` | `"SCP-173"` (same as scp_id — this is the duplicate title problem) |
| `scp_number` | `scp_number` | `173` |
| `series` | `series` | `"series-1"` |
| `rating` | `rating` | `10439` |
| `url` | `url` | `"https://scp-wiki.wikidot.com/scp-173"` |
| `content_file` | `content_file` | `"content_series-1.json"` |

### Fields available but NOT seeded

| API field | Potential use |
|-----------|-------------|
| `creator` | Already fetched at render time from content files |
| `created_at` | Could populate `scps.created_at` with original wiki date |
| `tags` | Could enable tag-based filtering/search |
| `hubs` | Could enable hub-based grouping |
| `link` | Wiki page slug (redundant with `url`) |
| `page_id` | Wikidot internal ID |
| `references` | Outbound links (could power "related SCPs") |
| `history` | Edit history (large; unlikely to seed) |
| `images` | Image references (usually empty in index) |
