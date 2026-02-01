'use client'

import { CSSProperties } from 'react'
import { Icon } from '@/components/ui/icon'

const SIZE_MAP = {
  sm: 24,
  md: 32,
} as const

type SizeKey = keyof typeof SIZE_MAP

export interface StatusIndicatorProps {
  status: 'read' | 'unread'
  size?: SizeKey
  className?: string
}

export function StatusIndicator({
  status,
  size = 'md',
  className,
}: StatusIndicatorProps) {
  const dimension = SIZE_MAP[size]
  const iconSize = size === 'sm' ? 'sm' : 'md'

  const isRead = status === 'read'
  const style: CSSProperties = {
    width: dimension,
    height: dimension,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: isRead ? 'var(--color-red-1)' : 'transparent',
    borderWidth: 'var(--border-width-normal)',
    borderStyle: 'solid',
    borderColor: isRead ? 'var(--color-accent)' : 'var(--color-grey-7)',
  }

  return (
    <span
      className={className}
      style={style}
      aria-label={isRead ? 'Read' : 'Unread'}
      role="img"
    >
      {isRead ? (
        <Icon name="check" size={iconSize} className="text-[var(--color-accent)]" />
      ) : (
        <Icon name="eye" size={iconSize} className="text-[var(--color-grey-7)]" />
      )}
    </span>
  )
}
