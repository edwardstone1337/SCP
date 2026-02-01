# Discovery: Page Markup Patterns for SCP Continuum Tracker

**Task 5c.7** — Extract patterns from current page markup to inform Page Component design.

---

## 1. Logo

**Source:** `app/page.tsx`  
**Used on:** Home page only (no Navigation on home)

### Current Markup

```tsx
<div className="mb-12">
  <Image
    src="/scp-logo.png"
    alt="SCP Foundation"
    width={48}
    height={48}
    priority
  />
</div>
```

### Data/Props Used

| Variable | Type | Source |
|----------|------|--------|
| `src` | string | Hardcoded `/scp-logo.png` |
| `alt` | string | Hardcoded `"SCP Foundation"` |
| `width` | number | 48 |
| `height` | number | 48 |
| `priority` | boolean | `true` |

No dynamic data; purely presentational.

### Styling Summary

- **Layout:** `mb-12` (margin-bottom) on wrapper div
- **Image:** Fixed 48×48px
- **No CSS variables** — uses default Next.js Image behavior

### Existing Components It Could Use

- **Image** — Next.js `Image` (or `img`)
- No Card, Badge, or other UI atoms

### Notes

- Component inventory proposes `Logo` with optional `size: 'sm' | 'md' | 'lg'`
- Current implementation is fixed 48px (sm equivalent)

---

## 2. SeriesCard

**Source:** `app/series/page.tsx`  
**Used on:** `/series` page (Series Grid)

### Current Markup

```tsx
<Link
  key={series}
  href={`/series/${series}`}
  className="block p-6 rounded-lg border-2 transition-all hover:scale-105"
  style={{
    backgroundColor: 'var(--color-grey-9)',
    borderColor: percentage > 0 ? 'var(--color-accent)' : 'var(--color-grey-8)',
  }}
>
  <div className="flex flex-col items-center">
    {/* Roman Numeral */}
    <div className="text-5xl font-bold mb-4">{roman}</div>

    {/* Progress */}
    <div
      className="text-sm font-bold"
      style={{
        color: percentage > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
      }}
    >
      {percentage}%
    </div>

    {/* Count */}
    <div
      className="text-xs mt-1"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      {read} / {total}
    </div>
  </div>
</Link>
```

### Data/Props Used

| Variable | Type | Source |
|----------|------|--------|
| `series` | string | e.g. `series-1` (from `getSeriesProgress`) |
| `roman` | string | From `seriesToRoman(series)` — e.g. `"I"`, `"II"` |
| `total` | number | Total SCPs in series |
| `read` | number | Read count |
| `percentage` | number | `Math.round((read / total) * 100)` or 0 |

### Styling Summary

- **Layout:** `block p-6 rounded-lg border-2`
- **Background:** `var(--color-grey-9)`
- **Border:** `var(--color-accent)` when `percentage > 0`, else `var(--color-grey-8)`
- **Interaction:** `transition-all hover:scale-105`
- **Typography:** Roman numeral `text-5xl font-bold`, percentage `text-sm font-bold`, count `text-xs` secondary

### Interactive Behavior

- **Link:** Full card links to `/series/{series}`
- **Hover:** Scale to 105%

### Conditional Rendering

- **Border color:** Accent if `percentage > 0`, grey otherwise
- **Percentage color:** Accent if `percentage > 0`, secondary otherwise

### Existing Components It Could Use

- **Card** — `variant="interactive"`, `accentBorder={percentage > 0}`, `href` (Card supports `href` and renders as Link)
- **ProgressText** — `read`, `total`, `variant="percentage"` and/or `variant="fraction"` (or `both`)
- **Typography** — `Heading` for roman numeral, `Text` for secondary count
- **Badge** — `variant="progress"` for `{percentage}%` (Badge.progress uses accent color)

### Notes

- Card component uses `--spacing-card-padding` (32px) and `--radius-card`; current markup uses `p-6` (24px) and `rounded-lg`. May need `className` override or Card prop adjustment.
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`

---

## 3. RangeListItem

**Source:** `app/series/[seriesId]/page.tsx`  
**Used on:** `/series/[seriesId]` page (Range List)

### Current Markup

```tsx
<Link
  key={rangeStart}
  href={`/series/${seriesId}/${rangeStart}`}
  className="flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:scale-[1.02]"
  style={{
    backgroundColor: 'var(--color-grey-9)',
    borderColor: percentage > 0 ? 'var(--color-accent)' : 'var(--color-grey-8)'
  }}
>
  <span className="font-bold text-lg font-mono">{rangeLabel}</span>
  
  <div className="flex items-center gap-3">
    <span 
      className="text-sm font-bold"
      style={{ 
        color: percentage > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)'
      }}
    >
      {percentage}%
    </span>
    <div 
      className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
      style={{ 
        borderColor: percentage > 0 ? 'var(--color-accent)' : 'var(--color-grey-7)'
      }}
    >
      <span className="text-xs font-bold">{percentage}%</span>
    </div>
  </div>
