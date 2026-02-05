import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface MainProps {
  children: ReactNode
  className?: string
}

export function Main({ children, className }: MainProps) {
  return (
    <main
      id="main"
      className={cn('min-h-screen', className)}
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-primary)',
        padding: 'var(--spacing-page-padding)',
      }}
    >
      {children}
    </main>
  )
}
