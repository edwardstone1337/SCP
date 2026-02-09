import { CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  className?: string
  style?: CSSProperties
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  radius = 'var(--radius-md)',
  className,
  style,
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('skeleton', className)}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  )
}
