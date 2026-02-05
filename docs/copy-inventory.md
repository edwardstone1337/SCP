# Copy Inventory — SCP Reader

Guiding principle: **If a user would have to think "what does this mean?", keep it simple. Theme should enhance, not confuse.**

---

## 1. Navigation

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| SCP Reader | `components/navigation.tsx` (logo span) | **Keep** | — |
| Series | `components/navigation.tsx` (nav link) | **Keep** | — |
| Saved | `components/navigation.tsx` (nav link) | **Keep** | — |
| Sign Out | `components/navigation.tsx` (button) | **Keep** | — |
| Sign In | `components/navigation.tsx` (button) | **Keep** | — |
| Main navigation | `components/navigation.tsx` (aria-label) | **Keep** | — |

---

## 2. Authentication

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| SCP Reader | `app/login/login-form.tsx` (H1) | **Keep** | — |
| Sign in to track your reading progress | `app/login/login-form.tsx` (subheading) | **Keep** | — |
| Sign in with Magic Link | `app/login/login-form.tsx` (H2) | **Keep** | — |
| Email address | `app/login/login-form.tsx` (Label) | **Keep** | — |
| you@example.com | `app/login/login-form.tsx` (placeholder) | **Keep** | — |
| Send Magic Link | `app/login/login-form.tsx` (button) | **Keep** | — |
| No password required. We'll send you a secure link to sign in. | `app/login/login-form.tsx` (footer text) | **Keep** | — |
| ← Back to home | `app/login/login-form.tsx` (button) | **Keep** | — |
| Check your email for the magic link! | `app/login/login-form.tsx` (success message) | **Keep** | — |
| (error.message from Supabase) | `app/login/login-form.tsx` (error from API) | **Keep** (system message) | — |
| An unexpected error occurred. Please try again. | `app/login/login-form.tsx` (catch block) | **Keep** | — |
| (getLoadingMessage('auth')) | `app/login/page.tsx` (Suspense fallback) | **Change** | See **Loading messages** section below. |
| Authentication Error | `app/auth/error/client.tsx` (H2) | **Keep** | — |
| An authentication error occurred | `app/auth/error/client.tsx` (default error text) | **Keep** | — |
| Try Again | `app/auth/error/client.tsx` (button) | **Keep** | — |
| Loading... | `app/auth/error/page.tsx` (Suspense fallback) | **Keep** or use loading-messages | Optional: use `getLoadingMessage('auth')` for consistency. |

---

## 3. Page Titles & Headings

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| SECURE / CONTAIN / PROTECT | `app/page.tsx` (H1 home) | **Keep** (brand/themed) | — |
| WARNING | `app/page.tsx` (H2) | **Keep** (themed) | — |
| THE FOUNDATION DATABASE IS CLASSIFIED | `app/page.tsx` (H3) | **Keep** (themed) | — |
| Access by unauthorized personnel is strictly prohibited... | `app/page.tsx` (body) | **Keep** (themed) | — |
| Series | `app/series/page.tsx` (PageHeader title) | **Keep** | — |
| Select a series to start reading | `app/series/page.tsx` (PageHeader description) | **Keep** | — |
| Series {roman} | `app/series/[seriesId]/page.tsx` (PageHeader title, breadcrumb) | **Keep** | — |
| {formatRange(rangeStart)} e.g. 100-199 | `app/series/[seriesId]/[range]/page.tsx` (PageHeader title) | **Keep** | — |
| Saved Articles | `app/saved/page.tsx` (PageHeader title) | **Keep** | — |
| Saved | `app/saved/page.tsx` (Breadcrumb), nav | **Keep** | — |
| (SCP title from DB) | `app/scp/[id]/scp-reader.tsx` (H1) | **Keep** (content) | — |
| ERROR 404 | `app/not-found.tsx` (Mono) | **Keep** (themed) | — |
| DOCUMENT NOT FOUND | `app/not-found.tsx` (H1) | **Keep** (themed) | — |
| The requested file has been redacted, reclassified, or does not exist... | `app/not-found.tsx` (body) | **Keep** (themed) | — |
| If you believe this is an error, contact your Site Director or return to the main archive. | `app/not-found.tsx` (info box) | **Keep** (themed) | — |
| Return to Archive | `app/not-found.tsx` (button) | **Keep** | — |
| Home | `app/not-found.tsx` (button) | **Keep** | — |
| SCP Reader | `app/layout.tsx` (metadata.title) | **Keep** | — |
| Track your SCP Foundation reading progress | `app/layout.tsx` (metadata.description) | **Keep** | — |

---

## 4. Button Labels

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| Continue | `app/page.tsx` (primary CTA) | **Keep** | — |
| Mark as Read | `components/ui/read-toggle-button.tsx` | **Keep** | — |
| Mark as Unread | `components/ui/read-toggle-button.tsx` | **Keep** | — |
| Save | `components/ui/bookmark-button.tsx` | **Keep** | — |
| Saved | `components/ui/bookmark-button.tsx` | **Keep** | — |
| Add bookmark / Remove bookmark | `components/ui/bookmark-button.tsx` (aria-label) | **Keep** | — |
| Back to top | `components/ui/back-to-top.tsx` (aria-label) | **Keep** | — |
| Top | `components/ui/back-to-top.tsx` (button visible text) | **Keep** | — |
| ← Previous | `app/scp/[id]/scp-reader.tsx` | **Keep** | — |
| Next → | `app/scp/[id]/scp-reader.tsx` | **Keep** | — |
| ← Back | `components/ui/page-header.tsx` (back link) | **Keep** | — |

