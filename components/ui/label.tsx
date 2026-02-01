import { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

interface LabelProps {
  htmlFor: string
  children: ReactNode
  required?: boolean
  className?: string
  style?: CSSProperties
}

export function Label({
  htmlFor,
  children,
  required = false,
  className,
  style,
}: LabelProps) {
  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: 'var(--font-size-sm)', // 14px
    fontWeight: 500,
    fontFamily: 'var(--font-family-sans)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-1)', // 8px
    ...style,
  }

  return (
    <label htmlFor={htmlFor} className={cn(className)} style={labelStyle}>
      {children}
      {required && <span style={{ color: 'var(--color-accent)' }}> *</span>}
    </label>
  )
}
