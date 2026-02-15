'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { seriesToRoman } from '@/lib/utils/series'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { SectionLabel } from '@/components/ui/section-label'
import { SeriesCard } from '@/components/ui/series-card'
import { DailyFeaturedSection } from '@/components/ui/daily-featured-section'
import { TopRatedSection } from '@/components/ui/top-rated-section'
import { RecentlyViewedSection, type RecentlyViewedItem } from '@/components/ui/recently-viewed-section'
import { NewToFoundationSection } from '@/components/ui/new-to-foundation-section'
import { Toast } from '@/components/ui/toast'
import { SectionDivider } from '@/components/ui/section-divider'

interface SeriesProgress {
  series: string
  total: number
  read: number
}

interface DailyScp {
  id: string
  scp_id: string
  title: string
  rating: number | null
  series: string
}

interface HomeTopRatedScp {
  id: string
  scp_id: string
  title: string
  rating: number
}

interface EnrichedDailyScp extends DailyScp {
  is_read: boolean
  is_bookmarked: boolean
}

interface EnrichedTopRatedScp extends HomeTopRatedScp {
  is_read: boolean
  is_bookmarked: boolean
}

interface EnrichedRecentlyViewedItem extends RecentlyViewedItem {
  id: string
  is_read: boolean
  is_bookmarked: boolean
}

interface HomeContentProps {
  seriesProgress: SeriesProgress[]
  dailyScp: DailyScp | null
  topRated: HomeTopRatedScp[]
}

export function HomeContent({ seriesProgress: initialProgress, dailyScp, topRated }: HomeContentProps) {
  const searchParams = useSearchParams()
  const [seriesProgress, setSeriesProgress] = useState(initialProgress)
  const [recentlyViewed, setRecentlyViewed] = useState<EnrichedRecentlyViewedItem[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [enrichedDailyScp, setEnrichedDailyScp] = useState<EnrichedDailyScp | null>(
    dailyScp ? { ...dailyScp, is_read: false, is_bookmarked: false } : null
  )
  const [enrichedTopRated, setEnrichedTopRated] = useState<EnrichedTopRatedScp[]>(
    topRated.map((scp) => ({ ...scp, is_read: false, is_bookmarked: false }))
  )
  const [showAccountDeletedToast, setShowAccountDeletedToast] = useState(false)

  useEffect(() => {
    if (searchParams.get('account_deleted') === 'true') {
      setShowAccountDeletedToast(true)
      window.history.replaceState(null, '', '/')
    }
  }, [searchParams])

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return
        setIsAuthenticated(true)
        setUserId(user.id)

        const [progressRes, rvRes] = await Promise.all([
          supabase.rpc('get_series_progress', { user_id_param: user.id }),
          supabase
            .from('user_recently_viewed')
            .select('viewed_at, scps (id, scp_id, title)')
            .eq('user_id', user.id)
            .order('viewed_at', { ascending: false })
            .limit(5),
        ])

        if (!mounted) return

        if (progressRes.data && !progressRes.error) {
          const sorted = [...progressRes.data].sort((a: SeriesProgress, b: SeriesProgress) => {
            const aNum = parseInt(a.series.replace('series-', ''))
            const bNum = parseInt(b.series.replace('series-', ''))
            return aNum - bNum
          })
          setSeriesProgress(sorted)
        }

        // Parse recently viewed with UUID
        let rvItems: EnrichedRecentlyViewedItem[] = []
        if (rvRes.data) {
          rvItems = (rvRes.data as unknown as Array<{
            viewed_at: string
            scps: { id: string; scp_id: string; title: string } | null
          }>)
            .filter((row) => row.scps)
            .map((row) => ({
              id: row.scps!.id,
              scp_id: row.scps!.scp_id,
              title: row.scps!.title,
              viewed_at: row.viewed_at,
              is_read: false,
              is_bookmarked: false,
            }))
        }

        // Collect all SCP UUIDs for bookmark/read state
        const allScpIds: string[] = []
        if (dailyScp?.id) allScpIds.push(dailyScp.id)
        topRated.forEach((scp) => allScpIds.push(scp.id))
        rvItems.forEach((item) => allScpIds.push(item.id))

        if (allScpIds.length > 0) {
          const [readRes, bookmarkRes] = await Promise.all([
            supabase
              .from('user_progress')
              .select('scp_id, is_read')
              .eq('user_id', user.id)
              .in('scp_id', allScpIds),
            supabase
              .from('user_bookmarks')
              .select('scp_id')
              .eq('user_id', user.id)
              .in('scp_id', allScpIds),
          ])

          if (!mounted) return

          const readMap = new Map(readRes.data?.map((p) => [p.scp_id, p.is_read]) ?? [])
          const bookmarkSet = new Set(bookmarkRes.data?.map((b) => b.scp_id) ?? [])

          setEnrichedDailyScp(
            dailyScp
              ? { ...dailyScp, is_read: readMap.get(dailyScp.id) ?? false, is_bookmarked: bookmarkSet.has(dailyScp.id) }
              : null
          )

          setEnrichedTopRated(
            topRated.map((scp) => ({
              ...scp,
              is_read: readMap.get(scp.id) ?? false,
              is_bookmarked: bookmarkSet.has(scp.id),
            }))
          )

          rvItems = rvItems.map((item) => ({
            ...item,
            is_read: readMap.get(item.id) ?? false,
            is_bookmarked: bookmarkSet.has(item.id),
          }))
        }

        if (!mounted) return
        setRecentlyViewed(rvItems)
      } catch (error) {
        if (!mounted) return
        logger.error('Failed to load user data', { error, component: 'HomeContent' })
      }
    }

    loadUserData()
    return () => { mounted = false }
  }, [dailyScp, topRated])

  return (
    <>
      {showAccountDeletedToast && (
        <Toast
          message="Your account has been successfully deleted"
          onDismiss={() => setShowAccountDeletedToast(false)}
        />
      )}

      {/* Daily Featured */}
      <DailyFeaturedSection scp={enrichedDailyScp} userId={userId} />

      <SectionDivider />

      {/* Auth: Recently Viewed (moved up, below Daily) */}
      {isAuthenticated && (
        <>
          <RecentlyViewedSection items={recentlyViewed} isAuthenticated={isAuthenticated} userId={userId} />
          <SectionDivider />
        </>
      )}

      {/* Guest: Notable Anomalies */}
      {!isAuthenticated && (
        <>
          <TopRatedSection scps={enrichedTopRated} />
          <SectionDivider />
        </>
      )}

      {/* Series Grid */}
      <section style={{ marginBottom: 'var(--spacing-6)' }}>
        <Stack direction="vertical" gap="normal">
          <SectionLabel>Containment Series</SectionLabel>
          <Grid cols="auto">
            {seriesProgress.map(({ series, total, read }) => {
              const roman = seriesToRoman(series)
              if (!roman) return null
              return (
                <SeriesCard
                  key={series}
                  series={series}
                  roman={roman}
                  total={total}
                  read={read}
                  href={`/series/${series}`}
                  progressLabel={isAuthenticated ? 'accessed' : 'catalogued'}
                />
              )
            })}
          </Grid>
        </Stack>
      </section>

      {/* Guest: New to the Foundation */}
      {!isAuthenticated && (
        <>
          <SectionDivider />
          <NewToFoundationSection />
        </>
      )}
    </>
  )
}
