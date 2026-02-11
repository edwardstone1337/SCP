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
}

export function Card({
  children,
  variant = 'default',
  accentBorder = false,
  padding = 'lg',
  href,
  className,
  style,
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
        style={combinedStyle}
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
    >
      {children}
    </div>
  )
}
