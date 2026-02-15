import { CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

const sizeTokenMap = {
  sm: 'var(--spacing-2)',
  md: 'var(--spacing-3)',
  lg: 'var(--spacing-4)',
} as const

/** Border width scales with size (16px→2, 24px→3, 32px→4). Numeric for CSS border-width. */
const borderWidthMap = {
  sm: 2,
  md: 3,
  lg: 4,
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
  const sizeToken = sizeTokenMap[size]
  const borderWidth = borderWidthMap[size]

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizeToken,
        height: sizeToken,
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          width: sizeToken,
          height: sizeToken,
          border: `${borderWidth}px solid var(--color-grey-8)`,
          borderTopColor: 'var(--color-accent)',
          borderRadius: 'var(--radius-full)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  )
}
