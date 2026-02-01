import { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
type TextVariant = 'primary' | 'secondary' | 'muted'

interface TextProps {
  children: ReactNode
  size?: TextSize
  variant?: TextVariant
  className?: string
  style?: CSSProperties
}

export function Text({
  children,
  size = 'base',
  variant = 'primary',
  className,
  style,
}: TextProps) {
  const fontSizeMap: Record<TextSize, string> = {
    xs: 'var(--font-size-xs)',   // 12px
    sm: 'var(--font-size-sm)',   // 14px
    base: 'var(--font-size-base)', // 16px
    lg: 'var(--font-size-lg)',   // 20px
    xl: 'var(--font-size-xl)',   // 24px
  }

  const lineHeightMap: Record<TextSize, string> = {
    xs: 'var(--line-height-xs)',   // 16px
    sm: 'var(--line-height-sm)',   // 22px
    base: 'var(--line-height-base)', // 24px
    lg: 'var(--line-height-lg)',   // 28px
    xl: 'var(--line-height-xl)',   // 32px
  }

  const colorMap: Record<TextVariant, string> = {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-grey-7)', // Slightly more muted than secondary
  }

  const textStyle: CSSProperties = {
    fontSize: fontSizeMap[size],
    lineHeight: lineHeightMap[size],
    color: colorMap[variant],
    fontFamily: 'var(--font-family-sans)',
    margin: 0,
    ...style,
  }

  return (
    <p className={cn(className)} style={textStyle}>
      {children}
    </p>
  )
}
