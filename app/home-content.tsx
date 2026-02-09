'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { seriesToRoman } from '@/lib/utils/series'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { SeriesCard } from '@/components/ui/series-card'
import { DailyFeaturedSection } from '@/components/ui/daily-featured-section'
import { RecentlyViewedSection, type RecentlyViewedItem } from '@/components/ui/recently-viewed-section'

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
}

export function HomeContent({ seriesProgress: initialProgress, dailyScp }: HomeContentProps) {
  const [seriesProgress, setSeriesProgress] = useState(initialProgress)
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setIsAuthenticated(true)

      // Fetch user's series progress
      supabase.rpc('get_series_progress', {
        user_id_param: user.id,
      }).then(({ data, error }) => {
        if (error || !data) return
        const sorted = [...data].sort((a: SeriesProgress, b: SeriesProgress) => {
          const aNum = parseInt(a.series.replace('series-', ''))
          const bNum = parseInt(b.series.replace('series-', ''))
          return aNum - bNum
        })
        setSeriesProgress(sorted)
      })

      // Fetch recently viewed
      supabase
        .from('user_recently_viewed')
        .select('viewed_at, scps (scp_id, title)')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(5)
        .then(({ data: rvData }) => {
          if (!rvData) return
          const items = (rvData as unknown as Array<{
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
        })
    })
  }, [])

  return (
    <>
      {/* Daily Featured */}
      <DailyFeaturedSection scp={dailyScp} />

      {/* Series Grid */}
      <section style={{ marginBottom: 'var(--spacing-6)' }}>
        <Stack direction="vertical" gap="normal">
          <Text size="sm" variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Series
          </Text>
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
                />
              )
            })}
          </Grid>
        </Stack>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewedSection items={recentlyViewed} isAuthenticated={isAuthenticated} />
    </>
  )
}
