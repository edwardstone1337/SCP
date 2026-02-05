'use client'

import { Card } from '@/components/ui/card'
import { Heading, Text, Mono } from '@/components/ui/typography'
import { Icon } from '@/components/ui/icon'
import { Link } from '@/components/ui/link'
import { ReadToggleButton } from '@/components/ui/read-toggle-button'
import { CSSProperties } from 'react'

export interface ScpListItemProps {
  id: string          // Database UUID (for ReadToggleButton)
  scpId: string       // Display ID (e.g., "SCP-001")
  title: string
  rating: number
  isRead: boolean
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
      variant="bordered"
      accentBorder={isRead}
      padding="sm"
      className={className}
    >
      <div style={rowStyle}>
        <div style={leftStyle}>
          <Link href={href} variant="default" style={titleLinkStyle}>
            <Heading level={4} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </Heading>
          </Link>
          <div style={metaStyle}>
            <Icon name="star" size="sm" className="text-[var(--color-text-secondary)]" />
            <Text variant="secondary" size="sm">{rating}</Text>
            <Text variant="muted" size="sm">•</Text>
            <Mono size="sm">{scpId}</Mono>
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ReadToggleButton
            scpId={id}
            isRead={isRead}
            userId={userId ?? null}
            size="sm"
          />
        </div>
      </div>
    </Card>
  )
}
