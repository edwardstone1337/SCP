'use client'

import { Card } from '@/components/ui/card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { ProgressText } from '@/components/ui/progress-text'
import { Mono } from '@/components/ui/typography'
import { CSSProperties } from 'react'

export interface RangeListItemProps {
  rangeLabel: string
  total: number
  read: number
  href: string
  className?: string
}

export function RangeListItem({
  rangeLabel,
  total,
  read,
  href,
  className,
}: RangeListItemProps) {
  const percentage = total > 0 ? Math.round((read / total) * 100) : 0
  const hasProgress = percentage > 0

  const rowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3)',
  }

  const rightStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    flexShrink: 0,
  }

  return (
    <Card
      variant="interactive"
      accentBorder={hasProgress}
      padding="sm"
      href={href}
      className={className}
    >
      <div style={rowStyle}>
        <Mono size="sm">{rangeLabel}</Mono>
        <div style={rightStyle}>
          <ProgressRing size="xs" value={percentage} />
          <ProgressText read={read} total={total} size="sm" />
        </div>
      </div>
    </Card>
  )
}
