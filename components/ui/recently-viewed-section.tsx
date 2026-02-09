'use client'

import NextLink from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Stack } from '@/components/ui/stack'
import { Mono, Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { useModal } from '@/components/ui/modal-provider'
import { SignInPanel } from '@/components/ui/sign-in-panel'
import { trackSignInModalOpen } from '@/lib/analytics'

export interface RecentlyViewedItem {
  scp_id: string    // e.g. "SCP-173"
  title: string
  viewed_at: string
}

interface RecentlyViewedSectionProps {
  items: RecentlyViewedItem[]
  isAuthenticated: boolean
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

export function RecentlyViewedSection({ items, isAuthenticated }: RecentlyViewedSectionProps) {
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
          <Text size="sm" variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recently Viewed
          </Text>
          <Text variant="secondary">Sign in to track your reading history.</Text>
          <NextLink
            href={signInHref}
            onClick={handleSignInClick}
            style={signInLinkStyle}
            data-variant="secondary"
          >
            Sign In
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
          <Text size="sm" variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recently Viewed
          </Text>
          <Text variant="secondary">Articles you read will appear here.</Text>
        </Stack>
      </section>
    )
  }

  // Authenticated with items
  return (
    <section style={{ marginBottom: 'var(--spacing-6)' }}>
      <Stack direction="vertical" gap="normal">
        <Text size="sm" variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Recently Viewed
        </Text>
        <Stack direction="vertical" gap="tight">
          {items.map((item) => (
            <Link key={item.scp_id} href={`/scp/${item.scp_id}`} variant="default">
              <Card variant="interactive" padding="sm">
                <Stack direction="horizontal" align="center" justify="between">
                  <Stack direction="vertical" gap="tight">
                    <Text>{item.title}</Text>
                    <Mono size="sm">{item.scp_id}</Mono>
                  </Stack>
                </Stack>
              </Card>
            </Link>
          ))}
        </Stack>
      </Stack>
    </section>
  )
}
