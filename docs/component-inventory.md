# SCP Reader — Component Inventory

Component library inventory derived from existing pages (Home, Range List, SCP List), design tokens in `app/globals.css`, and shared UI patterns. Use this to build components systematically.

**Design tokens (reference):** Red scale (`--color-red-1`–`10`), Grey scale (`--color-grey-1`–`10`), semantic `--color-background`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`, `--color-accent-hover`. Typography: Roboto / Roboto Mono, sizes `xs`–`5xl`.

---

## Base / Atomic

### Button

**Variants:** primary (accent), secondary (outline), ghost, danger (sign out), success (read state).

**Props:**

- `variant` (string, optional) — `'primary' | 'secondary' | 'ghost' | 'danger' | 'success'`. Default: `'primary'`.
- `size` (string, optional) — `'sm' | 'md' | 'lg'`. Default: `'md'`.
- `disabled` (boolean, optional) — disables button.
- `fullWidth` (boolean, optional) — full width (e.g. Login “Send Magic Link”).
- `type` (string, optional) — `'button' | 'submit' | 'reset'`. Default: `'button'`.
- `children` (ReactNode, required) — label/content.
- `onClick` (function, optional) — click handler.
- `className` (string, optional) — extra classes.

**Used in:** Login (Send Magic Link, Back to home), Navigation (Sign In, Sign Out), SCP Reader (Back, Mark as Read), 404 (Return to Archive, Home).

**Example usage:**

```tsx
<Button variant="primary" fullWidth href="/">Return to Archive</Button>
<Button variant="secondary" onClick={handleToggleRead}>Mark as Read</Button>
<Button variant="danger" type="submit">Sign Out</Button>
```

**States:** primary, secondary, ghost, danger, success; disabled. See components-test page for visual examples.

**Dependencies:** None.

---

### Link

**Variants:** default (text), back (with arrow), nav (header).

**Props:**

- `href` (string, required) — URL.
- `variant` (string, optional) — `'default' | 'back' | 'nav'`. Default: `'default'`.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Home (series grid cards), Range List (Back, range links), SCP List (Back, SCP links), Navigation, Login (Back to home), breadcrumbs.

**Example usage:**

```tsx
<Link href="/" variant="back">← Back</Link>
<AppLink href="/" variant="nav">Series</AppLink>
```

**Dependencies:** Next.js `Link` (or wrapper around it).

---

### Badge

**Variants:** default, accent (e.g. “Access Granted”), progress (percentage).

**Props:**

- `variant` (string, optional) — `'default' | 'accent' | 'progress'`.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Range List header (“Access Granted”), Series/Range/SCP progress (percentage, read state).

**Example usage:**

```tsx
<Badge variant="accent">Access Granted</Badge>
<Badge variant="progress">{percentage}%</Badge>
```

**States:** default, accent (e.g. “Access Granted”), progress (percentage).

**Dependencies:** None.

---

### Icon

**Variants:** check (read), eye (unread), star (rating), arrow-back.

**Props:**

- `name` (string, required) — `'check' | 'eye' | 'star' | 'arrow-back'` (extend as needed).
- `size` (string, optional) — `'sm' | 'md' | 'lg'`. Default: `'md'`.
- `className` (string, optional) — e.g. for color.

**Used in:** SCP List (✓ / 👁️), SCP Reader (rating ★), Back links.

**Example usage:**

```tsx
<Icon name="check" size="sm" className="text-accent" />
<Icon name="star" /> {rating}
```

**Dependencies:** None (inline SVG or icon set).

---

### Typography

**Components:** `Heading`, `Text`, `Mono`, `Label`.

**Heading props:**

- `level` (number, required) — 1–4.
- `as` (string, optional) — override element (`h1`–`h4`).
- `accent` (boolean, optional) — use accent color (e.g. “WARNING”).
- `children` (ReactNode, required).
- `className` (string, optional).

**Text props:**

- `variant` (string, optional) — `'primary' | 'secondary' | 'muted'`.
- `size` (string, optional) — `'xs' | 'sm' | 'base' | 'lg'`.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** All pages (titles, descriptions, labels).

**Example usage:**

```tsx
<Heading level={1} accent>WARNING</Heading>
<Heading level={2}>SECURE CONTAIN PROTECT</Heading>
<Text variant="secondary">Select a series to start reading</Text>
<Mono>{scp_id}</Mono>
```

**Dependencies:** None.

---

## Composite / Molecular

### SeriesCard

**Variants:** default (with progress), no progress.

**Props:**

- `series` (string, required) — e.g. `series-1`.
- `roman` (string, required) — Roman numeral.
- `total` (number, required) — total SCPs.
- `read` (number, required) — read count.
- `href` (string, required) — link target.

**Used in:** Series Grid.

**Example usage:**

```tsx
<SeriesCard series="series-1" roman="I" total={100} read={25} href="/series/series-1" />
```

**States:** *0% read* — no progress, grey border; *partial progress* (e.g. 25%) — accent border + partial ring; *100% read* — accent border + full ring. Note: accent border = “has progress”, not “read” per se.

**Dependencies:** Link, Badge (or inline progress), Typography.

---

### RangeListItem

**Variants:** default (with progress ring and percentage).

**Props:**

- `rangeStart` (number, required).
- `rangeLabel` (string, required) — e.g. “001–099”.
- `total` (number, required).
- `read` (number, required).
- `href` (string, required).

**Used in:** Range List.

**Example usage:**

```tsx
<RangeListItem rangeStart={0} rangeLabel="001–099" total={99} read={10} href="/series/series-1/0" />
```

**States:** *0% read* — grey border, empty ring; *partial* — accent border, partial ring; *100%* — accent border, full ring.

**Dependencies:** Link, ProgressRing, Badge / Text.

---

### ScpListItem

**Variants:** default (title, rating, id, read/unread indicator).

**Props:**

- `scpId` (string, required) — slug for URL.
- `title` (string, required).
- `rating` (number, required).
- `scpIdDisplay` (string, required) — e.g. “SCP-001”.
- `isRead` (boolean, required).
- `href` (string, required).

**Used in:** SCP List.

**Example usage:**

```tsx
<ScpListItem scpId="scp-001" title="..." rating={4} scpIdDisplay="SCP-001" isRead={false} href="/scp/scp-001" />
```

**States:** *Unread* — eye icon, grey border; *Read* — check icon, no accent border (read is indicated by icon only).

**Dependencies:** Link, Icon (check/eye), Typography.

---

### BookmarkButton

**Variants:** default (Save / Saved states; icon toggles).

**Props:**

- `scpId` (string, required) — database UUID for bookmark operations.
- `scpRouteId` (string, required) — text id for route/revalidation (e.g. `SCP-173`).
- `isBookmarked` (boolean, required).
- `userId` (string | null, required) — when null, click redirects to login with return URL.
- `size` (string, optional) — `'sm' | 'md'`. Default: `'md'`.
- `onToggle` (function, optional) — callback after successful toggle.

**Used in:** SCP Reader (header + below content), ScpListItem.

**Behavior:** Optimistic update; on error reverts and logs. Full-page redirect to `/login?redirect=...` when unauthenticated. Uses `stopPropagation` when nested in clickable cards.

**Dependencies:** Button, Icon (bookmark/bookmark-filled), `toggleBookmarkStatus` server action.

---

### ReadToggleButton

**Variants:** default (Mark as Read / Unread).

**Props:**

- `scpId` (string, required) — database UUID.
- `isRead` (boolean, required).
- `userId` (string | null, required) — when null, click redirects to login.
- `routeId` (string, optional) — text id (e.g. `SCP-173`) for revalidating current SCP page so reader badge updates.
- `size` (string, optional) — `'sm' | 'md'`. Default: `'sm'`.
- `onToggle` (function, optional).

**Used in:** SCP Reader (header + below content), ScpListItem.

**Behavior:** Optimistic toggle; Server Action `toggleReadStatus(scpUuid, currentStatus, routeId?)`; revalidates `/` and when `routeId` provided the reader page. Redirects to login when unauthenticated. `stopPropagation` when nested.

**Dependencies:** Button, Text, `toggleReadStatus` server action.

---

### ScpListWithToggle

**Variants:** default (sort dropdown + optional "Hide read" filter + list).

**Props:**

- `scps` (array, required) — items with `id`, `scp_id`, `scp_number`, `title`, `rating`, `is_read`, `is_bookmarked`.
- `isAuthenticated` (boolean, required) — when false, "Hide read" is hidden (guests see all as unread).
- `userId` (string | null, optional) — for ReadToggleButton auth.

**Used in:** Range list (`/series/[seriesId]/[range]`).

**Behavior:** Sort options: Oldest First, Newest First, Top Rated, Lowest Rated. "Hide read" checkbox with proper `htmlFor`/`id` for accessibility. Renders list of ScpListItem.

**Dependencies:** Stack, ScpListItem, Select, Label (Sort by, Hide read).

---

### ProgressRing

**Variants:** default (circle with percentage).

**Props:**

- `percentage` (number, required) — 0–100.
- `size` (string, optional) — `'sm' | 'md' | 'lg'`. Default: `'md'`.
- `showLabel` (boolean, optional) — show % inside. Default: true.

**Used in:** Range List (large ring), optionally Series/SCP.

**Example usage:**

```tsx
<ProgressRing percentage={33} size="lg" />
```

**States:** 0%, partial (e.g. 33%, 50%), 100%; sizes xs, sm, md, lg. See components-test page for visual examples.

**Dependencies:** None (or Badge for label).

---

### ProgressText

**Variants:** default (e.g. “25%” or “10 / 99”).

**Props:**

- `percentage` (number, optional).
- `read` (number, optional).
- `total` (number, optional).
- `variant` (string, optional) — `'percentage' | 'count' | 'both'`.

**Used in:** Series Grid, Range List, SCP List.

**Example usage:**

```tsx
<ProgressText percentage={25} />
<ProgressText read={10} total={99} variant="count" />
```

**States:** 0%, partial, 100%; variants percentage, fraction, both.

**Dependencies:** Typography.

---

### Card (generic)

**Variants:** default, interactive (hover scale), bordered.

**Props:**

- `as` (string, optional) — `'div' | 'a'`. Default: `'div'`.
- `href` (string, optional) — if `as='a'`.
- `variant` (string, optional) — `'default' | 'interactive' | 'bordered'`.
- `accentBorder` (boolean, optional) — use for progress or emphasis (e.g. series/range has progress). Do not use for read status on list items; read is indicated by icon only on ScpListItem.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Series Grid, Range List, SCP List (shared card style).

**Example usage:**

```tsx
<Card as="a" href="/series/series-1" variant="interactive" accentBorder={percentage > 0}>
  ...
