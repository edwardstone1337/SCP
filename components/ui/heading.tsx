import React, { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps {
  level: HeadingLevel
  children: ReactNode
  accent?: boolean
  className?: string
  style?: CSSProperties
}

export function Heading({
  level,
  children,
  accent = false,
  className,
  style,
}: HeadingProps) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements

  // Map heading levels to font sizes
  const fontSizeMap: Record<HeadingLevel, string> = {
    1: 'var(--font-size-3xl)', // 38px
    2: 'var(--font-size-2xl)', // 30px
    3: 'var(--font-size-xl)',  // 24px
    4: 'var(--font-size-lg)',  // 20px
    5: 'var(--font-size-base)', // 16px
    6: 'var(--font-size-sm)',  // 14px
  }

  const lineHeightMap: Record<HeadingLevel, string> = {
    1: 'var(--line-height-3xl)', // 46px
    2: 'var(--line-height-2xl)', // 38px
    3: 'var(--line-height-xl)',  // 32px
    4: 'var(--line-height-lg)',  // 28px
    5: 'var(--line-height-base)', // 24px
    6: 'var(--line-height-sm)',  // 22px
  }

  const headingStyle: CSSProperties = {
    fontSize: fontSizeMap[level],
    lineHeight: lineHeightMap[level],
    fontWeight: 700,
    fontFamily: 'var(--font-family-sans)',
    color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)',
    margin: 0,
    ...style,
  }

  return (
    <Tag className={cn(className)} style={headingStyle}>
      {children}
    </Tag>
  )
}
