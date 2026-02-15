import { ReactNode, CSSProperties, forwardRef } from 'react'
import NextLink from 'next/link'

interface LinkProps {
  href: string
  variant?: 'default' | 'back' | 'nav'
  external?: boolean
  target?: string
  rel?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean
  onClick?: () => void
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    variant = 'default',
    external = false,
    target,
    rel,
    children,
    className,
    style: styleProp,
    'aria-current': ariaCurrent,
    onClick,
  },
  ref
) {
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

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        className={className}
        style={combinedStyle}
        data-variant={variant}
        target={target ?? '_blank'}
        rel={rel ?? 'noopener noreferrer'}
        onClick={onClick}
        {...(ariaCurrent !== undefined && { 'aria-current': ariaCurrent })}
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink
      ref={ref}
      href={href}
      className={className}
      style={combinedStyle}
      data-variant={variant}
      onClick={onClick}
      {...(ariaCurrent !== undefined && { 'aria-current': ariaCurrent })}
    >
      {children}
    </NextLink>
  )
})