</Card>
```

**States:** default (static, grey border), interactive (hover scale, link), bordered (explicit border), accent border (progress/emphasis only — not used for read on list items).

**Dependencies:** None.

---

### PageHeader

**Variants:** with back link, with badge, simple (title + description).

**Props:**

- `title` (string, required).
- `description` (string, optional).
- `backHref` (string, optional) — shows “← Back” link.
- `badge` (string, optional) — e.g. “Access Granted”.
- `badgeVariant` (string, optional) — `'default' | 'accent'`.

**Used in:** Range, SCP List, SCP Reader (home has themed header, no PageHeader).

**Example usage:**

```tsx
<PageHeader title="Series I" description="Range list" backHref="/" />
<PageHeader title="Series I" backHref="/" badge="Access Granted" badgeVariant="accent" />
<PageHeader title="001–099" backHref="/series/series-1" />
```

**Dependencies:** Link (back), Typography, Badge.

---

### Logo

**Variants:** default (small), large.

**Props:**

- `size` (string, optional) — `'sm' | 'md' | 'lg'`. Default: `'sm'`.
- `className` (string, optional).

**Used in:** Home.

**Example usage:**

```tsx
<Logo size="sm" />
```

**Dependencies:** Next.js `Image` (or img), asset `/scp-logo.png`.

---

### BackToTop

**Variants:** default (fixed button, appears after scroll threshold).

**Props:**

- `threshold` (number, optional) — scroll Y in pixels before button appears. Default: `400`.
- `bottomOffset` (number, optional) — hide when within this many pixels of page bottom. Default: `200`.

**Used in:** SCP Reader (below content).

**Behavior:** Fixed position (bottom-right), smooth scroll to top on click. Uses `--z-sticky`, `--shadow-elevated`. Renders nothing until scroll past threshold and not near bottom.

**Dependencies:** Button, Icon (arrow-up).

---

### DailyFeaturedSection

**Variants:** default (hero-style card for "Today's Featured SCP").

**Props:**

- `scp` (object | null, required) — `{ scp_id, title, rating, series }` or null. Renders nothing when null.

**Used in:** Home (above series grid).

**Behavior:** Section label "Today's Featured SCP"; Link wraps Card (interactive, padding lg) with Mono (scp_id), Heading (title), rating and series (Roman). Deterministic daily selection is done by parent via `getDailyIndex`.

**Dependencies:** Stack, Card, Link, Heading, Mono, Text.

---

### RecentlyViewedSection

**Variants:** default; zero states for guest and empty list.

**Props:**

- `items` (array, required) — `{ scp_id, title, viewed_at }[]` (last 5 from parent).
- `isAuthenticated` (boolean, required).

**Used in:** Home (below series grid).

**Behavior:** Guest: "Recently Viewed" heading + "Sign in to track your reading history." + Sign In button. Authenticated empty: "Articles you read will appear here." Authenticated with items: list of links (Card, interactive) to each SCP.

**Dependencies:** Stack, Card, Link, Text, Mono, Button.

---

### SavedList

**Location:** `app/saved/saved-list.tsx` (page-level, not in components/ui).

**Variants:** default (sort dropdown + list of bookmarked SCPs).

**Props:**

- `items` (array, required) — `SavedScpItem[]` (`id`, `scp_id`, `scp_number`, `title`, `rating`, `is_read`, `bookmarked_at`).
- `userId` (string, required).

**Used in:** Saved page (`/saved`).

**Behavior:** Sort options: Recently Saved, Oldest Saved, Oldest/Newest First, Top/Lowest Rated. Renders ScpListItem for each. Client-side sort only.

**Dependencies:** Stack, ScpListItem, Select, Label.

---

## Layout

### Main

**Variants:** default (dark background, padding), centered (Home), constrained (max-width).

**Props:**

- `variant` (string, optional) — `'default' | 'centered' | 'constrained'`.
- `maxWidth` (string, optional) — `'sm' | 'md' | 'lg' | 'xl' | 'full'`. Default: `'xl'` for constrained.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** All pages.

**Example usage:**

```tsx
<Main variant="centered" maxWidth="md">
  ...
