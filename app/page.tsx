import { Metadata } from 'next'
import { createStaticClient } from '@/lib/supabase/static'
import { logger } from '@/lib/logger'
import { getDailyIndex } from '@/lib/utils/daily-scp'
import { getSiteUrl } from '@/lib/utils/site-url'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Heading, Text } from '@/components/ui/typography'
import { Stack } from '@/components/ui/stack'
import { HomeContent } from './home-content'

export const revalidate = 300 // ISR: regenerate every 5 minutes

export const metadata: Metadata = {
  title: 'SCP Reader — Track Your SCP Foundation Reading Progress',
  description: "Track your reading progress through 9,800+ SCP Foundation entries. Browse by series, bookmark your favorites, and never lose your place.",
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    siteName: 'SCP Reader',
    type: 'website',
    title: 'SCP Reader — Track Your SCP Foundation Reading Progress',
    description: "Track your reading progress through 9,800+ SCP Foundation entries. Browse by series, bookmark your favorites, and never lose your place.",
    url: getSiteUrl(),
  },
  twitter: {
    card: 'summary',
    title: 'SCP Reader — Track Your SCP Foundation Reading Progress',
    description: "Track your reading progress through 9,800+ SCP Foundation entries. Browse by series, bookmark your favorites, and never lose your place.",
  },
}

interface SeriesProgress {
  series: string
  total: number
  read: number
}

async function getSeriesProgress(): Promise<SeriesProgress[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase.rpc('get_series_progress', {
    user_id_param: null,
  })

  if (error) {
    logger.error('Failed to fetch series progress', {
      error: error instanceof Error ? error.message : String(error),
      context: 'getSeriesProgress (static)',
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
  const supabase = createStaticClient()

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
  const [seriesProgress, dailyScp] = await Promise.all([
    getSeriesProgress(),
    getDailyFeaturedScp(),
  ])

  return (
    <Main>
      <Container size="lg">
        {/* Themed header */}
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

        <HomeContent seriesProgress={seriesProgress} dailyScp={dailyScp} />
      </Container>
    </Main>
  )
}
