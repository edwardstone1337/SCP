'use client'

import { Card } from '@/components/ui/card'
import { Heading, Text, Mono } from '@/components/ui/typography'
import { Icon } from '@/components/ui/icon'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { CSSProperties } from 'react'

export interface ScpListItemProps {
  scpId: string
  title: string
  rating: number
  isRead: boolean
  href: string
  className?: string
}

export function ScpListItem({
  scpId,
  title,
  rating,
  isRead,
  href,
  className,
}: ScpListItemProps) {
  const rowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3)',
  }

  const leftStyle: CSSProperties = {
    minWidth: 0,
    flex: 1,
  }

  const metaStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    marginTop: 'var(--spacing-1)',
  }

  return (
    <Card
      variant="interactive"
      accentBorder={isRead}
      padding="sm"
      href={href}
      className={className}
    >
      <div style={rowStyle}>
        <div style={leftStyle}>
          <Heading level={4} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </Heading>
          <div style={metaStyle}>
            <Icon name="star" size="sm" className="text-[var(--color-text-secondary)]" />
            <Text variant="secondary" size="sm">{rating}</Text>
            <Text variant="muted" size="sm">•</Text>
            <Mono size="sm">{scpId}</Mono>
          </div>
        </div>
        <StatusIndicator status={isRead ? 'read' : 'unread'} size="md" />
      </div>
    </Card>
  )
}
