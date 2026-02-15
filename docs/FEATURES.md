# Customer-Facing Features

This document tracks features users can see and use in SCP Reader.
It intentionally focuses on user value, not internal implementation details.

## Core Experience

### Browse SCP catalog by series
- Home page shows all 10 SCP series (I-X) with per-series progress.
- Each series opens range pages (001-099, 100-199, etc).
- Each range page lists SCPs with quick actions.

### Read SCP articles in-app
- SCP reader opens full article content inside the app.
- Reader includes Previous/Next navigation between SCPs.
- If content load fails, reader provides retry and original-article fallback.

### Discover what to read next
- Home "Daily Briefing" appears as a deterministic daily SCP pick.
- Home "Notable Anomalies" highlights top-ranked SCPs in a responsive 1/3/4-card layout (mobile/tablet/desktop).
- Dedicated `/top-rated` page provides the top 100 highest-rated SCPs.
- Guest users get a "New to the Foundation?" onboarding block with quick-start paths (classics, highest rated, random file).

### Personalized home briefing
- Home hero subhead adapts by auth state (returning-user message vs guest discovery prompt).
- Series progress labels adapt by auth state (`accessed` for signed-in users, `catalogued` for guests).
- Home sections use dossier-style dividers and themed terminology for a consistent archive UX.

### Sign in with preferred method
- Users can sign in with either Google (`Continue with Google`) or email magic link.
- Same sign-in options appear in both the modal and the `/login` page.
- App preserves redirect context so users return to their original page after auth.

### Manage account lifecycle
- Signed-in users can sign out and delete their account from the navigation menu.
- Account deletion requires explicit confirmation in a modal before execution.
- After deletion, users are returned to home with a success confirmation toast.

### Upgrade to Premium (Clearance Level 5)
- Signed-in users can upgrade via "Upgrade to Premium" in the nav menu.
- Stripe checkout flow; one-time payment for lifetime premium.
- Success and cancel redirects to dedicated confirmation pages.

### Configure reading preferences
- Settings page (`/settings`) for reading preferences (protected).
- Image Safe Mode: hide article images by default; tap to reveal individually (Premium feature).

### Access legal information
- Footer now includes direct links to `/privacy` and `/terms`.
- Privacy policy and terms are available as dedicated, public pages.

### Keep reading context in Top 100 flow
- Opening from Top Rated links preserves rank context.
- Reader navigation follows Top 100 rank order in that context.
- Reader shows context banner (`Top Rated · #N of 100`) with return link.

## Premium Features

### Image Safe Mode
- Hides images in SCP articles by default when enabled.
- Click "Click to reveal image" placeholder to show individual images.
- Toggle in Settings (Reading Preferences); requires Premium.

## Personal Tracking Features

### Mark as read / unread
- Users can toggle read status from list rows and the reader.
- Series/range progress updates reflect read status over time.

### Save bookmarks
- Users can bookmark SCPs from list rows and the reader.
- `/saved` page shows bookmarked SCPs with sorting options.

### Recently viewed history
- Signed-in users see a "Recent Files" list on home.
- List is capped to the latest 5 viewed items.

## Reading & List Controls

### Sorting and filtering
- Range lists support sort options (number and rating directions).
- Signed-in users can hide already-read entries where applicable.
- Top 100 keeps rank-first experience (default rating-desc; sort control hidden).

## Accessibility Features

### Keyboard and screen reader support
- Skip link allows fast jump to main content.
- Navigation overlay supports Escape to close, close button, and keyboard focus trapping.
- Reader loading and toggle actions announce state changes for assistive tech.
- Reader article content is exposed with semantic structure for navigation.

## Search & Discoverability

- Home, SCP, and series pages include structured metadata for richer search result context.

## Guest vs Signed-In Experience

- Guests can browse and read all public SCP content.
- Personal tracking features (read state, bookmarks, saved list, recent files) are available after sign-in.
- Primary logged-out navigation CTA is labeled "Access Terminal" to open sign-in flow.

## Premium vs Free Experience

- Free users can access all core reading and tracking features.
- Premium (Clearance Level 5) unlocks Image Safe Mode and future premium features (reading settings, achievements).
- Nav menu shows "Upgrade to Premium" for signed-in free users; premium users see a "Premium" badge next to their email.

## Incident Response (Ops)

- **Maintenance mode:** When enabled (`NEXT_PUBLIC_MAINTENANCE_MODE`), users see a full-page SCP-themed "Foundation Archive Compromised" lockdown. API routes remain reachable (e.g. Stripe webhooks).
- **Degraded mode:** When enabled (`NEXT_PUBLIC_DEGRADED_MODE`), a warning banner ("Partial Containment Failure") appears at the top; the site remains fully usable.

## Update Rules (For Humans and AI Assistants)

Update this file whenever a PR changes user-visible behavior.

### Update required when:
- A route is added, removed, or meaningfully repurposed.
- A visible UI flow changes (discovery, reading, tracking, accessibility UX).
- A user-facing capability is added, removed, or behavior changes.

### Update not required when:
- Changes are purely internal refactors with no user-visible impact.
- Infrastructure/tooling changes do not alter user behavior.
