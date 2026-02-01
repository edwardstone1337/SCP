import { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  href?: string
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  children,
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  // Base styles using CSS variables
  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontFamily: 'var(--font-family-sans)',
    transition: 'all var(--transition-base)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
    borderWidth: 'var(--border-width-normal)',
    borderStyle: 'solid',
  }

  // Variant styles
  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--color-accent)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--color-grey-7)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
      borderColor: 'transparent',
    },
    success: {
      backgroundColor: 'var(--color-red-1)',
      color: 'var(--color-accent)',
      borderColor: 'var(--color-accent)',
    },
  }

  // Size styles using our spacing tokens
  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      fontSize: 'var(--font-size-sm)',
      paddingLeft: 'var(--spacing-2)',   // 16px
      paddingRight: 'var(--spacing-2)',  // 16px
      paddingTop: 'var(--spacing-1)',    // 8px
      paddingBottom: 'var(--spacing-1)', // 8px
      borderRadius: 'var(--radius-button)',
    },
    md: {
      fontSize: 'var(--font-size-base)',
      paddingLeft: 'var(--spacing-3)',   // 24px
      paddingRight: 'var(--spacing-3)',  // 24px
      paddingTop: 'var(--spacing-1)',    // 8px - gives ~40px height
      paddingBottom: 'var(--spacing-1)', // 8px
      borderRadius: 'var(--radius-button)',
    },
    lg: {
      fontSize: 'var(--font-size-lg)',
      paddingLeft: 'var(--spacing-4)',   // 32px
      paddingRight: 'var(--spacing-4)',  // 32px
      paddingTop: 'var(--spacing-2)',    // 16px
      paddingBottom: 'var(--spacing-2)', // 16px
      borderRadius: 'var(--radius-button)',
    },
  }

  // Width style
  const widthStyle: CSSProperties = fullWidth ? { width: '100%' } : {}

  // Combine all styles
  const combinedStyle: CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...widthStyle,
  }

  // Minimal className for layout utilities only
  const combinedClassName = cn(className)

  // If href is provided, render as Link
  if (href) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        style={combinedStyle}
        data-variant={variant}
      >
        {children}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedClassName}
      style={combinedStyle}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  )
}
