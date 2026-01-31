import { Navigation } from '@/components/navigation'
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

  if (!userId) {
    // For non-authenticated users, just get totals
    const { data: allScps } = await supabase
      .from('scps')
      .select('series')
      .like('series', 'series-%')

    if (!allScps) return []

    const seriesCounts = allScps.reduce((acc, { series }) => {
      if (/^series-\d+$/.test(series)) {
        acc[series] = (acc[series] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return Object.entries(seriesCounts)
      .sort((a, b) => {
        const aNum = parseInt(a[0].replace('series-', ''))
        const bNum = parseInt(b[0].replace('series-', ''))
        return aNum - bNum
      })
      .map(([series, total]) => ({ series, total, read: 0 }))
  }

  // For authenticated users, use RPC for efficient aggregation
  const { data, error } = await supabase.rpc('get_series_progress', {
    user_id_param: userId,
  })

  if (error) {
    console.error('RPC error:', error)
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login')
  }

  const seriesProgress = await getSeriesProgress(user.id)

  return (
    <>
      <Navigation />
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
    </>
  )
}
