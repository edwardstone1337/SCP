'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ScpListWithToggle } from '@/components/ui/scp-list-with-toggle'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { useModal } from '@/components/ui/modal-provider'
import { SignInPanel } from '@/components/ui/sign-in-panel'
import { trackSignInModalOpen } from '@/lib/analytics'

interface ScpItem {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  is_read: boolean
  is_bookmarked: boolean
  rank: number
}

interface TopRatedContentProps {
  scps: ScpItem[]
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

export function TopRatedContent({ scps: initialScps }: TopRatedContentProps) {
  const [scps, setScps] = useState(initialScps)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { openModal } = useModal()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setIsAuthenticated(true)
      setUserId(user.id)

      const scpIds = initialScps.map((s) => s.id)

      Promise.all([
        supabase
          .from('user_progress')
          .select('scp_id, is_read')
          .eq('user_id', user.id)
          .in('scp_id', scpIds),
        supabase
          .from('user_bookmarks')
          .select('scp_id')
          .eq('user_id', user.id)
          .in('scp_id', scpIds),
      ]).then(([progressRes, bookmarkRes]) => {
        const progressData = progressRes.data
        const bookmarkData = bookmarkRes.data
        const readMap = new Map(progressData?.map((p) => [p.scp_id, p.is_read]) ?? [])
        const bookmarkSet = new Set(bookmarkData?.map((b) => b.scp_id) ?? [])

        setScps(
          initialScps.map((scp) => ({
            ...scp,
            is_read: readMap.get(scp.id) ?? false,
            is_bookmarked: bookmarkSet.has(scp.id),
            rank: scp.rank, // Preserve rank from initial data
          }))
        )
      })
    })
  }, [initialScps])

  const queryString = searchParams.toString()
  const redirectPath = pathname || '/top-rated'
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
    trackSignInModalOpen('top_rated')
    openModal(
      <SignInPanel context="modal" redirectTo={redirectTo} triggerSource="top_rated" />,
      'Request Archive Access'
    )
  }

  return (
    <>
      <ScpListWithToggle
        scps={scps}
        isAuthenticated={isAuthenticated}
        userId={userId ?? undefined}
        getItemHref={(scp) => `/scp/${scp.scp_id}?context=top-rated&rank=${(scp as ScpItem).rank}`}
        hideSortDropdown={true}
        defaultSort="rating-desc"
      />

      {/* Bottom CTA */}
      <section style={{ marginTop: 'var(--spacing-6)' }}>
        {!isAuthenticated ? (
          <Card variant="bordered" padding="lg">
            <Stack direction="vertical" gap="normal" align="center">
              <Text variant="secondary" style={{ textAlign: 'center' }}>
                Sign in to track your progress through the Top 100
              </Text>
              <NextLink
                href={signInHref}
                onClick={handleSignInClick}
                style={signInLinkStyle}
                data-variant="secondary"
              >
                Sign In
              </NextLink>
            </Stack>
          </Card>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="secondary" href="/series/series-1">
              Continue reading from the beginning
            </Button>
          </div>
        )}
      </section>
    </>
  )
}
