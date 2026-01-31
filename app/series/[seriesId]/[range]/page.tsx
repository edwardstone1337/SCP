import { createClient } from '@/lib/supabase/server'
import { seriesToRoman, formatRange } from '@/lib/utils/series'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

interface ScpListItem {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  is_read: boolean
}

async function getScpsInRange(
  seriesId: string,
  rangeStart: number,
  userId: string
): Promise<ScpListItem[]> {
  const supabase = await createClient()

  // Get all SCPs in this range
  const { data: scpsData } = await supabase
    .from('scps')
    .select('id, scp_id, scp_number, title, rating')
    .eq('series', seriesId)
    .gte('scp_number', rangeStart)
    .lt('scp_number', rangeStart + 100)
    .order('scp_number')

  if (!scpsData) return []

  // Get read status for these SCPs
  const scpIds = scpsData.map((s) => s.id)
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('scp_id, is_read')
    .eq('user_id', userId)
    .in('scp_id', scpIds)

  const readMap = new Map(progressData?.map((p) => [p.scp_id, p.is_read]) || [])

  return scpsData.map((scp) => ({
    ...scp,
    is_read: readMap.get(scp.id) || false,
  }))
}

export default async function RangeScpListPage({
  params,
}: {
  params: Promise<{ seriesId: string; range: string }>
}) {
  const { seriesId, range } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Validate series
  const roman = seriesToRoman(seriesId)
  if (!roman) {
    notFound()
  }

  // Parse range
  const rangeStart = parseInt(range, 10)
  if (isNaN(rangeStart) || rangeStart < 0) {
    notFound()
  }

  const scps = await getScpsInRange(seriesId, rangeStart, user.id)

  if (scps.length === 0) {
    notFound()
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/series/${seriesId}`}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
          >
            ← Back
          </Link>

          <h1 className="text-3xl font-bold mb-1">{formatRange(rangeStart)}</h1>
        </div>

        {/* SCP List */}
        <div className="space-y-2">
          {scps.map((scp) => (
            <Link
              key={scp.id}
              href={`/scp/${scp.scp_id}`}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{scp.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    ★ {scp.rating}
                  </span>
                  <span>•</span>
                  <span className="font-mono">{scp.scp_id}</span>
                </div>
              </div>

              <div className="ml-4">
                {scp.is_read ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 border-2 border-green-500 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">👁️</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