</Main>
```

**Dependencies:** None.

---

### Container

**Variants:** default (max-width from token + horizontal padding via page).

**Props:**

- `size` (string, optional) — `'xs' | 'sm' | 'md' | 'lg' | 'xl'`. Default: `'lg'`. Maps to `--container-*` tokens.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Home, Range/SCP List, SCP Reader, Saved.

**Example usage:**

```tsx
<Container size="lg">...</Container>
```

**Dependencies:** None.

---

### Stack

**Variants:** vertical (default), horizontal; gap size.

**Props:**

- `direction` (string, optional) — `'vertical' | 'horizontal'`. Default: `'vertical'`.
- `gap` (string, optional) — `'none' | 'tight' | 'normal' | 'loose' | 'section'`. Default: `'normal'`.
- `align` (string, optional) — `'start' | 'center' | 'end' | 'stretch' | 'baseline'`.
- `justify` (string, optional) — `'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'`.
- `children` (ReactNode, required).
- `className` (string, optional).
- `style` (CSSProperties, optional).

**Used in:** All pages (sections, lists).

**Example usage:**

```tsx
<Stack direction="horizontal" gap="normal" align="center" justify="between">
  <PageHeader ... />
  ...
</Stack>
```

**Dependencies:** None.

---

### Grid

**Variants:** auto (2→3→4 responsive) or fixed column count.

**Props:**

- `cols` (number | `'auto'`, optional) — `'auto'` gives 2 cols → 3 (md) → 4 (lg); or a fixed number (e.g. `2`).
- `gap` (string, optional) — CSS gap value. Default: `'var(--spacing-card-gap)'`.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Home (series grid), layout.

**Example usage:**

```tsx
<Grid cols="auto">
  {seriesProgress.map(...) => <SeriesCard ... />)}
