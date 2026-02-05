import { ReactNode, CSSProperties } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'accent' | 'progress'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--radius-badge)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-grey-8)',
      color: 'var(--color-text-secondary)',
    },
    accent: {
      backgroundColor: 'transparent',
      color: 'var(--color-accent)',
    },
    progress: {
      backgroundColor: 'transparent',
      color: 'var(--color-accent)',
      fontSize: 'var(--font-size-sm)',
    },
  }

  const combinedStyle: CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
  }

  return (
    <span className={className} style={combinedStyle}>
      {children}
    </span>
  )
}
