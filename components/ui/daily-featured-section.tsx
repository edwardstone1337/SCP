'use client'

import { Stack } from '@/components/ui/stack'
import { Heading, Mono, Text } from '@/components/ui/typography'
import { SectionLabel } from '@/components/ui/section-label'
import { Card } from '@/components/ui/card'
import { BookmarkButton } from '@/components/ui/bookmark-button'
import { ReadToggleButton } from '@/components/ui/read-toggle-button'
import { seriesToRoman } from '@/lib/utils/series'

export interface DailyFeaturedSectionProps {
  scp: {
    id: string
    scp_id: string
    title: string
    rating: number | null
    series: string
    is_read?: boolean
    is_bookmarked?: boolean
  } | null
  userId?: string | null
}

export function DailyFeaturedSection({ scp, userId }: DailyFeaturedSectionProps) {
  if (scp === null) return null

  return (
    <section style={{ marginBottom: 'var(--spacing-6)' }}>
      <Stack direction="vertical" gap="normal">
        <SectionLabel>Daily Briefing</SectionLabel>
        <Card variant="interactive" padding="lg" href={`/scp/${scp.scp_id}`}>
          <Stack direction="vertical" gap="normal">
            <Mono size="lg">{scp.scp_id}</Mono>
            {scp.title && scp.title !== scp.scp_id && (
              <Heading level={3}>{scp.title}</Heading>
            )}
            <Stack direction="horizontal" gap="normal">
              {scp.rating !== null && (
                <Text size="sm" variant="secondary">
                  Rating: {scp.rating}
                </Text>
              )}
              <Text size="sm" variant="secondary">
                Series {seriesToRoman(scp.series) ?? scp.series}
              </Text>
            </Stack>
            {userId && (
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
                <BookmarkButton
                  scpId={scp.id}
                  scpRouteId={scp.scp_id}
                  isBookmarked={scp.is_bookmarked ?? false}
                  userId={userId}
                  size="sm"
                />
                <ReadToggleButton
                  scpId={scp.id}
                  routeId={scp.scp_id}
                  isRead={scp.is_read ?? false}
                  userId={userId}
                  size="sm"
                />
              </div>
            )}
          </Stack>
        </Card>
      </Stack>
    </section>
  )
}
