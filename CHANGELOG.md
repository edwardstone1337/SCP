# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added

- TanStack React Query: `QueryProvider` in root layout (1min default stale, 5min gc); `useScpContent(series, scpId)` hook for cached SCP content from scp-data.tedivm.com
- Supabase client utilities for App Router (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- Supabase CLI config, migrations, seed setup, link runbook (`docs/supabase-link-runbook.md`)
- `scps` table migration: id, scp_number, scp_id, title, series, rating, url, timestamps; indexes on series, number, rating; auto-updating `updated_at` trigger
- `user_progress` table: user_id, scp_id, is_read, read_at; RLS policies for authenticated users (CRUD own progress); indexes on user_id, scp_id, read status
- Database test page at `/test-data`: total SCP count, series breakdown, sample Series 1 entries
- SCP data ingestion script (`scripts/seed-scps.ts`): fetches from scp-data.tedivm.com, upserts in batches of 500; run with `npm run seed`
- Environment config template (`.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_DB_PASSWORD`, `NEXT_PUBLIC_SITE_URL`
- Magic link auth: `/login` (OTP email), `/auth/callback` (verify OTP), `/auth/logout`, `/auth/error` (error page)
- Middleware: session refresh, redirect authenticated users away from `/login`
- `getSiteUrl()` utility (`lib/utils/site-url.ts`) for auth redirect URLs

### Changed

- Home page: Phase 3 status, auth status (signed in / sign out), database connection status, link to `/test-data`; "Ready for Phase 4: The Tracker"
- README: project title, env setup steps, Supabase migrations/seed/runbook section

### Fixed

- Connection status treats "relation does not exist" / "Could not find the table" as "Connected (no tables yet)" instead of an error
- README phase description now matches current state (Phase 3: Authentication)
