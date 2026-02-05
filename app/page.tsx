import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { seriesToRoman } from '@/lib/utils/series'
import { getDailyIndex } from '@/lib/utils/daily-scp'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/typography'
import { Text } from '@/components/ui/typography'
import { Stack } from '@/components/ui/stack'
import { Grid } from '@/components/ui/grid'
import { SeriesCard } from '@/components/ui/series-card'
import { DailyFeaturedSection } from '@/components/ui/daily-featured-section'
import { RecentlyViewedSection, type RecentlyViewedItem } from '@/components/ui/recently-viewed-section'

export const dynamic = 'force-dynamic'

interface SeriesProgress {
  series: string
  total: number
  read: number
}

type RecentlyViewedRow = {
  viewed_at: string
  scps: {
    scp_id: string
    title: string
  } | null
}

async function getRecentlyViewed(userId: string): Promise<RecentlyViewedItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_recently_viewed')
    .select(`
      viewed_at,
      scps (
        scp_id,
        title
      )
    `)
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(5)

  if (error || !data) {
    if (error) {
      logger.error('Failed to fetch recently viewed', {
        error: error.message,
        userId,
      })
    }
    return []
  }

  return (data as unknown as RecentlyViewedRow[])
    .filter((row) => row.scps)
    .map((row) => ({
      scp_id: row.scps!.scp_id,
      title: row.scps!.title,
      viewed_at: row.viewed_at,
    }))
}

async function getSeriesProgress(userId: string | undefined): Promise<SeriesProgress[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_series_progress', {
    user_id_param: userId ?? null,
  })

  if (error) {
    logger.error('Failed to fetch series progress', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      context: 'getSeriesProgress'
    })
    return []
  }

  if (!data) return []

  return data.sort((a: SeriesProgress, b: SeriesProgress) => {
    const aNum = parseInt(a.series.replace('series-', ''))
    const bNum = parseInt(b.series.replace('series-', ''))
    return aNum - bNum
  })
}

async function getDailyFeaturedScp(): Promise<{
  scp_id: string
  title: string
  rating: number | null
  series: string
} | null> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('scps')
    .select('*', { count: 'exact', head: true })

  if (!count) return null

  const index = getDailyIndex(count)

  const { data, error } = await supabase
    .from('scps')
    .select('scp_id, title, rating, series')
    .order('scp_number', { ascending: true })
    .range(index, index)
    .single()

  if (error) {
    logger.error('Failed to fetch daily featured SCP', { error: error.message })
    return null
  }
  return data
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [recentlyViewed, seriesProgress, dailyScp] = await Promise.all([
    user ? getRecentlyViewed(user.id) : Promise.resolve([]),
    getSeriesProgress(user?.id),
    getDailyFeaturedScp(),
  ])

  return (
    <Main>
      <Container size="lg">
        {/* 1. Themed header — inspired by splash but compact */}
        <section style={{ marginBottom: 'var(--spacing-6)' }}>
          <Stack direction="horizontal" align="start" gap="normal">
            <Heading level={1} className="leading-tight tracking-tight">
              SECURE{'\n'}CONTAIN{'\n'}PROTECT
            </Heading>
            <div
              style={{
                width: 'var(--spacing-1)',
                height: 80,
                marginTop: 'var(--spacing-1)',
                flexShrink: 0,
                backgroundColor: 'var(--color-accent)',
              }}
            />
          </Stack>
          <Text variant="secondary" size="lg" style={{ marginTop: 'var(--spacing-4)' }}>
            Track your progress through the SCP Foundation database.
          </Text>
        </section>

        {/* 2. Daily Featured */}
        <DailyFeaturedSection scp={dailyScp} />

        {/* 3. Series Grid */}
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

        {/* 4. Recently Viewed */}
        <RecentlyViewedSection items={recentlyViewed} isAuthenticated={!!user} />
      </Container>
    </Main>
  )
}
