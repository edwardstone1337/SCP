'use client'

import NextLink from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Stack } from '@/components/ui/stack'
import { Mono, Text } from '@/components/ui/typography'
import { SectionLabel } from '@/components/ui/section-label'
import { Card } from '@/components/ui/card'
import { BookmarkButton } from '@/components/ui/bookmark-button'
import { ReadToggleButton } from '@/components/ui/read-toggle-button'
import { useModal } from '@/components/ui/modal-provider'
import { SignInPanel } from '@/components/ui/sign-in-panel'
import { trackSignInModalOpen } from '@/lib/analytics'

export interface RecentlyViewedItem {
  scp_id: string    // e.g. "SCP-173"
  title: string
  viewed_at: string
  id?: string
  is_read?: boolean
  is_bookmarked?: boolean
}

interface RecentlyViewedSectionProps {
  items: RecentlyViewedItem[]
  isAuthenticated: boolean
  userId?: string | null
}

const signInLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  fontWeight: 700,
  fontFamily: 'var(--font-family-sans)',
  transition: 'all var(--transition-base)',
  cursor: 'pointer',
  textDecoration: 'none',
  borderWidth: 'var(--border-width-normal)',
  borderStyle: 'solid',
  backgroundColor: 'transparent',
  color: 'var(--color-text-primary)',
  borderColor: 'var(--color-surface-border)',
  fontSize: 'var(--font-size-sm)',
  paddingLeft: 'var(--spacing-2)',
  paddingRight: 'var(--spacing-2)',
  paddingTop: 'var(--spacing-1)',
  paddingBottom: 'var(--spacing-1)',
  borderRadius: 'var(--radius-button)',
}

export function RecentlyViewedSection({ items, isAuthenticated, userId }: RecentlyViewedSectionProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { openModal } = useModal()
  const queryString = searchParams.toString()
  const redirectPath = pathname || '/recently-viewed'
  const redirectPathWithQuery = `${redirectPath}${queryString ? `?${queryString}` : ''}`
  const signInHref = `/login?redirect=${encodeURIComponent(redirectPathWithQuery)}`

  const handleSignInClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}${window.location.hash}`
        : redirectPathWithQuery
    trackSignInModalOpen('recently_viewed')
    openModal(
      <SignInPanel context="modal" redirectTo={redirectTo} triggerSource="recently_viewed" />,
      'Request Archive Access'
    )
  }

  // Guest: prompt to sign in
  if (!isAuthenticated) {
    return (
      <section style={{ marginBottom: 'var(--spacing-6)' }}>
        <Stack direction="vertical" gap="normal">
          <SectionLabel>Recent Files</SectionLabel>
          <Text variant="secondary">Clearance required to track accessed files.</Text>
          <NextLink
            href={signInHref}
            onClick={handleSignInClick}
            style={signInLinkStyle}
            data-variant="secondary"
          >
            Request Clearance
          </NextLink>
        </Stack>
      </section>
    )
  }

  // Authenticated but no items yet
  if (items.length === 0) {
    return (
      <section style={{ marginBottom: 'var(--spacing-6)' }}>
        <Stack direction="vertical" gap="normal">
          <SectionLabel>Recent Files</SectionLabel>
          <Text variant="secondary">Accessed files will appear here.</Text>
        </Stack>
      </section>
    )
  }

  // Authenticated with items — horizontal scroll
  return (
    <section style={{ marginBottom: 'var(--spacing-6)' }}>
      <Stack direction="vertical" gap="normal">
        <SectionLabel>Recent Files</SectionLabel>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-2)',
            overflowX: 'auto',
            paddingBottom: 'var(--spacing-1)',
            scrollbarWidth: 'thin',
          }}
        >
          {items.map((item) => (
            <div
              key={item.scp_id}
              style={{
                minWidth: '260px',
                maxWidth: '300px',
                flexShrink: 0,
              }}
            >
              <Card variant="interactive" padding="sm" href={`/scp/${item.scp_id}`}>
                <Stack direction="vertical" gap="tight">
                  <Mono size="base">{item.scp_id}</Mono>
                  {item.title && item.title !== item.scp_id && (
                    <Text size="sm" variant="secondary">{item.title}</Text>
                  )}
                  {userId && item.id && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-1)', marginTop: 'var(--spacing-1)' }}>
                      <BookmarkButton
                        scpId={item.id}
                        scpRouteId={item.scp_id}
                        isBookmarked={item.is_bookmarked ?? false}
                        userId={userId}
                        size="sm"
                      />
                      <ReadToggleButton
                        scpId={item.id}
                        routeId={item.scp_id}
                        isRead={item.is_read ?? false}
                        userId={userId}
                        size="sm"
                      />
                    </div>
                  )}
                </Stack>
              </Card>
            </div>
          ))}
        </div>
      </Stack>
    </section>
  )
}
