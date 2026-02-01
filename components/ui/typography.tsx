import { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

// Heading Component
interface HeadingProps {
  level: 1 | 2 | 3 | 4
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  accent?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Heading({ level, as, accent, children, className, style }: HeadingProps) {
  const Component = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4')

  const styles = {
    1: 'text-5xl font-bold',
    2: 'text-4xl font-bold',
    3: 'text-3xl font-bold',
    4: 'text-2xl font-bold',
  }

  return (
    <Component
      className={cn(
        styles[level],
        accent && 'text-[var(--color-accent)]',
        !accent && 'text-[var(--color-text-primary)]',
        className
      )}
      style={style}
    >
      {children}
    </Component>
  )
}

// Text Component
interface TextProps {
  variant?: 'primary' | 'secondary' | 'muted'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'div'
  style?: CSSProperties
}

export function Text({
  variant = 'primary',
  size = 'base',
  children,
  className,
  as: Component = 'p',
  style,
}: TextProps) {
  const colors = {
    primary: 'text-[var(--color-text-primary)]',
    secondary: 'text-[var(--color-text-secondary)]',
    muted: 'text-[var(--color-grey-7)]',
  }

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return (
    <Component className={cn(colors[variant], sizes[size], className)} style={style}>
      {children}
    </Component>
  )
}

// Mono Component (for SCP IDs, etc)
interface MonoProps {
  children: ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg'
  style?: CSSProperties
}

export function Mono({ children, className, size = 'base', style }: MonoProps) {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  }

  return (
    <span className={cn('font-mono', sizes[size], className)} style={style}>{children}</span>
  )
}

// Label Component
interface LabelProps {
  htmlFor?: string
  children: ReactNode
  className?: string
  required?: boolean
  style?: CSSProperties
}

export function Label({ htmlFor, children, className, required, style }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium text-[var(--color-text-primary)] mb-2',
        className
      )}
      style={style}
    >
      {children}
      {required && <span className="text-[var(--color-accent)] ml-1">*</span>}
    </label>
  )
}
