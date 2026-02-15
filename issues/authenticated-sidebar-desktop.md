# Authenticated sidebar on desktop

## TL;DR

For logged-in users, show the main navigation as a **sidebar on desktop** instead of the top bar. Unauthenticated users and all mobile layouts keep the current top navigation.

## Current state

- Single top navigation bar for everyone (`Navigation` → `NavigationClient`).
- Nav is a horizontal bar with logo, series links, sign in / profile, and mobile hamburger menu.
- Layout is `[SkipLink] [Nav bar] [children] [Footer]` with no auth-based layout variation.

## Expected outcome

- **Desktop (e.g. viewport ≥ breakpoint):** If user is authenticated → persistent sidebar (e.g. left) containing the same nav items; main content area sits beside it. If not authenticated → keep current top bar.
- **Mobile / narrow:** Unchanged — top bar (and hamburger) for everyone.
- Sidebar should use existing design tokens (spacing, colors, z-index) and remain accessible (focus, skip link still works).

## Relevant files

- `components/navigation-client.tsx` — main nav UI; will need desktop sidebar variant or conditional layout.
- `components/navigation.tsx` — already has `user`; can pass auth state for layout choice.
- `app/layout.tsx` — may need a wrapper that switches between “top nav” and “sidebar + content” layout for authenticated desktop (or handle inside Navigation).
- `app/globals.css` — add any sidebar-specific tokens if needed (e.g. `--sidebar-width`, `--z-sidebar`).

## Notes / risks

- Define desktop breakpoint (e.g. match existing `--breakpoint-*` or 1024px) and use one source of truth.
- Sidebar collapse/expand is out of scope unless we add it later; start with always-visible sidebar on desktop.
- Ensure skip link and focus order still make sense when sidebar is present (e.g. skip to main content, then sidebar links).

## Labels

- **Type:** feature  
- **Priority:** normal  
- **Effort:** medium  
