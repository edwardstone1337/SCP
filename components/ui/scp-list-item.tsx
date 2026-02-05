'use client'

import { Card } from '@/components/ui/card'
import { Heading, Text } from '@/components/ui/typography'
import { Icon } from '@/components/ui/icon'
import { BookmarkButton } from '@/components/ui/bookmark-button'
import { ReadToggleButton } from '@/components/ui/read-toggle-button'
import { CSSProperties } from 'react'

export interface ScpListItemProps {
  id: string          // Database UUID (for ReadToggleButton)
  scpId: string       // Display ID (e.g., "SCP-001")
  title: string
  rating: number
  isRead: boolean
  isBookmarked: boolean
  href: string
  userId?: string | null  // For ReadToggleButton auth
  className?: string
}

export function ScpListItem({
  id,
  scpId,
  title,
  rating,
  isRead,
  isBookmarked,
  href,
  userId,
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

  const titleLinkStyle: CSSProperties = {
    display: 'block',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  return (
    <Card
      variant="interactive"
      padding="sm"
      href={href}
      className={className}
    >
      <div style={rowStyle}>
        <div style={leftStyle}>
          <Heading level={4} style={titleLinkStyle}>
            {title}
          </Heading>
          <div style={metaStyle}>
            <Icon name="star" size="sm" className="text-[var(--color-text-secondary)]" />
            <Text variant="secondary" size="sm">{rating}</Text>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-1)', flexShrink: 0 }}>
          <BookmarkButton
            scpId={id}
            scpRouteId={scpId}
            isBookmarked={isBookmarked}
            userId={userId ?? null}
            size="sm"
          />
          <ReadToggleButton
            scpId={id}
            routeId={scpId}
            isRead={isRead}
            userId={userId ?? null}
            size="sm"
          />
        </div>
      </div>
    </Card>
  )
}
