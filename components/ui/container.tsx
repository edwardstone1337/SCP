import { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeToToken: Record<ContainerSize, string> = {
  xs: 'var(--container-xs)',
  sm: 'var(--container-sm)',
  md: 'var(--container-md)',
  lg: 'var(--container-lg)',
  xl: 'var(--container-xl)',
}

interface ContainerProps {
  children: ReactNode
  size?: ContainerSize
  className?: string
  style?: CSSProperties
}

export function Container({
  children,
  size = 'lg',
  className,
  style,
}: ContainerProps) {
  return (
    <div
      className={cn(className)}
      style={{
        maxWidth: sizeToToken[size],
        margin: '0 auto',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
