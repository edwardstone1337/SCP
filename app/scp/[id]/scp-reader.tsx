'use client'

import { useScpContent } from '@/lib/hooks/use-scp-content'
import { sanitizeHtml } from '@/lib/utils/sanitize'
import { getRange } from '@/lib/utils/series'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { Heading, Mono, Text } from '@/components/ui/typography'
import { Link } from '@/components/ui/link'
import { Main } from '@/components/ui/main'
import { ReadToggleButton } from '@/components/ui/read-toggle-button'
import { Stack } from '@/components/ui/stack'

interface ScpReaderProps {
  scp: {
    id: string
    scp_id: string
    scp_number: number
    title: string
    rating: number
    series: string
    url: string
    is_read: boolean
  }
  userId?: string
}

export function ScpReader({ scp, userId }: ScpReaderProps) {
  const { data: content, isLoading, error: contentError } = useScpContent(scp.series, scp.scp_id)

  const backHref = `/series/${scp.series}/${getRange(scp.scp_number)}`

  return (
    <Main>
      {/* Header */}
      <header
        style={{
          borderBottom: 'var(--border-width-normal) solid var(--color-grey-8)',
          backgroundColor: 'var(--color-grey-9)',
          padding: 'var(--spacing-4) 0',
        }}
      >
        <Container size="lg">
          <Stack direction="vertical" gap="normal">
            <Link href={backHref} variant="back">
              ← Back
            </Link>
            <Stack direction="horizontal" justify="between" align="start" gap="loose">
              <Stack direction="vertical" gap="tight">
                <Heading level={1}>{scp.title}</Heading>
                <Stack direction="horizontal" gap="tight" align="center">
                  <Text variant="secondary" size="sm">
                    ★ {scp.rating}
                  </Text>
                  <Text variant="secondary" size="sm">
                    •
                  </Text>
                  <Mono size="sm">{scp.scp_id}</Mono>
                </Stack>
              </Stack>
              <ReadToggleButton
                scpId={scp.id}
                isRead={scp.is_read}
                userId={userId ?? null}
                size="sm"
              />
            </Stack>
          </Stack>
        </Container>
      </header>

      {/* Content */}
      <div style={{ marginTop: 'var(--spacing-4)' }}>
        <Container size="lg">
          {isLoading && (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--spacing-12) 0',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  animation: 'spin 1s linear infinite',
                  width: '2rem',
                  height: '2rem',
                  border: '2px solid var(--color-grey-8)',
                  borderTopColor: 'var(--color-accent)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
              <Text variant="secondary" size="sm" style={{ marginTop: 'var(--spacing-4)', display: 'block' }}>
                Loading content...
              </Text>
            </div>
          )}

          {contentError && (
            <Card variant="bordered" accentBorder padding="md">
              <Text style={{ color: 'var(--color-red-7)' }}>
                Failed to load content. Please try again.
              </Text>
            </Card>
          )}

          {content && (
            <Card padding="lg">
              <div
                className="scp-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.raw_content) }}
              />
            </Card>
          )}
        </Container>
      </div>
    </Main>
  )
}
