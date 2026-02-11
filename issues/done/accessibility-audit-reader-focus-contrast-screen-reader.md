# Accessibility audit: reader UX, focus management, and contrast compliance

## TL;DR

Run a comprehensive accessibility pass beyond dyslexia-font support: screen reader flow, keyboard/focus behavior through the reader experience, and color-contrast compliance for all interactive UI.

## Type / Priority / Effort

- Type: `improvement`
- Priority: `high`
- Effort: `medium`

## Current State

- Accessibility work exists in parts, but there is no broad, systematic audit across key reader flows.
- Complex SCP content and interactive controls can create hidden friction for keyboard and assistive tech users.
- Contrast consistency across dark-theme interactive states is not yet comprehensively validated.

## Expected Outcome

- Core reading and navigation flows are usable with keyboard and screen readers.
- Focus order/management is predictable and resilient across modals, tooltips, and dynamic content.
- Interactive elements meet WCAG contrast expectations in default, hover, focus, and disabled states.

## Scope

- Audit reader journey for keyboard-only and screen reader users (entry, reading, actions, exit/navigation).
- Review and improve focus handling (visible focus, trap/release behavior, skip-link effectiveness, restoration).
- Measure and remediate color contrast issues for interactive controls across dark theme states.
- Document findings and track fixes with a prioritized accessibility checklist.

## Relevant Files

- `app/scp/[id]/scp-reader.tsx`
- `components/ui/skip-link.tsx`
- `app/globals.css`

## Risks / Notes

- Rich third-party-like article markup can create atypical semantics and focus edge cases.
- Accessibility fixes may intersect with existing dark-theme and footnote/collapsible improvements.
- Scope should prioritize high-traffic flows first to maximize user impact quickly.

## Acceptance Criteria

- Screen reader traversal works for primary SCP reading and interaction paths.
- Keyboard users can fully operate reader UI with visible, logical focus progression.
- Identified contrast failures on interactive elements are remediated to target standards.
- Audit outcomes are documented with follow-up tasks for any deferred issues.

## Suggested Labels

- `type:improvement`
- `area:accessibility`
- `area:reader`
- `theme:dark-mode`
- `priority:high`
- `effort:medium`
