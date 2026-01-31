import { Navigation } from '@/components/navigation'
import { createClient } from '@/lib/supabase/server'
import { seriesToRoman, formatRange } from '@/lib/utils/series'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

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

  // Get all SCPs in this series with their ranges
  const { data: scpsData } = await supabase
    .from('scps')
    .select('id, scp_number')
    .eq('series', seriesId)
    .order('scp_number')

  if (!scpsData || scpsData.length === 0) return []

  // Group by range
  const rangeMap = new Map<number, { total: number; scpIds: string[] }>()

  scpsData.forEach(({ id, scp_number }) => {
    const rangeStart = Math.floor(scp_number / 100) * 100
    const existing = rangeMap.get(rangeStart)

    if (existing) {
      existing.total++
      existing.scpIds.push(id)
    } else {
      rangeMap.set(rangeStart, { total: 1, scpIds: [id] })
    }
  })

  // Get read counts for this user
  const allScpIds = scpsData.map((s) => s.id)
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('scp_id')
    .eq('user_id', userId)
    .eq('is_read', true)
    .in('scp_id', allScpIds)

  const readScpIds = new Set(progressData?.map((p) => p.scp_id) || [])

  // Calculate read count per range
  const ranges: RangeProgress[] = []
  rangeMap.forEach(({ total, scpIds }, rangeStart) => {
    const read = scpIds.filter((id) => readScpIds.has(id)).length
    ranges.push({ rangeStart, total, read })
  })

  return ranges.sort((a, b) => a.rangeStart - b.rangeStart)
}

export default async function SeriesRangePage({
  params,
}: {
  params: Promise<{ seriesId: string }>
}) {
  const { seriesId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Validate series exists and is a main series
  const roman = seriesToRoman(seriesId)
  if (!roman) {
    notFound()
  }

  const ranges = await getRangeProgress(seriesId, user.id)

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
