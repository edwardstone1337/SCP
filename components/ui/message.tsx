import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface MessageProps {
  type: 'success' | 'error'
  children: ReactNode
  className?: string
}

export function Message({ type, children, className }: MessageProps) {
  const isSuccess = type === 'success'

  const baseStyle: React.CSSProperties = {
    padding: 'var(--spacing-2)',
    borderRadius: 'var(--radius-md)',
    border: 'var(--border-width-normal) solid',
    fontSize: 'var(--font-size-sm)',
    backgroundColor: 'var(--color-grey-9)',
  }

  const variantStyle: React.CSSProperties = isSuccess
    ? {
        borderColor: 'var(--color-green-7)',
        color: 'var(--color-green-5)',
      }
    : {
        borderColor: 'var(--color-accent)',
        color: 'var(--color-accent)',
      }

  return (
    <div
      className={cn(className)}
      style={{ ...baseStyle, ...variantStyle }}
      role={isSuccess ? 'status' : 'alert'}
    >
      {children}
    </div>
  )
}
