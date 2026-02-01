import { createClient } from '@/lib/supabase/server'
import { seriesToRoman } from '@/lib/utils/series'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

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
  const { data: { user } } = await supabase.auth.getUser()

  const seriesProgress = await getSeriesProgress(user?.id)

  return (
    <>
      <Navigation />
      <main
        className="min-h-screen p-6"
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-primary)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Series</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Select a series to start reading
            </p>
          </div>

          {/* Series Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {seriesProgress.map(({ series, total, read }) => {
              const roman = seriesToRoman(series)
              if (!roman) return null

              const percentage = total > 0 ? Math.round((read / total) * 100) : 0

              return (
                <Link
                  key={series}
                  href={`/series/${series}`}
                  className="block p-6 rounded-lg border-2 transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'var(--color-grey-9)',
                    borderColor: percentage > 0 ? 'var(--color-accent)' : 'var(--color-grey-8)',
                  }}
                >
                  <div className="flex flex-col items-center">
                    {/* Roman Numeral */}
                    <div className="text-5xl font-bold mb-4">{roman}</div>

                    {/* Progress */}
                    <div
                      className="text-sm font-bold"
                      style={{
                        color: percentage > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {percentage}%
                    </div>

                    {/* Count */}
                    <div
                      className="text-xs mt-1"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {read} / {total}
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
