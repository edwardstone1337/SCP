'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { formatRange } from '@/lib/utils/series'
import { Stack } from '@/components/ui/stack'
import { RangeListItem } from '@/components/ui/range-list-item'

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

interface SeriesContentProps {
  ranges: RangeProgress[]
  seriesId: string
}

export function SeriesContent({ ranges: initialRanges, seriesId }: SeriesContentProps) {
  const [ranges, setRanges] = useState(initialRanges)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return

        const { data, error } = await supabase.rpc('get_range_progress', {
          series_id_param: seriesId,
          user_id_param: user.id,
        })

        if (error || !data || !mounted) return

        setRanges(
          data.map((row: GetRangeProgressRow) => ({
            rangeStart: row.range_start,
            total: Number(row.total),
            read: Number(row.read_count),
          }))
        )
      } catch (error) {
        if (!mounted) return
        logger.error('Failed to load user data', { error, component: 'SeriesContent' })
      }
    }

    loadUserData()
    return () => { mounted = false }
  }, [seriesId])

  return (
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
  )
}
