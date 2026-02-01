import { ReactNode, CSSProperties } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'interactive' | 'bordered'
  accentBorder?: boolean
  href?: string
  className?: string
}

export function Card({
  children,
  variant = 'default',
  accentBorder = false,
  href,
  className,
}: CardProps) {
  // Base styles
  const baseStyle: CSSProperties = {
    padding: 'var(--spacing-card-padding)',
    backgroundColor: 'var(--color-grey-9)',
    borderRadius: 'var(--radius-card)',
    borderWidth: 'var(--border-width-normal)',
    borderStyle: 'solid',
    borderColor: accentBorder ? 'var(--color-accent)' : 'var(--color-grey-8)',
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
