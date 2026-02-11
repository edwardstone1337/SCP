# Footnote/collapsible mobile rendering audit and improvements

## TL;DR

Audit and improve footnote + Wikidot collapsible behavior on mobile-heavy SCP pages so complex articles remain readable, navigable, and low-friction, especially alongside dark theme QA efforts.

## Type / Priority / Effort

- Type: `improvement`
- Priority: `high`
- Effort: `medium`

## Current State

- Complex SCP pages rely heavily on footnotes and collapsible sections.
- Current behavior can feel clunky on smaller viewports (tap targets, overflow, interaction flow, readability).
- Rendering/interactivity issues in these components are a likely silent churn source on high-traffic articles.

## Expected Outcome

- Footnotes and collapsibles feel smooth and intuitive on mobile.
- Interaction patterns are consistent across common SCP markup variations.
- Improvements reduce friction without breaking article fidelity.

## Scope

- Run a focused UX/QA audit on top-complex SCP pages with dense footnote/collapsible usage.
- Improve mobile interaction for footnotes (open/close behavior, positioning, dismiss flows, keyboard/a11y support).
- Improve collapsible rendering/interaction (toggle affordance, spacing, nested content behavior, overflow handling).
- Validate behavior alongside dark theme legibility updates to avoid regressions.

## Relevant Files

- `lib/hooks/use-footnotes.ts`
- `app/scp/[id]/scp-reader.tsx`
- `app/globals.css`

## Risks / Notes

- Wikidot markup variability can create edge cases not covered by one implementation path.
- Overly aggressive style/interaction overrides may break author-intended presentation.
- Should be coordinated with `dark-theme-qa-top-100` to avoid overlapping regressions.

## Acceptance Criteria

- Mobile audit checklist completed on representative complex SCP pages.
- Footnote interactions are reliable and readable on mobile viewport sizes.
- Collapsible sections are usable on touch devices with no major layout breakage.
- No regressions in desktop behavior or dark theme content readability.

## Suggested Labels

- `type:improvement`
- `area:reader`
- `area:mobile`
- `theme:dark-mode`
- `priority:high`
- `effort:medium`
