import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { seriesToRoman, formatRange } from '@/lib/utils/series'
import { notFound } from 'next/navigation'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { PageHeader } from '@/components/ui/page-header'
import { Stack } from '@/components/ui/stack'
import { RangeListItem } from '@/components/ui/range-list-item'

export const dynamic = 'force-dynamic'

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

async function getRangeProgress(
  seriesId: string,
  userId: string | undefined
): Promise<RangeProgress[]> {
  const supabase = await createClient()

  // Use RPC for both auth and guest. RPC aggregates at DB level (GROUP BY)
  // so we get all ranges regardless of table size. Passing null for guest users
  // yields read_count=0 for all (LEFT JOIN never matches).
  const { data, error } = await supabase.rpc('get_range_progress', {
    series_id_param: seriesId,
    user_id_param: userId ?? null
  })
  
  if (error) {
    logger.error('Failed to fetch range progress', {
      error: error instanceof Error ? error.message : String(error),
      seriesId,
      userId,
      context: 'getRangeProgress'
    })
    return []
  }
  
  if (!data) return []
  
  return data.map((row: GetRangeProgressRow) => ({
    rangeStart: row.range_start,
    total: Number(row.total),
    read: Number(row.read_count)
  }))
}

export default async function SeriesRangePage({
  params,
}: {
  params: Promise<{ seriesId: string }>
}) {
  const { seriesId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const roman = seriesToRoman(seriesId)
  if (!roman) {
    notFound()
  }
  
  const ranges = await getRangeProgress(seriesId, user?.id)
  
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
          <Stack direction="vertical" gap="normal">
            {ranges.map(({ rangeStart, total, read }) => (
              <RangeListItem
                key={rangeStart}
                rangeLabel={formatRange(rangeStart)}
                total={total}
                read={read}
                href={`/series/${seriesId}/${rangeStart}`}
              />
            ))}
          </Stack>
        </Container>
      </Main>
    </>
  )
}
