'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
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

export function TopRatedContent({ scps: initialScps }: TopRatedContentProps) {
  const [scps, setScps] = useState(initialScps)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { openModal } = useModal()

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return
        setIsAuthenticated(true)
        setUserId(user.id)

        const scpIds = initialScps.map((s) => s.id)

        const [progressRes, bookmarkRes] = await Promise.all([
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
        ])

        if (!mounted) return

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
      } catch (error) {
        if (!mounted) return
        logger.error('Failed to load user data', { error, component: 'TopRatedContent' })
      }
    }

    loadUserData()
    return () => { mounted = false }
  }, [initialScps])

  const queryString = searchParams.toString()
  const redirectPath = pathname || '/top-rated'
  const redirectPathWithQuery = `${redirectPath}${queryString ? `?${queryString}` : ''}`
  const openSignInModal = () => {
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
              <Button
                variant="secondary"
                size="sm"
                onClick={openSignInModal}
              >
                Sign In
              </Button>
            </Stack>
          </Card>
        ) : (
          <Stack direction="horizontal" justify="center">
            <Button variant="secondary" href="/series/series-1">
              Continue reading from the beginning
            </Button>
          </Stack>
        )}
      </section>
    </>
  )
}
