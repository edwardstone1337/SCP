export function DegradedBanner() {
  return (
    <div
      role="alert"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-red-2)',
        borderBottom: '1px solid var(--color-accent)',
        color: 'var(--color-grey-3)',
        fontSize: 'var(--font-size-sm)',
        lineHeight: 1.5,
        padding: 'var(--spacing-1) var(--spacing-2)',
        fontFamily: 'var(--font-family-mono)',
      }}
    >
      <span style={{ marginRight: 'var(--spacing-1)' }} aria-hidden="true">&#9888;</span>
      <span>
        PARTIAL CONTAINMENT FAILURE — Some archive assets may be temporarily
        unavailable. Containment teams are responding.
      </span>
    </div>
  )
}
