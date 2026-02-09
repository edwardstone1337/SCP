import { createStaticClient } from '@/lib/supabase/static'
import { logger } from '@/lib/logger'
import { seriesToRoman, formatRange } from '@/lib/utils/series'
import { notFound } from 'next/navigation'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { RangeContent } from './range-content'

export const revalidate = 86400

interface ScpRow {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  is_read: boolean
  is_bookmarked: boolean
}

async function getScpsInRange(
  seriesId: string,
  rangeStart: number
): Promise<ScpRow[]> {
  const supabase = createStaticClient()

  const { data: scpsData, error: scpsError } = await supabase
    .from('scps')
    .select('id, scp_id, scp_number, title, rating')
    .eq('series', seriesId)
    .gte('scp_number', rangeStart)
    .lt('scp_number', rangeStart + 100)
    .order('scp_number')

  if (scpsError) {
    logger.error('Failed to fetch range SCPs', { error: scpsError.message })
  }
  if (!scpsData) return []

  return scpsData.map((scp) => ({
    ...scp,
    rating: scp.rating ?? 0,
    is_read: false,
    is_bookmarked: false,
  }))
}

export default async function RangeScpListPage({
  params,
}: {
  params: Promise<{ seriesId: string; range: string }>
}) {
  const { seriesId, range } = await params

  const roman = seriesToRoman(seriesId)
  if (!roman) {
    notFound()
  }

  const rangeStart = parseInt(range, 10)
  if (isNaN(rangeStart) || rangeStart < 0) {
    notFound()
  }

  const scps = await getScpsInRange(seriesId, rangeStart)

  if (scps.length === 0) {
    notFound()
  }

  const rangeEnd = rangeStart + 99
  const rangeLabel = `${String(rangeStart).padStart(3, '0')}-${String(rangeEnd).padStart(3, '0')}`
  const breadcrumbItems = [
    { label: 'Series', href: '/' },
    { label: `Series ${roman}` || seriesId, href: `/series/${seriesId}` },
    { label: rangeLabel },
  ]

  return (
    <>
      <Main>
        <Container size="md">
          <Breadcrumb items={breadcrumbItems} />
          <PageHeader title={formatRange(rangeStart)} />
          <RangeContent scps={scps} />
        </Container>
      </Main>
    </>
  )
}
