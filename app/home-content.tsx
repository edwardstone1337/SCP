'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { seriesToRoman } from '@/lib/utils/series'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { Heading } from '@/components/ui/typography'
import { SeriesCard } from '@/components/ui/series-card'
import { DailyFeaturedSection } from '@/components/ui/daily-featured-section'
import { TopRatedSection, type TopRatedScp } from '@/components/ui/top-rated-section'
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
  scp_id: string
  title: string
  rating: number | null
  series: string
}

interface HomeContentProps {
  seriesProgress: SeriesProgress[]
  dailyScp: DailyScp | null
  topRated: TopRatedScp[]
}

export function HomeContent({ seriesProgress: initialProgress, dailyScp, topRated }: HomeContentProps) {
  const searchParams = useSearchParams()
  const [seriesProgress, setSeriesProgress] = useState(initialProgress)
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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

        const [progressRes, rvRes] = await Promise.all([
          supabase.rpc('get_series_progress', { user_id_param: user.id }),
          supabase
            .from('user_recently_viewed')
            .select('viewed_at, scps (scp_id, title)')
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

        if (rvRes.data) {
          const items = (rvRes.data as unknown as Array<{
            viewed_at: string
            scps: { scp_id: string; title: string } | null
          }>)
            .filter((row) => row.scps)
            .map((row) => ({
              scp_id: row.scps!.scp_id,
              title: row.scps!.title,
              viewed_at: row.viewed_at,
            }))
          setRecentlyViewed(items)
        }
      } catch (error) {
        if (!mounted) return
        logger.error('Failed to load user data', { error, component: 'HomeContent' })
      }
    }

    loadUserData()
    return () => { mounted = false }
  }, [])

  return (
    <>
      {showAccountDeletedToast && (
        <Toast
          message="Your account has been successfully deleted"
          onDismiss={() => setShowAccountDeletedToast(false)}
        />
      )}

      {/* Daily Featured */}
      <DailyFeaturedSection scp={dailyScp} />

      <SectionDivider />

      {/* Top Rated */}
      <TopRatedSection scps={topRated} />

      <SectionDivider />

      {/* Series Grid */}
      <section style={{ marginBottom: 'var(--spacing-6)' }}>
        <Stack direction="vertical" gap="normal">
          <Heading
            level={2}
            className="text-sm font-normal text-[var(--color-text-secondary)]"
            style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Containment Series
          </Heading>
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

      <SectionDivider />

      {/* New to the Foundation - only show for unauthenticated users */}
      <NewToFoundationSection />

      {/* Recently Viewed - only show for authenticated users */}
      {isAuthenticated && (
        <RecentlyViewedSection items={recentlyViewed} isAuthenticated={isAuthenticated} />
      )}
    </>
  )
}