</Link>
```

### Data/Props Used

| Variable | Type | Source |
|----------|------|--------|
| `rangeStart` | number | e.g. 0, 100, 200 |
| `rangeLabel` | string | From `formatRange(rangeStart)` — e.g. `"001–099"` |
| `total` | number | SCPs in range |
| `read` | number | Read count |
| `percentage` | number | `Math.round((read / total) * 100)` or 0 |
| `seriesId` | string | e.g. `series-1` (for href) |

### Styling Summary

- **Layout:** `flex items-center justify-between p-4 rounded-lg border-2`
- **Background:** `var(--color-grey-9)`
- **Border:** `var(--color-accent)` when `percentage > 0`, else `var(--color-grey-8)`
- **Interaction:** `transition-all hover:scale-[1.02]`
- **Range label:** `font-bold text-lg font-mono`
- **Progress circle:** `w-12 h-12 rounded-full border-2` — **not** a true progress ring (no arc), just a bordered circle with `{percentage}%` text inside

### Interactive Behavior

- **Link:** Row links to `/series/{seriesId}/{rangeStart}`
- **Hover:** Scale to 102%

### Conditional Rendering

- **Border color (card):** Accent if `percentage > 0`, grey otherwise
- **Percentage text color:** Accent if `percentage > 0`, secondary otherwise
- **Circle border:** Accent if `percentage > 0`, `var(--color-grey-7)` otherwise

### Existing Components It Could Use

- **Card** — `variant="interactive"`, `accentBorder={percentage > 0}`, `href`
- **ProgressRing** — Current markup uses a **simple circle with label**, not an arc. ProgressRing supports `value`, `size`, and `children` (for center content). **Gap:** ProgressRing sizes are `sm: 64`, `md: 96`, `lg: 128`; current circle is 48px (`w-12 h-12`). Would need a smaller size (e.g. `xs: 48`) or a new variant.
- **ProgressText** — For `{percentage}%` and/or read/total
- **Mono** — For `rangeLabel`

### Notes

- The "progress ring" in RangeListItem is **not** a ring (no arc). It's a full circle with text. To use `ProgressRing`, we'd either add an `xs` size or use it and accept different visual (actual arc vs full circle).
- List container: `space-y-3`

---

## 4. ScpListItem

**Source:** `app/series/[seriesId]/[range]/page.tsx`  
**Used on:** `/series/[seriesId]/[range]` page (SCP List)

### Current Markup

```tsx
<Link
  key={scp.id}
  href={`/scp/${scp.scp_id}`}
  className="flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:scale-[1.01]"
  style={{
    backgroundColor: 'var(--color-grey-9)',
    borderColor: scp.is_read ? 'var(--color-accent)' : 'var(--color-grey-8)'
  }}
>
  <div className="flex-1 min-w-0">
    <h3 className="font-bold truncate mb-1">{scp.title}</h3>
    <div 
      className="flex items-center gap-3 text-sm"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      <span className="flex items-center gap-1">
        ★ {scp.rating}
      </span>
      <span>•</span>
      <span className="font-mono">{scp.scp_id}</span>
    </div>
  </div>
  
  <div className="ml-4">
    {scp.is_read ? (
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center border-2"
        style={{ 
          backgroundColor: 'var(--color-red-1)',
          borderColor: 'var(--color-accent)'
        }}
      >
        <span style={{ color: 'var(--color-accent)' }}>✓</span>
      </div>
    ) : (
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center border-2"
        style={{ borderColor: 'var(--color-grey-7)' }}
      >
        <span style={{ color: 'var(--color-grey-7)' }}>👁️</span>
      </div>
    )}
  </div>
</Link>
```

### Data/Props Used

| Variable | Type | Source |
|----------|------|--------|
| `scp.id` | string | UUID from `scps` table |
| `scp.scp_id` | string | Slug e.g. `scp-001` |
| `scp.title` | string | SCP title |
| `scp.rating` | number | Rating (e.g. 4) |
| `scp.is_read` | boolean | From `user_progress` or `false` for guests |

### Styling Summary

- **Layout:** `flex items-center justify-between p-4 rounded-lg border-2`
- **Background:** `var(--color-grey-9)`
- **Border:** `var(--color-accent)` when `is_read`, else `var(--color-grey-8)`
- **Interaction:** `transition-all hover:scale-[1.01]`
- **Title:** `font-bold truncate mb-1`
- **Meta row:** `text-sm`, secondary color, `gap-3` — rating ★, bullet, scp_id (mono)
- **Status icon:** 32×32 circle — read: red-1 bg + accent border + ✓; unread: grey-7 border + 👁️

### Interactive Behavior

- **Link:** Row links to `/scp/{scp_id}`
- **Hover:** Scale to 101%

### Conditional Rendering

- **Border color:** Accent if `is_read`, grey otherwise
- **Status icon:**
  - **Read:** Circle with `--color-red-1` background, `--color-accent` border, ✓ (accent color)
  - **Unread:** Circle with `--color-grey-7` border, 👁️ (grey-7)

### Existing Components It Could Use

- **Card** — `variant="interactive"`, `accentBorder={is_read}`, `href`
- **Icon** — `name="check"` and `name="eye"` (Icon component has both)
- **Mono** — For `scp.scp_id`
- **Text** — `variant="secondary"` for meta row
- **Heading** — `level={3}` for title (or `as="h3"`)

### Notes

- Icon component uses emoji (✓, 👁️). Could be replaced with SVG icons if desired.
- List container: `space-y-2`
- Truncation: `min-w-0` on flex child + `truncate` on title for overflow

---

## 5. PageHeader

**Source:** Used across `app/series/page.tsx`, `app/series/[seriesId]/page.tsx`, `app/series/[seriesId]/[range]/page.tsx`  
**Variants:** Simple (Series), With back + badge (Range), With back only (SCP List)

### Current Markup — Variant A (Series)

```tsx
<div className="mb-8">
  <h1 className="text-4xl font-bold mb-2">Series</h1>
  <p style={{ color: 'var(--color-text-secondary)' }}>
    Select a series to start reading
  </p>
