import { CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
} as const

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: CSSProperties
}

/**
 * Simple CSS spinner using @keyframes spin from globals.css.
 * Uses --color-accent for the spinner color. Centered by default.
 */
export function Spinner({ size = 'md', className, style }: SpinnerProps) {
  const px = sizeMap[size]
  const borderWidth = Math.max(2, Math.floor(px / 8))

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: px,
        height: px,
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          width: px,
          height: px,
          border: `${borderWidth}px solid var(--color-grey-8)`,
          borderTopColor: 'var(--color-accent)',
          borderRadius: 'var(--radius-full)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  )
}
