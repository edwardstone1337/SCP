import { createClient } from '@/lib/supabase/server'
import { seriesToRoman } from '@/lib/utils/series'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface SeriesProgress {
  series: string
  total: number
  read: number
}

async function getSeriesProgress(userId: string | undefined): Promise<SeriesProgress[]> {
  const supabase = await createClient()

  // Get all series that match the pattern series-N
  const { data: allScps } = await supabase
    .from('scps')
    .select('id, series')

  if (!allScps) return []

  // Manually filter and count - client-side grouping
  const mainSeries = allScps.filter(scp => /^series-\d+$/.test(scp.series))

  // Group by series
  const seriesMap = new Map<string, Set<string>>()
  mainSeries.forEach(scp => {
    if (!seriesMap.has(scp.series)) {
      seriesMap.set(scp.series, new Set())
    }
    seriesMap.get(scp.series)!.add(scp.id)
  })

  console.log('Series found:', Array.from(seriesMap.keys())) // Debug log

  // If no user, return with 0 read
  if (!userId) {
    return Array.from(seriesMap.entries())
      .map(([series, scpIds]) => ({
        series,
        total: scpIds.size,
        read: 0,
      }))
      .sort((a, b) => {
        const aNum = parseInt(a.series.replace('series-', ''))
        const bNum = parseInt(b.series.replace('series-', ''))
        return aNum - bNum
      })
  }

  // Get all read SCPs for this user
  const allScpIds = Array.from(new Set(mainSeries.map(s => s.id)))
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('scp_id')
    .eq('user_id', userId)
    .eq('is_read', true)
    .in('scp_id', allScpIds)

  const readScpIds = new Set(progressData?.map(p => p.scp_id) || [])

  // Calculate read count per series
  const result = Array.from(seriesMap.entries())
    .map(([series, scpIds]) => {
      const scpIdArray = Array.from(scpIds)
      const readCount = scpIdArray.filter(id => readScpIds.has(id)).length

      return {
        series,
        total: scpIdArray.length,
        read: readCount,
      }
    })
    .sort((a, b) => {
      const aNum = parseInt(a.series.replace('series-', ''))
      const bNum = parseInt(b.series.replace('series-', ''))
      return aNum - bNum
    })

  console.log('Series progress:', result) // Debug log

  return result
}

export default async function SeriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login')
  }

  const seriesProgress = await getSeriesProgress(user.id)

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Series</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select a series to start reading
          </p>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {seriesProgress.map(({ series, total, read }) => {
            const roman = seriesToRoman(series)
            if (!roman) return null // Skip non-main series

            const percentage = total > 0 ? Math.round((read / total) * 100) : 0

            return (
              <Link
                key={series}
                href={`/series/${series}`}
                className="block p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex flex-col items-center">
                  {/* Roman Numeral */}
                  <div className="text-4xl font-bold mb-4">{roman}</div>

                  {/* Progress */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {percentage}%
                  </div>

                  {/* Count */}
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {read} / {total}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Back to Home */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
