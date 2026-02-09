# Copy Inventory — SCP Reader

Guiding principle: **If a user would have to think "what does this mean?", keep it simple. Theme should enhance, not confuse.**

---

## 1. Navigation

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| SCP Reader | `components/navigation-client.tsx` (logo span) | **Keep** | — |
| Saved | `components/navigation-client.tsx` (drawer link) | **Keep** | — |
| Sign Out | `components/navigation-client.tsx` (top-right button) | **Keep** | — |
| Sign In | `components/navigation-client.tsx` (top-right button) | **Keep** | — |
| Menu / Close | `components/navigation-client.tsx` (menu button label) | **Keep** | — |
| Main navigation | `components/navigation-client.tsx` (aria-label) | **Keep** | — |

---

## 2. Authentication

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| Request Archive Access | `components/ui/sign-in-panel.tsx` (heading) | **Keep** | — |
| Verify your identity to unlock your personal archive terminal. | `components/ui/sign-in-panel.tsx` (subheading) | **Keep** | — |
| Track your reading progress across all series | `components/ui/sign-in-panel.tsx` (value bullet) | **Keep** | — |
| Bookmark SCPs for later review | `components/ui/sign-in-panel.tsx` (value bullet) | **Keep** | — |
| Access your recently viewed files | `components/ui/sign-in-panel.tsx` (value bullet) | **Keep** | — |
| Clearance Email | `components/ui/sign-in-panel.tsx` (label) | **Keep** | — |
| you@example.com | `components/ui/sign-in-panel.tsx` (placeholder) | **Keep** | — |
| Send Access Link | `components/ui/sign-in-panel.tsx` (CTA button) | **Keep** | — |
| No password required. A one-time secure link will be sent to your inbox. | `components/ui/sign-in-panel.tsx` (trust line) | **Keep** | — |
| Access link dispatched. Check your inbox to verify your clearance. | `components/ui/sign-in-panel.tsx` (success message) | **Keep** | — |
| Enter a valid clearance email to continue. | `components/ui/sign-in-panel.tsx` (client validation) | **Keep** | — |
| (error.message from Supabase) | `components/ui/sign-in-panel.tsx` (error from API) | **Keep** (system message) | — |
| Unable to dispatch access link. Please try again. | `components/ui/sign-in-panel.tsx` (catch block) | **Keep** | — |
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
| Track your progress through the SCP Foundation database. | `app/page.tsx` (subtitle under header) | **Keep** | — |
| WARNING / THE FOUNDATION DATABASE IS CLASSIFIED / Access by unauthorized... | (removed) | **Removed** | Was on home splash; removed in home/series consolidation. |
| Series | Breadcrumb + nav (links to `/`) | **Keep** | — |
| Select a series to start reading | (removed) | **Removed** | Was on `/series` PageHeader; `/series` now redirects to `/`, home has no PageHeader. |
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
| Continue | (removed) | **Removed** | Was home splash CTA; removed in home/series consolidation. |
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
| Failed to load content right now. | `app/scp/[id]/scp-reader.tsx` (content fetch error) | **Keep** | — |
| This can happen when the content mirror is temporarily unavailable. | `app/scp/[id]/scp-reader.tsx` (content fetch error help text) | **Keep** | — |
| Retry | `app/scp/[id]/scp-reader.tsx` (recovery button) | **Keep** | — |
| Open Original Article | `app/scp/[id]/scp-reader.tsx` (fallback link) | **Keep** | — |
| Content is not available for this entry. | `app/scp/[id]/scp-reader.tsx` (no content_file) | **Keep** | — |
| (error from toggleReadStatus) e.g. "Not authenticated", Supabase errors | `components/ui/read-toggle-button.tsx` (displayed in alert) | **Keep** (system) | Consider user-friendly override for "Not authenticated": e.g. "Sign in to track progress." (currently modal opens before action for guests, so this may rarely show.) |
| Failed to update read status | `components/ui/read-toggle-button.tsx` (catch fallback) | **Keep** | — |
| (result.error from toggleBookmarkStatus) | `components/ui/bookmark-button.tsx` | **Keep** (system) | Same as read: optional friendly override for "Not authenticated." (modal opens before action for guests). |

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
| Written by {creator} · View original on SCP Wiki (or, when creator missing: View original on SCP Wiki) | `app/scp/[id]/scp-reader.tsx` (header metadata attribution line) | **Keep** | — |
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

