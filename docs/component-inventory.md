# SCP Continuum Tracker — Component Inventory

Component library inventory derived from existing pages (Home, Series Grid, Range List, SCP List), design tokens in `app/globals.css`, and shared UI patterns. Use this to build components systematically.

**Design tokens (reference):** Red scale (`--color-red-1`–`10`), Grey scale (`--color-grey-1`–`10`), semantic `--color-background`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`, `--color-accent-hover`. Typography: Roboto / Roboto Mono, sizes `xs`–`5xl`.

---

## Base / Atomic

### Button

**Variants:** primary (accent), secondary (outline), ghost, danger (sign out), success (read state).

**Props:**

- `variant` (string, optional) — `'primary' | 'secondary' | 'ghost' | 'danger' | 'success'`. Default: `'primary'`.
- `size` (string, optional) — `'sm' | 'md' | 'lg'`. Default: `'md'`.
- `disabled` (boolean, optional) — disables button.
- `fullWidth` (boolean, optional) — full width (e.g. Home “Continue”).
- `type` (string, optional) — `'button' | 'submit' | 'reset'`. Default: `'button'`.
- `children` (ReactNode, required) — label/content.
- `onClick` (function, optional) — click handler.
- `className` (string, optional) — extra classes.

**Used in:** Home (Continue), Login (Send Magic Link, Back to home), Navigation (Sign In, Sign Out), SCP Reader (Back, Mark as Read).

**Example usage:**

```tsx
<Button variant="primary" fullWidth href="/series">Continue</Button>
<Button variant="secondary" onClick={handleToggleRead}>Mark as Read</Button>
<Button variant="danger" type="submit">Sign Out</Button>
```

**Dependencies:** None.

---

### Link

**Variants:** default (text), back (with arrow), nav (header).

**Props:**

- `href` (string, required) — URL.
- `variant` (string, optional) — `'default' | 'back' | 'nav'`. Default: `'default'`.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Home, Series Grid (card links), Range List (Back, range links), SCP List (Back, SCP links), Navigation, Login (Back to home).

**Example usage:**

```tsx
<Link href="/series" variant="back">← Back</Link>
<AppLink href="/series" variant="nav">Series</AppLink>
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
<Heading level={2}>THE FOUNDATION DATABASE IS CLASSIFIED</Heading>
<Text variant="secondary">Select a series to start reading</Text>
<Mono>{scp_id}</Mono>
```

**Dependencies:** None.

---

### AccentBar

**Variants:** vertical (e.g. next to “SECURE CONTAIN PROTECT”).

**Props:**

- `orientation` (string, optional) — `'vertical' | 'horizontal'`. Default: `'vertical'`.
- `className` (string, optional).

**Used in:** Home (red bar beside title).

**Example usage:**

```tsx
<AccentBar orientation="vertical" />
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

**Dependencies:** Link, Icon (check/eye), Typography.

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

**Dependencies:** Typography.

---

### Card (generic)

**Variants:** default, interactive (hover scale), bordered.

**Props:**

- `as` (string, optional) — `'div' | 'a'`. Default: `'div'`.
- `href` (string, optional) — if `as='a'`.
- `variant` (string, optional) — `'default' | 'interactive' | 'bordered'`.
- `accentBorder` (boolean, optional) — use accent when e.g. progress &gt; 0.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Series Grid, Range List, SCP List (shared card style).

**Example usage:**

```tsx
<Card as="a" href="/series/series-1" variant="interactive" accentBorder={percentage > 0}>
  ...
</Card>
```

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

**Used in:** Series, Range, SCP List, SCP Reader.

**Example usage:**

```tsx
<PageHeader title="Series" description="Select a series to start reading" />
<PageHeader title="Series I" backHref="/series" badge="Access Granted" badgeVariant="accent" />
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

**Variants:** default (max-width + horizontal padding).

**Props:**

- `maxWidth` (string, optional) — `'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'`.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Series (`max-w-4xl`), Range/SCP List (`max-w-2xl`), SCP Reader (`max-w-4xl`).

**Example usage:**

```tsx
<Container maxWidth="2xl">...</Container>
```

**Dependencies:** None.

---

### Stack

**Variants:** vertical (default), horizontal, gap size.

**Props:**

- `direction` (string, optional) — `'vertical' | 'horizontal'`. Default: `'vertical'`.
- `gap` (string, optional) — `'xs' | 'sm' | 'md' | 'lg'`.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** All pages (sections, lists).

**Example usage:**

```tsx
<Stack gap="lg">
  <PageHeader ... />
  <div className="grid ...">...</div>
</Stack>
```

**Dependencies:** None.

---

### Grid

**Variants:** 2 cols, 3 cols, 4 cols (responsive).

**Props:**

- `cols` (object, optional) — e.g. `{ default: 2, md: 3, lg: 4 }`.
- `gap` (string, optional) — `'sm' | 'md' | 'lg'`. Default: `'md'`.
- `children` (ReactNode, required).
- `className` (string, optional).

**Used in:** Series Grid.

**Example usage:**

```tsx
<Grid cols={{ default: 2, md: 3, lg: 4 }} gap="md">
  {seriesProgress.map(...) => <SeriesCard ... />)}
</Grid>
```

**Dependencies:** None.

---

### Navigation

**Variants:** default (logo + nav links + user/actions).

**Props:**

- `user` (User | null, optional) — from auth.
- (Optional) `links` (array) — nav items; can be derived from `user`.

**Used in:** Series, Range, SCP List, SCP Reader (not Home or Login).

**Example usage:**

```tsx
<Navigation />
```

**Dependencies:** Link, Button (sign out), Typography. Server component; uses `createClient` and `signOut`.

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

### Spinner

**Variants:** default.

**Props:**

- `size` (string, optional) — `'sm' | 'md' | 'lg'`.
- `className` (string, optional).

**Used in:** SCP Reader (loading content), Login (sending).

**Example usage:**

```tsx
<Spinner size="md" />
```

**Dependencies:** None.

---

## Summary: build order

1. **Typography** (Heading, Text, Mono, Label) — used everywhere.
2. **Button** — Home, Login, Nav, SCP Reader.
3. **Link / AppLink** — back links, nav, cards.
4. **Badge**, **Icon**, **AccentBar** — small atoms.
5. **Card**, **ProgressRing**, **ProgressText** — shared in lists/grids.
6. **SeriesCard**, **RangeListItem**, **ScpListItem** — page-specific composites.
7. **PageHeader**, **Logo**, **Main**, **Container**, **Stack**, **Grid** — layout.
8. **Navigation** — refactor to use Button + Link.
9. **Input**, **Message**, **Spinner** — forms and feedback.

After building, refactor Home, Series, Range, SCP List, Login, and SCP Reader to use these components and align Login/Reader/Nav with the same design tokens (accent, grey scale) where appropriate.
