# Discovery: @theme vs :root Token Declarations in Tailwind v4

**Date:** 2026-02-01  
**Question:** In Tailwind v4, when tokens are defined in `@theme`, are they automatically available as CSS custom properties for inline styles (`style={{}}`)? Can we remove the `:root` duplication?

---

## Summary

**Do @theme tokens automatically become available as CSS variables for inline styles?**

**Partially.** Tailwind v4 emits `@theme` variables as real CSS custom properties on `:root`, **but only variables that are "used"** — i.e. referenced by utility classes or by other theme variables in the compiled CSS. Variables referenced **only** in JSX `style={{}}` are **not** detected and **are not emitted**.

**Can we remove the :root duplication entirely?**

**Only if** we use `@theme static { ... }`, which forces all theme variables to be emitted. Otherwise, **yes, the duplication is required** for tokens used only in inline styles.

---

## Evidence

### 1. Tailwind v4 Documentation

From [tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme):

> **"Generating all CSS variables"**  
> By default only used CSS variables will be generated in the final CSS output. If you want to always generate all CSS variables, you can use the `static` theme option:
>
> ```css
> @theme static {
>   --color-primary: var(--color-red-500);
>   --color-secondary: var(--color-blue-500);
> }
> ```

> **"Using your theme variables"**  
> All of your theme variables are turned into regular CSS variables when you compile your CSS … This makes it easy to reference all of your design tokens in any of your custom CSS or inline styles.

The docs confirm: (a) theme vars become real `:root` CSS vars, and (b) **by default only used ones** are emitted.

### 2. Production Build Analysis

Inspected `.next/static/css/6840644e61739f85.css` after `npm run build`:

**@layer theme output** (`:host,:root{...}`) includes:
- `--color-grey-1` (used by `--color-text-primary: var(--color-grey-1)`)
- `--line-height-3xl` (used by Heading component — Tailwind picks it up via CSS/arbitrary value usage)
- `--spacing-0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16` (used by utility classes like `p-4`, `gap-6`, etc.)

**NOT emitted by Tailwind:**
- `--spacing-10` — not used by any utility class or transitive theme var in the build
- `--spacing-5`, `7` — also missing (only used in inline styles or not at all)

**Explicit :root block** (from `globals.css`) adds:
- `--spacing-0`, `1`, `2`, `3`, `4`, `5`, `6`, `8`, `12` — but **not** `--spacing-10`

### 3. Test Scenario

**Token:** `--spacing-10` (exists in `@theme` only, not in `:root`)

```tsx
<div style={{ padding: 'var(--spacing-10)' }}>Test</div>
```

**Result:** Would **fail** in production. `--spacing-10` is never emitted because:
1. No utility class uses it (e.g. no `p-10` in our design system)
2. Tailwind does not scan JSX `style={{}}` for `var(--*)` references
3. Our `:root` block does not define it

---

## Conclusions

| Scenario | Emitted by @theme? | Works for inline styles? |
|----------|--------------------|---------------------------|
| Token used by utility class (e.g. `p-4`) | Yes | Yes |
| Token used by other theme var (e.g. `--color-text-primary: var(--color-grey-1)`) | Yes | Yes |
| Token used only in `style={{ padding: 'var(--spacing-10)' }}` | No | No (unless in :root) |
| Token in `@theme static { ... }` | Yes (all) | Yes |

### Recommendations

1. **If you want to remove :root duplication:**  
   Use `@theme static { ... }` so all theme variables are always emitted. Then inline styles can rely on `@theme` alone.

2. **If you keep the current setup:**  
   Keep the `:root` block for tokens used only in inline styles. Tailwind will not emit them by default.

3. **Document the pattern:**  
   Add a comment in `globals.css` explaining:
   - Tailwind v4 emits only *used* theme variables
   - Tokens used only in `style={{}}` need explicit `:root` definitions
   - Or use `@theme static` to emit everything

---

## Appendix: Tokens Only in @theme (Not in :root)

From `globals.css` @theme block, these are **not** in our :root and may not be emitted:

- `--spacing-7`, `--spacing-10`, `--spacing-16`
- `--color-grey-1`, `--color-grey-2`, `--color-grey-3`, `--color-grey-4`, `--color-grey-5`, `--color-grey-6`, `--color-grey-10`
- `--line-height-4xl`, `--line-height-5xl`
- Various semantic tokens if only used in inline styles

Some of these (e.g. `--color-grey-1`) are emitted because they are referenced by other theme vars (`--color-text-primary`).