---

## 5. Empty States

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| No saved articles yet. Browse the Series to find SCPs to save. | `app/saved/page.tsx` | **Keep** | — |
| All articles in this range have been read! 🎉 | `components/ui/scp-list-with-toggle.tsx` | **Keep** | (Optional: remove emoji if you want a more serious tone; otherwise Keep.) |

---

## 6. Error Messages

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| Failed to load content. Please try again. | `app/scp/[id]/scp-reader.tsx` (content fetch error) | **Keep** | — |
| Content is not available for this entry. | `app/scp/[id]/scp-reader.tsx` (no content_file) | **Keep** | — |
| (error from toggleReadStatus) e.g. "Not authenticated", Supabase errors | `components/ui/read-toggle-button.tsx` (displayed in alert) | **Keep** (system) | Consider user-friendly override for "Not authenticated": e.g. "Sign in to track progress." (currently user is redirected to login, so this may rarely show.) |
| Failed to update read status | `components/ui/read-toggle-button.tsx` (catch fallback) | **Keep** | — |
| (result.error from toggleBookmarkStatus) | `components/ui/bookmark-button.tsx` | **Keep** (system) | Same as read: optional friendly override for "Not authenticated." |

---

## 7. Metadata / Labels

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| Access Granted | `components/ui/page-header.tsx` (badge prop); only used in `app/components-test/page.tsx` as example | **N/A** (not in prod) | If ever used in prod: **Keep** (themed). |
| Sort by | `components/ui/scp-list-with-toggle.tsx`, `app/saved/saved-list.tsx` (Label) | **Keep** | — |
| Sort articles | `components/ui/scp-list-with-toggle.tsx` (Select aria-label) | **Keep** | — |
| Sort saved articles | `app/saved/saved-list.tsx` (Select aria-label) | **Keep** | — |
| Hide read ({readCount}) | `components/ui/scp-list-with-toggle.tsx` | **Keep** | — |
| Oldest First / Newest First / Top Rated / Lowest Rated | `components/ui/scp-list-with-toggle.tsx`, `app/saved/saved-list.tsx` (sort options) | **Keep** | — |
| Recently Saved / Oldest Saved | `app/saved/saved-list.tsx` (sort options) | **Keep** | — |
| ★ {rating} | `app/scp/[id]/scp-reader.tsx` (rating display) | **Keep** | — |
| {percentage}% (e.g. 42%) | `components/ui/range-list-item.tsx`, `components/ui/progress-text.tsx` | **Keep** (numeric) | — |
| ProgressText: "X%", "X / Y", or "X% (X / Y)" | `components/ui/progress-text.tsx` | **Keep** (no "read" label in component; context is Series/Range) | — |
| Skip to main content | `components/ui/skip-link.tsx` | **Keep** | — |
| Loading content | `app/scp/[id]/scp-reader.tsx` (aria-label on loading block) | **Keep** | — |
| Loading | `components/ui/spinner.tsx` (aria-label) | **Keep** | — |
| Breadcrumb | `components/ui/breadcrumb.tsx` (aria-label) | **Keep** | — |

---

## 8. Loading Messages (themed, random)

All in `lib/utils/loading-messages.ts`. Principle: themed but still understandable (user knows something is loading).

| Context | Current messages | Recommendation | If Change: proposed |
|---------|------------------|----------------|----------------------|
| default | Retrieving document...; Decrypting file...; Accessing archive...; Loading classified data...; Authenticating clearance... | **Keep** | — |
| reader | Retrieving SCP document...; Decrypting containment file...; Loading classified entry...; Accessing Foundation archive... | **Keep** | — |
| series | Loading series index...; Accessing classification records...; Retrieving containment database... | **Keep** | — |
| saved | Loading saved documents...; Retrieving bookmarked files...; Accessing personal archive... | **Keep** | — |
| auth | Verifying credentials...; Authenticating clearance level...; Processing access request... | **Keep** | — |

**Recommendation:** **Keep** all. They are clearly loading states with a light SCP theme. If you ever get feedback that users are confused, add one plain option per context (e.g. "Loading...") or simplify the set.

---

## Summary

- **Navigation, auth, page titles, buttons, empty states, errors, metadata:** Almost everything is **Keep**. Copy is already clear and consistent.
- **404 and home:** Themed ("DOCUMENT NOT FOUND", "SECURE CONTAIN PROTECT") but unambiguous.
- **Loading messages:** Themed but clearly loading; **Keep** unless you want to add a fallback like "Loading..." for stricter accessibility.
- **Optional tweaks (only if you want):**
  - "All articles in this range have been read! 🎉" → drop the emoji for a more serious tone.
  - Auth error fallback on Read/Bookmark: show "Sign in to track progress" / "Sign in to save" instead of raw "Not authenticated" when that's the cause (if those errors are ever shown in UI; currently redirect may prevent it).

No changes are strictly required for clarity; the inventory is ready for a light copy pass or theming refinements.
