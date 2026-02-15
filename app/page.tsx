import { Metadata } from 'next'
import { createStaticClient } from '@/lib/supabase/static'
import { logger } from '@/lib/logger'
import { getDailyIndex } from '@/lib/utils/daily-scp'
import { getSiteUrl } from '@/lib/utils/site-url'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { generateHomepageJsonLd } from '@/lib/utils/json-ld'
import { HeroSection } from './hero-section'
import { HomeContent } from './home-content'

export const revalidate = 300 // ISR: regenerate every 5 minutes

export const metadata: Metadata = {
  title: 'SCP Reader — Track Your SCP Foundation Reading Progress',
  description: "Browse and track your reading progress through 9,300+ SCP Foundation entries. Discover anomalies by series, bookmark your favorites, and track every file you've accessed. A free reading companion for SCP completionists.",
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    siteName: 'SCP Reader',
    type: 'website',
    title: 'SCP Reader — Track Your SCP Foundation Reading Progress',
    description: "Browse and track your reading progress through 9,300+ SCP Foundation entries. Discover anomalies by series, bookmark your favorites, and track every file you've accessed. A free reading companion for SCP completionists.",
    url: getSiteUrl(),
  },
  twitter: {
    card: 'summary',
    title: 'SCP Reader — Track Your SCP Foundation Reading Progress',
    description: "Browse and track your reading progress through 9,300+ SCP Foundation entries. Discover anomalies by series, bookmark your favorites, and track every file you've accessed. A free reading companion for SCP completionists.",
  },
}

interface SeriesProgress {
  series: string
  total: number
  read: number
}

interface TopRatedScp {
  id: string
  scp_id: string
  title: string
  rating: number
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
  id: string
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
    .select('id, scp_id, title, rating, series')
    .order('scp_number', { ascending: true })
    .range(index, index)
    .single()

  if (error) {
    logger.error('Failed to fetch daily featured SCP', { error: error.message })
    return null
  }
  return data
}

async function getTopRatedScps(): Promise<TopRatedScp[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('scps')
    .select('id, scp_id, title, rating')
    .not('rating', 'is', null)
    .order('rating', { ascending: false })
    .limit(4)

  if (error) {
    logger.error('Failed to fetch top rated SCPs', {
      error: error instanceof Error ? error.message : String(error),
      context: 'getTopRatedScps (static)',
    })
    return []
  }

  if (!data) return []

  return data as TopRatedScp[]
}

export default async function Home() {
  const [seriesProgress, dailyScp, topRated] = await Promise.all([
    getSeriesProgress(),
    getDailyFeaturedScp(),
    getTopRatedScps(),
  ])

  const siteUrl = getSiteUrl()
  const homepageSchemas = generateHomepageJsonLd(siteUrl)

  return (
    <>
      {homepageSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Main>
      <Container size="lg">
        <HeroSection />

        <HomeContent seriesProgress={seriesProgress} dailyScp={dailyScp} topRated={topRated} />
      </Container>
    </Main>
    </>
  )
}
