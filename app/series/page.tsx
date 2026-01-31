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

  // Get all SCPs and group by series on the client side
  const { data: allScps } = await supabase
    .from('scps')
    .select('id, series')
    .order('series')

  if (!allScps) return []

  // Filter to only main series and count
  const seriesCounts = allScps
    .filter((s) => s.series.match(/^series-\d+$/))
    .reduce((acc, { series }) => {
      acc[series] = (acc[series] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  // If no user, return with 0 read count
  if (!userId) {
    return Object.entries(seriesCounts)
      .sort((a, b) => {
        const aNum = parseInt(a[0].split('-')[1])
        const bNum = parseInt(b[0].split('-')[1])
        return aNum - bNum
      })
      .map(([series, total]) => ({
        series,
        total,
        read: 0,
      }))
  }

  // Get read counts per series for this user
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('scp_id, is_read')
    .eq('user_id', userId)
    .eq('is_read', true)

  if (!progressData) {
    return Object.entries(seriesCounts)
      .sort((a, b) => {
        const aNum = parseInt(a[0].split('-')[1])
        const bNum = parseInt(b[0].split('-')[1])
        return aNum - bNum
      })
      .map(([series, total]) => ({
        series,
        total,
        read: 0,
      }))
  }

  // Get the series for each read SCP
  const readScpIds = progressData.map((p) => p.scp_id)
  const { data: readScps } = await supabase
    .from('scps')
    .select('series')
    .in('id', readScpIds)

  const readCounts =
    readScps?.reduce((acc, { series }) => {
      if (series.match(/^series-\d+$/)) {
        acc[series] = (acc[series] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

  return Object.entries(seriesCounts)
    .sort((a, b) => {
      const aNum = parseInt(a[0].split('-')[1])
      const bNum = parseInt(b[0].split('-')[1])
      return aNum - bNum
    })
    .map(([series, total]) => ({
      series,
      total,
      read: readCounts[series] || 0,
    }))
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
