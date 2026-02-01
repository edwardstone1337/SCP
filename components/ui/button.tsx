import { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
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
  const baseStyles = [
    'inline-flex items-center justify-center',
    'font-bold',
    'transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ]

  const variants = {
    primary: [
      'bg-[var(--color-accent)]',
      'text-[var(--color-text-primary)]',
      'border-2 border-[var(--color-accent)]',
      'hover:bg-[var(--color-accent-hover)]',
      'hover:border-[var(--color-accent-hover)]',
    ],
    secondary: [
      'bg-transparent',
      'text-[var(--color-text-primary)]',
      'border-2 border-[var(--color-grey-7)]',
      'hover:border-[var(--color-accent)]',
      'hover:text-[var(--color-accent)]',
    ],
    ghost: [
      'bg-transparent',
      'text-[var(--color-text-secondary)]',
      'border-2 border-transparent',
      'hover:text-[var(--color-text-primary)]',
      'hover:bg-[var(--color-grey-9)]',
    ],
    danger: [
      'bg-transparent',
      'text-[var(--color-text-secondary)]',
      'border-2 border-transparent',
      'hover:text-[var(--color-accent)]',
      'hover:border-[var(--color-accent)]',
    ],
    success: [
      'bg-[var(--color-red-1)]',
      'text-[var(--color-accent)]',
      'border-2 border-[var(--color-accent)]',
      'hover:bg-[var(--color-red-2)]',
    ],
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5 rounded-md',
    md: 'text-base px-4 py-2 rounded-lg',
    lg: 'text-lg px-8 py-4 rounded-lg',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  const combinedClassName = cn(
    ...baseStyles,
    ...variants[variant],
    sizes[size],
    widthClass,
    className
  )

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
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
      {...props}
    >
      {children}
    </button>
  )
}