</Grid>
```

**Dependencies:** None.

---

### Navigation

**Architecture:** Navigation lives in the root layout (`app/layout.tsx`) and appears on all pages. Split into a server wrapper and a client component:

- **Server:** `components/navigation.tsx` — fetches user via `createClient().auth.getUser()`, renders `NavigationClient` with `user`.
- **Client:** `components/navigation-client.tsx` — logo, "SCP Reader" link, top-right auth action + Menu button, responsive overlay.

**Behavior:**

- Top-right controls appear on all viewports: `Sign In` (primary) when logged out, `Sign Out` (secondary) when logged in, and `Menu` (secondary) always.
- Desktop uses a right-side drawer with backdrop and shadow depth; mobile uses full-screen overlay.
- Menu contents: Series I–X links in a two-column grid (tighter spacing), Saved (when authenticated), account email.
- Active state: current route highlighted with accent color and `aria-current="page"`; series sub-routes (e.g. `/series/series-3/200`) highlight the parent series link.

**Props:**

- `user` (User | null) — passed from server wrapper; controls Saved link visibility and Sign In vs Sign Out.

**Used in:** Root layout (all pages).

**Example usage:**

```tsx
<Navigation />
```

**Dependencies:** Link, Button, Typography. Server wrapper uses `createClient`; client uses `signOut` server action.

---

## Form (Login / future)

### Input

**Variants:** default, email, with label.

**Props:**

- `id` (string, required).
- `type` (string, optional) — `'text' | 'email' | 'password'`.
- `label` (string, optional).
- `placeholder` (string, optional).
- `value` (string, required for controlled).
- `onChange` (function, required for controlled).
- `disabled` (boolean, optional).
- `error` (string, optional).
- `className` (string, optional).

**Used in:** Login (email).

**Example usage:**

```tsx
<Input id="email" type="email" label="Email address" value={email} onChange={...} />
```

**Dependencies:** Typography (Label).

---

### Message (alert/toast)

**Variants:** success, error.

**Props:**

- `type` (string, required) — `'success' | 'error'`.
- `children` (ReactNode, required).

**Used in:** Login (magic link sent / error).

**Example usage:**

```tsx
<Message type="error">{errorText}</Message>
```

**Dependencies:** None.

---

### Select

**Variants:** default (native select styled with design tokens).

**Props:**

- `options` (array, required) — `{ value: string, label: string }[]`.
- `value` (string, required) — controlled value.
- `onChange` (value: string) => void (required).
- `id` (string, optional) — for label association.
- `className`, `style` (optional).
- Other native select attributes (e.g. `aria-label`) passed through.

**Used in:** ScpListWithToggle (sort, Hide read context), SavedList (sort).

**Example usage:**

```tsx
<Select options={sortOptions} value={sortBy} onChange={setSortBy} aria-label="Sort articles" />
```

**Dependencies:** None (native `<select>` with design tokens).

---

### Spinner

**Variants:** default.

**Props:**

- `size` (string, optional) — `'sm' | 'md' | 'lg'`.
- `className` (string, optional).

**Used in:** Button loading states and any explicit indeterminate loading indicators.

**Example usage:**

```tsx
<Spinner size="md" />
```

**Dependencies:** None.

---

### Skeleton

**Variants:** base shimmer block (size/shape via props).

**Props:**

- `width` (CSS size, optional) — default `100%`.
- `height` (CSS size, optional) — default `1rem`.
- `radius` (CSS radius, optional) — default `var(--radius-md)`.
- `className` (string, optional).
- `style` (CSSProperties, optional).

**Used in:** Route loading states (`app/loading.tsx`, series/range/saved/scp/login/auth fallbacks) and reader content-loading placeholder.

**Example usage:**

```tsx
<Skeleton width="70%" height="1.25rem" />
<Skeleton width="96px" height="2.5rem" radius="var(--radius-button)" />
```

**Dependencies:** Global `.skeleton` shimmer styles in `app/globals.css`.

---

## Component states (reference)

Components with explicit state documentation above: **Button**, **Badge**, **SeriesCard**, **RangeListItem**, **ScpListItem**, **ProgressRing**, **ProgressText**, **Card**. For live visual examples of many states (Card variants, ProgressRing values/sizes, ProgressText, Buttons), see the components-test page.

---

## Summary: build order

1. **Typography** (Heading, Text, Mono, Label) — used everywhere.
2. **Button** — Home, Login, Nav, SCP Reader.
3. **Link / AppLink** — back links, nav, cards.
4. **Badge**, **Icon** — small atoms.
5. **Card**, **ProgressRing**, **ProgressText** — shared in lists/grids.
6. **SeriesCard**, **RangeListItem**, **ScpListItem** — page-specific composites.
7. **PageHeader**, **Logo**, **Main**, **Container**, **Stack**, **Grid** — layout.
8. **Navigation** — refactor to use Button + Link.
9. **Input**, **Message**, **Spinner**, **Skeleton** — forms and loading feedback.

After building, refactor Home, Series, Range, SCP List, Login, and SCP Reader to use these components and align Login/Reader/Nav with the same design tokens (accent, grey scale) where appropriate.