</div>
```

### Current Markup — Variant B (Range)

```tsx
<div className="mb-8">
  <Link
    href="/series"
    className="inline-flex items-center text-sm mb-4 transition-colors"
    style={{ color: 'var(--color-text-secondary)' }}
  >
    ← Back
  </Link>
  
  <h1 className="text-4xl font-bold mb-1">Series {roman}</h1>
  <p 
    className="text-sm uppercase tracking-wide font-bold"
    style={{ color: 'var(--color-accent)' }}
  >
    Access Granted
  </p>
</div>
```

### Current Markup — Variant C (SCP List)

```tsx
<div className="mb-8">
  <Link
    href={`/series/${seriesId}`}
    className="inline-flex items-center text-sm mb-4 transition-colors"
    style={{ color: 'var(--color-text-secondary)' }}
  >
    ← Back
  </Link>
  
  <h1 className="text-4xl font-bold mb-1">{formatRange(rangeStart)}</h1>
</div>
```

### Data/Props Used

| Variable | Type | Variant | Source |
|----------|------|---------|--------|
| `title` | string | All | e.g. "Series", "Series I", "001–099" |
| `description` | string | A | "Select a series to start reading" |
| `backHref` | string | B, C | `/series` or `/series/{seriesId}` |
| `badge` | string | B | "Access Granted" |
| `roman` | string | B | From `seriesToRoman(seriesId)` |

### Styling Summary

- **Container:** `mb-8`
- **Back link:** `inline-flex items-center text-sm mb-4`, `var(--color-text-secondary)`, `transition-colors`
- **Title:** `text-4xl font-bold`, `mb-2` (with description) or `mb-1` (with badge/none)
- **Description:** `var(--color-text-secondary)`
- **Badge:** `text-sm uppercase tracking-wide font-bold`, `var(--color-accent)`

### Interactive Behavior

- **Back link:** Navigates to parent page

### Conditional Rendering

- **Back link:** Only when `backHref` present
- **Description:** Only in Variant A
- **Badge:** Only in Variant B

### Existing Components It Could Use

- **Link** — `variant="back"` for ← Back (Link component has `back` variant)
- **Heading** — `level={1}` for title
- **Text** — `variant="secondary"` for description
- **Badge** — `variant="accent"` for "Access Granted"

### Notes

- Link component's `back` variant matches: secondary color, sm font. Just need `children` with "← Back" or use Icon `arrow-back`.
- PageHeader is a composite; no single component exists yet. Component inventory proposes it with `title`, `description`, `backHref`, `badge`, `badgeVariant`.

---

## Summary: Existing Component Mapping

| Pattern | Card | ProgressRing | ProgressText | Badge | Icon | Typography | Link |
|---------|------|--------------|--------------|-------|------|------------|------|
| Logo | — | — | — | — | — | — | — |
| SeriesCard | ✅ | — | ✅ | ✅ | — | ✅ | (Card has href) |
| RangeListItem | ✅ | ⚠️ (size gap) | ✅ | — | — | ✅ | (Card has href) |
| ScpListItem | ✅ | — | — | — | ✅ | ✅ | (Card has href) |
| PageHeader | — | — | — | ✅ | — | ✅ | ✅ |

**Gaps identified:**

1. **ProgressRing** — RangeListItem uses a 48px circle; ProgressRing smallest is 64px. Consider `xs: 48` size.
2. **RangeListItem circle** — Current design is a bordered circle with text, not an arc. ProgressRing draws an arc. Design decision: keep circle or switch to arc.
3. **Card** — Uses `--spacing-card-padding` (32px); pages use `p-6` (24px) and `p-4` (16px). May need padding variants or `className` override.
4. **ScpListItem read icon** — Uses `--color-red-1` background; Icon component is text-only. May need an optional wrapper with background/border for status indicators.
