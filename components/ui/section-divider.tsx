interface SectionDividerProps {
  symbol?: string
}

export function SectionDivider({ symbol = '◆' }: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          flex: 1,
          height: '1px',
          backgroundColor: 'var(--color-surface-border)',
        }}
      />
      <span
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-xs)',
          lineHeight: 1,
          padding: '0 var(--spacing-2)',
        }}
      >
        {symbol}
      </span>
      <div
        style={{
          flex: 1,
          height: '1px',
          backgroundColor: 'var(--color-surface-border)',
        }}
      />
    </div>
  )
}
