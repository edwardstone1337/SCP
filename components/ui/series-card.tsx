'use client'

import { Card } from '@/components/ui/card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { ProgressText } from '@/components/ui/progress-text'
import { Heading } from '@/components/ui/typography'
import { Stack } from '@/components/ui/stack'
import { CSSProperties } from 'react'

export interface SeriesCardProps {
  series: string
  roman: string
  total: number
  read: number
  href: string
  className?: string
}

export function SeriesCard({
  series,
  roman,
  total,
  read,
  href,
  className,
}: SeriesCardProps) {
  const percentage = total > 0 ? Math.round((read / total) * 100) : 0

  const contentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  }

  return (
    <Card
      variant="interactive"
      padding="md"
      href={href}
      className={className}
    >
      <div style={contentStyle}>
        <ProgressRing size="md" value={percentage}>
          <Heading level={3}>{roman}</Heading>
        </ProgressRing>
        <Stack gap="tight" style={{ marginTop: 'var(--spacing-2)', alignItems: 'center' }}>
          <ProgressText read={read} total={total} />
        </Stack>
      </div>
    </Card>
  )
}