## 9. Footer + About Attribution

| Current text | Location | Recommendation | If Change: proposed |
|--------------|----------|----------------|----------------------|
| SCP Reader is an independent fan project - not affiliated with the SCP Foundation. | `components/ui/site-footer.tsx` | **Keep** | — |
| SCP content is licensed under CC BY-SA 3.0 and originates from scpwiki.com and its authors. This project is also released under CC BY-SA 3.0. | `components/ui/site-footer.tsx` | **Keep** | — |
| Data provided by the SCP Data API. | `components/ui/site-footer.tsx` | **Keep** | — |
| About & Attribution | `components/ui/site-footer.tsx` (footer link to `/about`) | **Keep** | — |
| About SCP Reader | `app/about/page.tsx` (page heading) | **Keep** | — |
| What is this? | `app/about/page.tsx` (section heading) | **Keep** | — |
| SCP Reader is an independent fan-built reading companion for the SCP Foundation collaborative fiction archive. It helps readers track their progress across the full catalogue of SCP entries - bookmark articles, mark them as read, and pick up where they left off. | `app/about/page.tsx` | **Keep** | — |
| This project is not affiliated with, endorsed by, or officially connected to the SCP Foundation wiki or its staff. | `app/about/page.tsx` | **Keep** | — |
| Content License | `app/about/page.tsx` (section heading) | **Keep** | — |
| All SCP Foundation content - including article text, titles, and associated concepts - is licensed under Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) and originates from scpwiki.com and its authors. | `app/about/page.tsx` | **Keep** | — |
| SCP Reader, as a derivative work, is also released under CC BY-SA 3.0. You are free to share and adapt this work under the same license terms. | `app/about/page.tsx` | **Keep** | — |
| Data Source | `app/about/page.tsx` (section heading) | **Keep** | — |
| Article data is provided by the SCP Data API (maintained by tedivm), a daily-updated static dataset of the SCP Wiki. The API itself is not affiliated with the SCP Wiki. | `app/about/page.tsx` | **Keep** | — |
| Author Attribution | `app/about/page.tsx` (section heading) | **Keep** | — |
| Individual SCP articles are written by contributors to the SCP Wiki. Where available, the original author is credited on each article page. For full revision history, visit the original entry on scpwiki.com. | `app/about/page.tsx` | **Keep** | — |
| Contact | `app/about/page.tsx` (section heading) | **Keep** | — |
| SCP Reader is built by Edward Stone. For questions, concerns, or attribution requests, reach out via edwardstone.design. | `app/about/page.tsx` | **Keep** | — |

---

## Summary

- **Navigation, auth, page titles, buttons, empty states, errors, metadata:** Almost everything is **Keep**. Copy is already clear and consistent.
- **404 and home:** Themed ("DOCUMENT NOT FOUND", "SECURE CONTAIN PROTECT") but unambiguous.
- **Loading messages:** Themed but clearly loading; **Keep** unless you want to add a fallback like "Loading..." for stricter accessibility.
- **Optional tweaks (only if you want):**
  - "All articles in this range have been read! 🎉" → drop the emoji for a more serious tone.
  - Auth error fallback on Read/Bookmark: show "Sign in to track progress" / "Sign in to save" instead of raw "Not authenticated" when that's the cause (if those errors are ever shown in UI; currently modal gating may prevent it).

No changes are strictly required for clarity; the inventory is ready for a light copy pass or theming refinements.
