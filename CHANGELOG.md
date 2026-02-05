# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added

- SCP article page: Previous/Next navigation (same series); nav in header and below content
- `ScpListWithToggle` component: range list with "Hide read" checkbox (authenticated only, when any read); empty state when all filtered
- Series range page uses `ScpListWithToggle` for list + hide-read filter

- TanStack React Query: `QueryProvider` in root layout (1min default stale, 5min gc); `useScpContent(contentFile, scpId)` hook for cached SCP content from scp-data.tedivm.com (uses per-SCP `content_file` from DB)
- Supabase client utilities for App Router (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- Supabase CLI config, migrations, seed setup, link runbook (`docs/supabase-link-runbook.md`)
- `scps` table migration: id, scp_number, scp_id, title, series, rating, url, content_file, timestamps; indexes on series, number, rating, content_file; auto-updating `updated_at` trigger
- `user_progress` table: user_id, scp_id, is_read, read_at; RLS policies for authenticated users (CRUD own progress); indexes on user_id, scp_id, read status
- Database test page at `/test-data`: total SCP count, series breakdown, sample Series 1 entries
- SCP data ingestion script (`scripts/seed-scps.ts`): fetches from scp-data.tedivm.com, upserts in batches of 500 (includes `content_file` from API index); run with `npm run seed`
- Environment config template (`.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_DB_PASSWORD`, `NEXT_PUBLIC_SITE_URL`
- Magic link auth: `/login` (OTP email), `/auth/callback` (verify OTP), `/auth/logout`, `/auth/error` (error page)
- Middleware: session refresh, redirect authenticated users away from `/login`
- `getSiteUrl()` utility (`lib/utils/site-url.ts`) for auth redirect URLs

### Changed

- SCP reader: Read toggle also shown below article; Prev/Next repeated below content
- Home page: Phase 3 status, auth status (signed in / sign out), database connection status, link to `/test-data`; "Ready for Phase 4: The Tracker"
- README: project title, env setup steps, Supabase migrations/seed/runbook section

### Removed

- Docs: `discovery-page-markup-patterns.md`, `discovery-scp-content-loading.md`, `discovery-theme-vs-root-tokens.md`

### Fixed

- Series 6+ SCPs (e.g. SCP-9600) now load content: reader uses per-SCP `content_file` from DB instead of series-derived filename (`content_series-N.json`); `content_file` migration and seed script populate from API index
- Connection status treats "relation does not exist" / "Could not find the table" as "Connected (no tables yet)" instead of an error
- README phase description now matches current state (Phase 3: Authentication)
