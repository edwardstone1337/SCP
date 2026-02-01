import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { seriesToRoman } from '@/lib/utils/series'
import { Navigation } from '@/components/navigation'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { SeriesCard } from '@/components/ui/series-card'

export const dynamic = 'force-dynamic'

interface SeriesProgress {
  series: string
  total: number
  read: number
}

async function getSeriesProgress(userId: string | undefined): Promise<SeriesProgress[]> {
  const supabase = await createClient()

  // Use RPC for both auth and non-auth. RPC aggregates at DB level (GROUP BY)
  // so we get all series regardless of table size. Passing null for guest users
  // yields read=0 for all (LEFT JOIN never matches).
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

  // Sort by series number
  return data.sort((a: SeriesProgress, b: SeriesProgress) => {
    const aNum = parseInt(a.series.replace('series-', ''))
    const bNum = parseInt(b.series.replace('series-', ''))
    return aNum - bNum
  })
}

export default async function SeriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const seriesProgress = await getSeriesProgress(user?.id)

  return (
    <>
      <Navigation />
      <Main>
        <Container size="lg">
          <PageHeader
            title="Series"
            description="Select a series to start reading"
          />
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
        </Container>
      </Main>
    </>
  )
}
