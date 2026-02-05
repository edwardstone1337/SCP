'use client'

import { CSSProperties } from 'react'

const SIZE_MAP = {
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-base)',
  lg: 'var(--font-size-lg)',
} as const

type SizeKey = keyof typeof SIZE_MAP
type VariantKey = 'percentage' | 'fraction' | 'both'

export interface ProgressTextProps {
  /** Number of items read (or current progress numerator) */
  read: number
  /** Total items (or denominator) */
  total: number
  /** Display variant */
  variant?: VariantKey
  size?: SizeKey
  className?: string
}

function formatPercentage(read: number, total: number): string {
  if (total === 0) return '0%'
  const pct = Math.round((read / total) * 100)
  return `${pct}%`
}

function formatFraction(read: number, total: number): string {
  return `${read} / ${total}`
}

function formatBoth(read: number, total: number): string {
  return `${formatPercentage(read, total)} (${formatFraction(read, total)})`
}

export function ProgressText({
  read,
  total,
  variant = 'percentage',
  size = 'md',
  className,
}: ProgressTextProps) {
  const formatters: Record<VariantKey, (r: number, t: number) => string> = {
    percentage: formatPercentage,
    fraction: formatFraction,
    both: formatBoth,
  }
  const text = formatters[variant](read, total)

  const style: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: SIZE_MAP[size],
    color: 'var(--color-text-secondary)',
  }

  return (
    <span className={className} style={style}>
      {text}
    </span>
  )
}
