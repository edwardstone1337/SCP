import { Navigation } from '@/components/navigation'
import { createClient } from '@/lib/supabase/server'
import { seriesToRoman, formatRange } from '@/lib/utils/series'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface RangeProgress {
  rangeStart: number
  total: number
  read: number
}

async function getRangeProgress(
  seriesId: string,
  userId: string
): Promise<RangeProgress[]> {
  const supabase = await createClient()

  // Guests: get ranges with 0 read (RPC expects UUID)
  if (!userId) {
    const { data: scps } = await supabase
      .from('scps')
      .select('scp_number')
      .eq('series', seriesId)

    if (!scps || scps.length === 0) return []

    const rangeMap = new Map<number, number>()
    for (const s of scps) {
      const rangeStart = Math.floor(s.scp_number / 100) * 100
      rangeMap.set(rangeStart, (rangeMap.get(rangeStart) ?? 0) + 1)
    }
    return Array.from(rangeMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([rangeStart, total]) => ({ rangeStart, total, read: 0 }))
  }

  // Use RPC to avoid URI length issues with large .in() queries
  const { data, error } = await supabase.rpc('get_range_progress', {
    series_id_param: seriesId,
    user_id_param: userId,
  })

  if (error) {
    console.error('RPC error:', error)
    return []
  }

  if (!data) return []

  // Map RPC result to RangeProgress interface
  return data.map(
    (row: { range_start: number; total: number; read_count: number }) => ({
      rangeStart: row.range_start,
      total: Number(row.total),
      read: Number(row.read_count),
    })
  )
}

export default async function SeriesRangePage({
  params,
}: {
  params: Promise<{ seriesId: string }>
}) {
  const { seriesId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Validate series exists and is a main series
  const roman = seriesToRoman(seriesId)
  if (!roman) {
    notFound()
  }

  // Allow guests - pass user.id or undefined
  const ranges = await getRangeProgress(seriesId, user?.id || '')

  if (ranges.length === 0) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/series"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
          >
            ← Back
          </Link>

          <h1 className="text-3xl font-bold mb-1">Series {roman}</h1>
          <p className="text-sm text-green-600 dark:text-green-400 uppercase tracking-wide">
            Access Granted
          </p>
        </div>

        {/* Range List */}
        <div className="space-y-3">
          {ranges.map(({ rangeStart, total, read }) => {
            const percentage = total > 0 ? Math.round((read / total) * 100) : 0
            const rangeLabel = formatRange(rangeStart)

            return (
              <Link
                key={rangeStart}
                href={`/series/${seriesId}/${rangeStart}`}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <span className="font-semibold">{rangeLabel}</span>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {percentage}%
                  </span>
                  <div className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                    <span className="text-xs font-bold">{percentage}%</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
    </>
  )
}
