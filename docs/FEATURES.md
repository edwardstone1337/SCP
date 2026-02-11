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
- Daily Featured SCP appears on home as a deterministic daily pick.
- Home "Top Rated" section highlights top-ranked SCPs in a responsive 1/3/4-card layout (mobile/tablet/desktop).
- Dedicated `/top-rated` page provides the top 100 highest-rated SCPs.

### Keep reading context in Top 100 flow
- Opening from Top Rated links preserves rank context.
- Reader navigation follows Top 100 rank order in that context.
- Reader shows context banner (`Top Rated · #N of 100`) with return link.

## Personal Tracking Features

### Mark as read / unread
- Users can toggle read status from list rows and the reader.
- Series/range progress updates reflect read status over time.

### Save bookmarks
- Users can bookmark SCPs from list rows and the reader.
- `/saved` page shows bookmarked SCPs with sorting options.

### Recently viewed history
- Home shows recent SCPs viewed by signed-in users.
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

- SCP and series pages include structured metadata for richer search result context.

## Guest vs Signed-In Experience

- Guests can browse and read all public SCP content.
- Personal tracking features (read state, bookmarks, saved list, recently viewed) are available after sign-in.

## Update Rules (For Humans and AI Assistants)

Update this file whenever a PR changes user-visible behavior.

### Update required when:
- A route is added, removed, or meaningfully repurposed.
- A visible UI flow changes (discovery, reading, tracking, accessibility UX).
- A user-facing capability is added, removed, or behavior changes.

### Update not required when:
- Changes are purely internal refactors with no user-visible impact.
- Infrastructure/tooling changes do not alter user behavior.
