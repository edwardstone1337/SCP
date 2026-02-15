import { ReactNode, CSSProperties } from 'react'

// Heading Component
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps {
  level: HeadingLevel
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  accent?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
  id?: string
}

const headingFontSizeMap: Record<HeadingLevel, string> = {
  1: 'var(--font-size-3xl)', // 38px
  2: 'var(--font-size-2xl)', // 30px
  3: 'var(--font-size-xl)',  // 24px
  4: 'var(--font-size-lg)',  // 20px
  5: 'var(--font-size-base)', // 16px
  6: 'var(--font-size-sm)',  // 14px
}

const headingLineHeightMap: Record<HeadingLevel, string> = {
  1: 'var(--line-height-3xl)',
  2: 'var(--line-height-2xl)',
  3: 'var(--line-height-xl)',
  4: 'var(--line-height-lg)',
  5: 'var(--line-height-base)',
  6: 'var(--line-height-sm)',
}

export function Heading({ level, as, accent, children, className, style, id }: HeadingProps) {
  const Component = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')

  const headingStyle: CSSProperties = {
    fontSize: headingFontSizeMap[level],
    lineHeight: headingLineHeightMap[level],
    fontWeight: 700,
    fontFamily: 'var(--font-family-sans)',
    color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)',
    margin: 0,
    ...style,
  }

  return (
    <Component id={id} className={className} style={headingStyle}>
      {children}
    </Component>
  )
}

// Text Component
type TextVariant = 'primary' | 'secondary' | 'muted'
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

interface TextProps {
  variant?: TextVariant
  size?: TextSize
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'div'
  style?: CSSProperties
}

const textColorMap: Record<TextVariant, CSSProperties> = {
  primary: { color: 'var(--color-text-primary)' },
  secondary: { color: 'var(--color-text-secondary)' },
  muted: { color: 'var(--color-grey-7)' },
}

const textSizeMap: Record<TextSize, CSSProperties> = {
  xs: { fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-xs)' },
  sm: { fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-sm)' },
  base: { fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' },
  lg: { fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-lg)' },
  xl: { fontSize: 'var(--font-size-xl)', lineHeight: 'var(--line-height-xl)' },
}

export function Text({
  variant = 'primary',
  size = 'base',
  children,
  className,
  as: Component = 'p',
  style,
}: TextProps) {
  const textStyle: CSSProperties = {
    fontFamily: 'var(--font-family-sans)',
    margin: 0,
    ...textColorMap[variant],
    ...textSizeMap[size],
    ...style,
  }

  return (
    <Component className={className} style={textStyle}>
      {children}
    </Component>
  )
}

// Mono Component (for SCP IDs, etc)
type MonoSize = 'xs' | 'sm' | 'base' | 'lg'

interface MonoProps {
  children: ReactNode
  className?: string
  size?: MonoSize
  style?: CSSProperties
}

const monoSizeMap: Record<MonoSize, CSSProperties> = {
  xs: { fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-xs)' },
  sm: { fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-sm)' },
  base: { fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' },
  lg: { fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-lg)' },
}

export function Mono({ children, className, size = 'base', style }: MonoProps) {
  const monoStyle: CSSProperties = {
    fontFamily: 'var(--font-family-mono)',
    margin: 0,
    ...monoSizeMap[size],
    ...style,
  }

  return (
    <span className={className} style={monoStyle}>{children}</span>
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
  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
    fontWeight: 500,
    fontFamily: 'var(--font-family-sans)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-2)',
    ...style,
  }

  return (
    <label htmlFor={htmlFor} className={className} style={labelStyle}>
      {children}
      {required && <span style={{ color: 'var(--color-accent)', marginLeft: 'var(--spacing-1)' }}>*</span>}
    </label>
  )
}
