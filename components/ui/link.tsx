import { ReactNode, CSSProperties } from 'react'
import NextLink from 'next/link'
import { cn } from '@/lib/utils/cn'

interface LinkProps {
  href: string
  variant?: 'default' | 'back' | 'nav'
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Link({
  href,
  variant = 'default',
  children,
  className,
  style: styleProp,
}: LinkProps) {
  // Base styles
  const baseStyle: CSSProperties = {
    textDecoration: 'none',
    transition: 'color var(--transition-base)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family-sans)',
  }

  // Variant styles
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      color: 'var(--color-text-primary)',
    },
    back: {
      color: 'var(--color-text-secondary)',
      fontSize: 'var(--font-size-sm)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
    },
    nav: {
      color: 'var(--color-text-primary)',
      fontSize: 'var(--font-size-lg)',
      fontWeight: 700,
    },
  }

  // Combine styles (caller style overrides for touch targets etc.)
  const combinedStyle: CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...styleProp,
  }

  return (
    <NextLink
      href={href}
      className={className}
      style={combinedStyle}
      data-variant={variant}
    >
      {children}
    </NextLink>
  )
}
