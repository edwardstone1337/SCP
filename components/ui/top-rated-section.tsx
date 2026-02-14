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
    <>
      <style>{`
        /* Grid column overrides - mobile to desktop */
        .top-rated-grid-wrapper .grid {
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .top-rated-grid-wrapper .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .top-rated-grid-wrapper .grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        /* Hide 4th card at md breakpoint (3-column layout) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .top-rated-grid-wrapper .grid > *:nth-child(4) {
            display: none;
          }
        }

        /* Card content layout - vertical by default (md+) */
        .top-rated-card-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-1);
        }

        /* Horizontal layout on mobile */
        @media (max-width: 767px) {
          .top-rated-card-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: var(--spacing-3);
          }

          .top-rated-card-content-left {
            min-width: 0;
            flex: 1;
          }

          .top-rated-card-content-right {
            flex-shrink: 0;
          }
        }
      `}</style>

      <section style={{ marginBottom: 'var(--spacing-6)' }}>
        <Stack direction="vertical" gap="normal">
          {/* Heading row with inline button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
            }}
          >
            <Heading
              level={2}
              className="text-sm font-normal text-[var(--color-text-secondary)]"
              style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Notable Anomalies
            </Heading>
            <Button variant="secondary" href="/top-rated" style={{ fontSize: 'var(--font-size-sm)' }}>
              View All
            </Button>
          </div>

          {/* Responsive grid */}
          <div className="top-rated-grid-wrapper">
            <Grid cols="auto">
              {scps.map((scp, index) => (
                <Link
                  key={scp.scp_id}
                  href={`/scp/${scp.scp_id}?context=top-rated&rank=${index + 1}`}
                  variant="default"
                >
                  <Card variant="interactive" padding="md">
                    <div className="top-rated-card-content">
                      <div className="top-rated-card-content-left">
                        <Mono size="sm">{scp.scp_id}</Mono>
                        <Heading level={3}>{scp.title}</Heading>
                      </div>
                      <div className="top-rated-card-content-right">
                        <Text size="sm" variant="secondary">
                          Rating: {scp.rating}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>
          </div>
        </Stack>
      </section>
    </>
  )
}
