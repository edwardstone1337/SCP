import { ReactNode, CSSProperties } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const PADDING_MAP = {
  sm: 'var(--spacing-2)',
  md: 'var(--spacing-3)',
  lg: 'var(--spacing-4)',
} as const

type PaddingKey = keyof typeof PADDING_MAP

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
  // Base styles
  const baseStyle: CSSProperties = {
    padding: PADDING_MAP[padding],
    backgroundColor: 'var(--color-grey-9)',
    borderRadius: 'var(--radius-card)',
    borderWidth: 'var(--border-width-normal)',
    borderStyle: 'solid',
    borderColor: accentBorder ? 'var(--color-accent)' : 'var(--color-grey-8)',
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
      borderColor: accentBorder ? 'var(--color-accent)' : 'var(--color-grey-7)',
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
        className={className}
        style={combinedStyle}
        data-variant={variant}
      >
        {children}
      </Link>
    )
  }

  // Otherwise render as div
  return (
    <div
      className={className}
      style={combinedStyle}
      data-variant={variant}
    >
      {children}
    </div>
  )
}
