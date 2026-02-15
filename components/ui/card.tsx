import { ReactNode, CSSProperties } from 'react'
import Link from 'next/link'

type PaddingKey = 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'interactive' | 'bordered'
  accentBorder?: boolean
  /** Card padding: sm=16px, md=24px, lg=32px (default) */
  padding?: PaddingKey
  href?: string
  className?: string
  style?: CSSProperties
  role?: string
  'aria-live'?: 'polite' | 'assertive' | 'off'
  'aria-busy'?: 'true' | 'false' | boolean
}

export function Card({
  children,
  variant = 'default',
  accentBorder = false,
  padding = 'lg',
  href,
  className,
  style,
  role,
  'aria-live': ariaLive,
  'aria-busy': ariaBusy,
}: CardProps) {
  const cardClassName = ['ui-card', `ui-card-padding-${padding}`, className].filter(Boolean).join(' ')

  // Base styles
  const baseStyle: CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-card)',
    borderWidth: 'var(--border-width-normal)',
    borderStyle: 'solid',
    borderColor: accentBorder ? 'var(--color-accent)' : 'var(--color-surface-border)',
    ...style,
  }

  // Variant styles
  const variantStyles: Record<string, CSSProperties> = {
    default: {},
    interactive: {
      cursor: 'pointer',
      transition: 'transform var(--transition-base)',
    },
    bordered: {
      borderColor: accentBorder ? 'var(--color-accent)' : 'var(--color-surface-border)',
    },
  }

  const combinedStyle: CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
  }

  // If href provided, render as Link
  if (href) {
    return (
      <Link
        href={href}
        className={cardClassName}
        style={{ display: 'block', textDecoration: 'none', color: 'inherit', ...combinedStyle }}
        data-variant={variant}
        data-card-padding={padding}
      >
        {children}
      </Link>
    )
  }

  // Otherwise render as div
  return (
    <div
      className={cardClassName}
      style={combinedStyle}
      data-variant={variant}
      data-card-padding={padding}
      role={role}
      aria-live={ariaLive}
      aria-busy={ariaBusy !== undefined ? (ariaBusy === 'true' || ariaBusy === true) : undefined}
    >
      {children}
    </div>
  )
}
