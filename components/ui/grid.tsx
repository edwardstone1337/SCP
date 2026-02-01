import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface GridProps {
  children: ReactNode
  /** Responsive 'auto' (2→3→4 like series page) or fixed column count */
  cols?: number | 'auto'
  /** Gap between items - defaults to var(--spacing-card-gap) */
  gap?: string
  className?: string
}

export function Grid({
  children,
  cols = 'auto',
  gap = 'var(--spacing-card-gap)',
  className,
}: GridProps) {
  return (
    <div
      className={cn(
        cols === 'auto' && 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
      style={{
        gap,
        ...(cols !== 'auto' && {
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }),
      }}
    >
      {children}
    </div>
  )
}
