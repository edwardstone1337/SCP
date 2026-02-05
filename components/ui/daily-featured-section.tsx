import { Stack } from '@/components/ui/stack'
import { Heading, Mono, Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { seriesToRoman } from '@/lib/utils/series'

export interface DailyFeaturedSectionProps {
  scp: {
    scp_id: string
    title: string
    rating: number | null
    series: string
  } | null
}

export function DailyFeaturedSection({ scp }: DailyFeaturedSectionProps) {
  if (scp === null) return null

  return (
    <section style={{ marginBottom: 'var(--spacing-6)' }}>
      <Stack direction="vertical" gap="normal">
        <Text
          size="sm"
          variant="secondary"
          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          Today&apos;s Featured SCP
        </Text>
        <Link href={`/scp/${scp.scp_id}`} variant="default">
          <Card variant="interactive" padding="lg">
            <Stack direction="vertical" gap="normal">
              <Mono size="sm">{scp.scp_id}</Mono>
              <Heading level={2}>{scp.title}</Heading>
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
            </Stack>
          </Card>
        </Link>
      </Stack>
    </section>
  )
}
