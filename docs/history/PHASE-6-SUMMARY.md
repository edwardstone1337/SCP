# Phase 6: Polish & Features — Summary

## Overview

Phase 6 focused on sorting, bookmarks, UX polish, and security hardening. The app was renamed from "SCP Continuum Tracker" to "SCP Reader," and several design-system components were added to support list sorting, bookmarking, and a better reading experience.

## Completed Features

### Security Hardening

- **RLS on `scps` table:** Row Level Security enabled via migration `20260205120000_secure_scps_table.sql`. Policy "Anyone can read scps" allows `SELECT` for all; no insert/update/delete policies (anon users cannot write). Service role bypasses RLS for server-side operations.
- **Seed script uses service role key:** `scripts/seed-scps.ts` requires `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) so seeding can insert/update `scps` while RLS blocks anon writes. `.env.example` documents the service role key for server-side use only.

### Sorting

- **Select component:** Styled native `<select>` in `components/ui/select.tsx` matching design tokens (surface, border, radius, typography). Accepts `options`, `value`, `onChange(value)`, and merges caller `style`/`className`.
- **Sort options on SCP lists:** In `ScpListWithToggle` (series range pages): **Oldest First**, **Newest First**, **Top Rated**, **Lowest Rated**. Client-side sort; dropdown always visible.
- **Sort on Saved page:** In `SavedList` (`app/saved/saved-list.tsx`): **Recently Saved**, **Oldest Saved**, plus number (asc/desc) and rating (asc/desc). Same Select component with a dedicated `sortOptions` list.

### Bookmarks

- **Table:** `user_bookmarks` (user_id, scp_id FK to scps.id, bookmarked_at); RLS for select/insert/delete own rows; indexes on scp_id and (user_id, bookmarked_at DESC).
- **BookmarkButton:** Save/Saved toggle with optimistic update; redirects to login if unauthenticated. Used in SCP reader (header + below content) and in `ScpListItem`. Uses `stopPropagation` so card click and button click don’t conflict.
- **Pages:** Reader shows bookmark state; `/saved` lists bookmarked SCPs with sort and Save/Read toggles; list items on range and saved pages show BookmarkButton.
- **Nav:** "Saved" link shown when authenticated.
- **Server action:** `toggleBookmarkStatus(scpId, isCurrentlyBookmarked, routeId)`; revalidates `/scp/[routeId]` and `/saved` using **route ID** (e.g. `SCP-173`) not UUID, so cache invalidation targets the correct page.

### UX Polish

- **Back-to-top:** `BackToTop` component in `components/ui/back-to-top.tsx`. Renders a fixed bottom-right button; shows after scroll &gt; 400px, hides when within 200px of bottom. Uses `arrow-up` icon; smooth scroll to top. Used on SCP reader.
- **Loading messages:** `lib/utils/loading-messages.ts` — context-based random messages: default, reader, series, saved, auth. `getLoadingMessage(context)` used in loading.tsx and login/reader.
- **404 page:** `app/not-found.tsx` — SCP-themed "DOCUMENT NOT FOUND", redacted/reclassified copy, "Return to Archive" and "Home" buttons.
- **Copy pass:** Auth prompts use "Sign in to track progress" / "Sign in to save articles"; "All articles read" message no longer uses emoji; overall tone aligned with SCP Reader branding.

### Bug Fixes

- **Card clickability:** `ScpListItem` card is fully clickable (wraps content in a link or clickable area), not just the title, so the whole row navigates to the SCP.
- **Bookmark revalidation path:** Revalidation uses route ID (e.g. `SCP-173`) for `revalidatePath(\`/scp/${routeId}\`, 'page')` instead of UUID, fixing incorrect cache invalidation.
- **Duplicate SCP number display:** Removed duplicate SCP number display from list items so the identifier appears once.

## Files Created

- `components/ui/select.tsx` — Select component
- `components/ui/back-to-top.tsx` — BackToTop component
- `lib/utils/loading-messages.ts` — Context-based loading messages
- `app/not-found.tsx` — Custom 404 (if not already present in earlier phase)
- `supabase/migrations/20260205120000_secure_scps_table.sql` — RLS on scps

(Other Phase 6 work may have been in existing files; bookmarks table and Saved page may have been created in an earlier phase and extended in Phase 6.)

## Files Modified

- `components/ui/scp-list-with-toggle.tsx` — Added Select, sort options (Oldest/Newest First, Top/Lowest Rated), sort state and logic
- `app/saved/saved-list.tsx` — Sort options (Recently/Oldest Saved + number/rating), Select usage
- `app/scp/[id]/scp-reader.tsx` — BackToTop, BookmarkButton placement
- `app/scp/[id]/actions.ts` — `toggleBookmarkStatus` signature with `routeId` for revalidation
- `components/ui/button.tsx` — Merge caller styles instead of replacing
- `components/ui/bookmark-button.tsx` — stopPropagation for nested interactivity
- `components/ui/scp-list-item.tsx` — Full card clickable, BookmarkButton, ReadToggleButton with stopPropagation
- `components/ui/icon.tsx` — Added `bookmark`, `bookmark-filled`, `arrow-up`
- `app/not-found.tsx` — SCP-themed 404 copy and layout
- Loading pages (e.g. `app/saved/loading.tsx`, reader/login loading) — `getLoadingMessage(context)`
- `.env.example` — `SUPABASE_SERVICE_ROLE_KEY` and seed documentation
- `scripts/seed-scps.ts` — Use `SUPABASE_SERVICE_ROLE_KEY` for seeding
- App title / metadata — Renamed to "SCP Reader"

## Database Changes

- **Applied migrations:**
  - `20260205120000_secure_scps_table.sql` — Enable RLS on `scps`; policy "Anyone can read scps" (SELECT only); no write policies for anon (service role used for seed).

(Bookmarks table `user_bookmarks` and related RLS/indexes were added in an earlier migration; Phase 6 did not add new bookmark tables.)

## Design System Additions

- **Select** — Styled native select; design tokens; optional label; used for sort dropdowns.
- **BookmarkButton** — Save/Saved state, optimistic update, auth redirect, used in reader and list items.
- **BackToTop** — Configurable threshold and bottom offset; fixed position; arrow-up icon.
- **Icons:** `bookmark`, `bookmark-filled`, `arrow-up` (in `components/ui/icon.tsx`).

## Backlog for Future Phases

| Priority | Feature | Effort | Notes |
|----------|---------|--------|-------|
| 1 | Progress celebration | Medium | Range/series complete |
| 2 | Reading settings | Medium–High | Font, size, line-height (Kindle-style) |
| 3 | Random SCP / Daily Featured | Low | Discovery, time-to-value |
| 4 | Recently Viewed | Low | Continuity |
| 5 | Search | Medium | By SCP number |
| 6 | Tags/Filters | Medium | Classification filters |
| 7 | SSO (Google Auth) | Low–Medium | Alternative to magic link |

## Technical Decisions

- **Revalidation by route ID:** Bookmark (and read) actions revalidate using the public route ID (e.g. `SCP-173`) so Next.js invalidates the correct `/scp/[id]` page; DB operations still use UUID where needed.
- **Client-side sorting:** List and Saved sorting are done in the client (sort options + Select) to avoid extra server round-trips and keep range/saved pages simple.
- **RLS on scps:** Read-only for anon; writes only via service role (e.g. seed). Keeps public data safe and prevents client-side write abuse.
- **Button style merge:** Button component merges caller `style`/`className` with internal styles so overrides (e.g. width on Select wrappers) work without fighting the component.
- **stopPropagation on nested buttons:** BookmarkButton and ReadToggleButton use `stopPropagation` so clicks don’t bubble to the parent card link.

## Lessons Learned

- Using route ID for `revalidatePath` is critical when the page segment is the human-readable ID (`/scp/SCP-173`), not the DB UUID; mixing them caused bookmark updates not to reflect on the reader.
- A single Select component with design-token styling is enough for sort dropdowns on both range lists and Saved, with different option arrays.
- Themed loading messages and a custom 404 improve perceived quality with minimal code; the 404 doubles as branding.
- Documenting the service role key in `.env.example` and in the seed script reduces mistakes when enabling RLS and running seeds.
