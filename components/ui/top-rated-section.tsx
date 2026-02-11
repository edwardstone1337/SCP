import { Stack } from '@/components/ui/stack'
import { Heading, Mono, Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { Grid } from '@/components/ui/grid'
import { Button } from '@/components/ui/button'

export interface TopRatedScp {
  scp_id: string
  title: string
  rating: number
}

export interface TopRatedSectionProps {
  scps: TopRatedScp[]
}

export function TopRatedSection({ scps }: TopRatedSectionProps) {
  if (scps.length === 0) return null

  return (
    <section style={{ marginBottom: 'var(--spacing-6)' }}>
      <Stack direction="vertical" gap="normal">
        <Text
          size="sm"
          variant="secondary"
          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          Top Rated
        </Text>
        <Grid cols="auto">
          {scps.map((scp, index) => (
            <Link
              key={scp.scp_id}
              href={`/scp/${scp.scp_id}?context=top-rated&rank=${index + 1}`}
              variant="default"
            >
              <Card variant="interactive" padding="md">
                <Stack direction="vertical" gap="tight">
                  <Mono size="sm">{scp.scp_id}</Mono>
                  <Heading level={3}>{scp.title}</Heading>
                  <Text size="sm" variant="secondary">
                    Rating: {scp.rating}
                  </Text>
                </Stack>
              </Card>
            </Link>
          ))}
        </Grid>
        <div style={{ marginTop: 'var(--spacing-2)', display: 'flex', justifyContent: 'center' }}>
          <Button variant="secondary" href="/top-rated">
            View Top 100
          </Button>
        </div>
      </Stack>
    </section>
  )
}
