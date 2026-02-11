import { Metadata } from 'next'
import { createStaticClient } from '@/lib/supabase/static'
import { logger } from '@/lib/logger'
import { seriesToRoman } from '@/lib/utils/series'
import { getSiteUrl } from '@/lib/utils/site-url'
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

function getSeriesTitle(seriesId: string): string {
  const roman = seriesToRoman(seriesId)
  if (roman) return `Series ${roman}`

  // Handle special series
  const titleMap: Record<string, string> = {
    'decommissioned': 'Decommissioned SCPs',
    'explained': 'Explained SCPs',
    'joke': 'Joke SCPs',
    'scp-001': 'SCP-001 Proposals',
    'international': 'International SCPs',
  }
  return titleMap[seriesId] || seriesId
}

function getSeriesDescription(seriesId: string): string {
  const roman = seriesToRoman(seriesId)
  if (roman) {
    const seriesNum = parseInt(seriesId.replace('series-', ''), 10)
    const start = (seriesNum - 1) * 1000
    const end = start + 999
    return `Browse and track your reading progress through SCP Foundation Series ${roman} (SCP-${String(start).padStart(3, '0')} to SCP-${String(end).padStart(3, '0')}).`
  }

  // Handle special series
  const descMap: Record<string, string> = {
    'decommissioned': 'Browse decommissioned SCP entries that have been removed from the main canon.',
    'explained': 'Browse SCP entries that have been declassified and explained in the SCP Foundation archive.',
    'joke': 'Browse humorous and satirical SCP entries from the Foundation\'s joke collection.',
    'scp-001': 'Browse the various SCP-001 proposals - the Foundation\'s most classified entries.',
    'international': 'Browse SCP entries from international branches of the Foundation.',
  }
  return descMap[seriesId] || `Browse SCPs in the ${seriesId} series.`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seriesId: string }>
}): Promise<Metadata> {
  const { seriesId } = await params
  const title = getSeriesTitle(seriesId)
  const description = getSeriesDescription(seriesId)
  const canonicalUrl = `${getSiteUrl()}/series/${seriesId}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      siteName: 'SCP Reader',
      type: 'website',
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
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
