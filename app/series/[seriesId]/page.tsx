import { createStaticClient } from '@/lib/supabase/static'
import { logger } from '@/lib/logger'
import { seriesToRoman } from '@/lib/utils/series'
import { notFound } from 'next/navigation'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { PageHeader } from '@/components/ui/page-header'
import { SeriesContent } from './series-content'

export const revalidate = 86400

interface RangeProgress {
  rangeStart: number
  total: number
  read: number
}

interface GetRangeProgressRow {
  range_start: number
  total: number
  read_count: number
}

async function getRangeProgress(seriesId: string): Promise<RangeProgress[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase.rpc('get_range_progress', {
    series_id_param: seriesId,
    user_id_param: null,
  })

  if (error) {
    logger.error('Failed to fetch range progress', {
      error: error instanceof Error ? error.message : String(error),
      seriesId,
      context: 'getRangeProgress (static)',
    })
    return []
  }

  if (!data) return []

  return data.map((row: GetRangeProgressRow) => ({
    rangeStart: row.range_start,
    total: Number(row.total),
    read: Number(row.read_count),
  }))
}

export default async function SeriesRangePage({
  params,
}: {
  params: Promise<{ seriesId: string }>
}) {
  const { seriesId } = await params

  const roman = seriesToRoman(seriesId)
  if (!roman) {
    notFound()
  }

  const ranges = await getRangeProgress(seriesId)

  if (ranges.length === 0) {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'Series', href: '/' },
    { label: `Series ${roman}` },
  ]

  return (
    <>
      <Main>
        <Container size="md">
          <Breadcrumb items={breadcrumbItems} />
          <PageHeader title={`Series ${roman}`} />
          <SeriesContent ranges={ranges} seriesId={seriesId} />
        </Container>
      </Main>
    </>
  )
}
