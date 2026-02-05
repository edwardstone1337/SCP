'use client'

import { useEffect, useRef } from 'react'
import { useContentLinks } from '@/lib/hooks/use-content-links'
import { useFootnotes } from '@/lib/hooks/use-footnotes'
import { useScpContent } from '@/lib/hooks/use-scp-content'
import { getLoadingMessage } from '@/lib/utils/loading-messages'
import { sanitizeHtml } from '@/lib/utils/sanitize'
import { getRange, seriesToRoman } from '@/lib/utils/series'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { Heading, Mono, Text } from '@/components/ui/typography'
import { Main } from '@/components/ui/main'
import { BookmarkButton } from '@/components/ui/bookmark-button'
import { ReadToggleButton } from '@/components/ui/read-toggle-button'
import { Stack } from '@/components/ui/stack'
import { BackToTop } from '@/components/ui/back-to-top'
import { recordView } from './actions'

interface AdjacentScp {
  scp_id: string
  title: string
}

interface ScpReaderProps {
  scp: {
    id: string
    scp_id: string
    scp_number: number
    title: string
    rating: number
    series: string
    url: string
    content_file: string | null
    is_read: boolean
    is_bookmarked: boolean
  }
  userId?: string
  prev?: AdjacentScp | null
  next?: AdjacentScp | null
}

export function ScpReader({ scp, userId, prev, next }: ScpReaderProps) {
  const hasRecordedView = useRef(false)
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const { data: content, isLoading, error: contentError } = useScpContent(
    scp.content_file,
    scp.scp_id
  )

  useFootnotes(contentContainerRef, !!content)
  useContentLinks(contentContainerRef, !!content)

  useEffect(() => {
    if (!hasRecordedView.current) {
      hasRecordedView.current = true
      recordView(scp.id)
    }
  }, [scp.id])

  const roman = seriesToRoman(scp.series)
  const rangeStart = getRange(scp.scp_number)
  const rangeEnd = rangeStart + 99
  const rangeLabel = `${String(rangeStart).padStart(3, '0')}-${String(rangeEnd).padStart(3, '0')}`

  const breadcrumbItems = [
    { label: 'Series', href: '/' },
    { label: roman ? `Series ${roman}` : scp.series, href: `/series/${scp.series}` },
    { label: rangeLabel, href: `/series/${scp.series}/${rangeStart}` },
    { label: scp.scp_id },
  ]

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
            <Breadcrumb items={breadcrumbItems} />
            <Stack direction="horizontal" justify="between" align="center">
              {prev ? (
                <Button variant="secondary" size="sm" href={`/scp/${prev.scp_id}`}>
                  ← Previous
                </Button>
              ) : (
                <div />
              )}
              {next ? (
                <Button variant="secondary" size="sm" href={`/scp/${next.scp_id}`}>
                  Next →
                </Button>
              ) : (
                <div />
              )}
            </Stack>
            <div className="reader-header-row">
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
              <div className="reader-header-actions">
                <Stack direction="horizontal" gap="tight">
                  <BookmarkButton
                    scpId={scp.id}
                    scpRouteId={scp.scp_id}
                    isBookmarked={scp.is_bookmarked}
                    userId={userId ?? null}
                    size="sm"
                  />
                  <ReadToggleButton
                    scpId={scp.id}
                    routeId={scp.scp_id}
                    isRead={scp.is_read}
                    userId={userId ?? null}
                    size="sm"
                  />
                </Stack>
              </div>
            </div>
          </Stack>
        </Container>
      </header>

      {/* Content */}
      <div style={{ marginTop: 'var(--spacing-4)' }}>
        <Container size="lg">
          {isLoading && (
            <div
              role="status"
              aria-label="Loading content"
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
                {getLoadingMessage('reader')}
              </Text>
            </div>
          )}

          {!scp.content_file && (
            <Card variant="bordered" padding="md">
              <Text variant="secondary">
                Content is not available for this entry.
              </Text>
            </Card>
          )}

          {contentError && (
            <div role="alert">
              <Card variant="bordered" accentBorder padding="md">
                <Text style={{ color: 'var(--color-red-7)' }}>
                  Failed to load content. Please try again.
                </Text>
              </Card>
            </div>
          )}

          {content && (
            <>
              <Card padding="lg">
                <div
                  ref={contentContainerRef}
                  className="scp-content"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.raw_content) }}
                />
              </Card>
              <Stack direction="horizontal" gap="tight" justify="center" style={{ marginTop: 'var(--spacing-4)' }}>
                <BookmarkButton
                  scpId={scp.id}
                  scpRouteId={scp.scp_id}
                  isBookmarked={scp.is_bookmarked}
                  userId={userId ?? null}
                  size="sm"
                />
                <ReadToggleButton
                  scpId={scp.id}
                  routeId={scp.scp_id}
                  isRead={scp.is_read}
                  userId={userId ?? null}
                  size="sm"
                />
              </Stack>
              <Stack
                direction="horizontal"
                justify="between"
                align="center"
                style={{ marginTop: 'var(--spacing-4)' }}
              >
                {prev ? (
                  <Button variant="secondary" size="sm" href={`/scp/${prev.scp_id}`}>
                    ← Previous
                  </Button>
                ) : (
                  <div />
                )}
                {next ? (
                  <Button variant="secondary" size="sm" href={`/scp/${next.scp_id}`}>
                    Next →
                  </Button>
                ) : (
                  <div />
                )}
              </Stack>
            </>
          )}
        </Container>
      </div>
      <BackToTop threshold={400} />
    </Main>
  )
}
