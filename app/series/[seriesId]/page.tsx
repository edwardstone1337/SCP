import { createClient } from '@/lib/supabase/server'
import { seriesToRoman, formatRange } from '@/lib/utils/series'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'

export const dynamic = 'force-dynamic'

interface RangeProgress {
  rangeStart: number
  total: number
  read: number
}

async function getRangeProgress(
  seriesId: string,
  userId: string | undefined
): Promise<RangeProgress[]> {
  const supabase = await createClient()
  
  if (!userId) {
    // Guest: load ranges without progress
    const { data: scpsData } = await supabase
      .from('scps')
      .select('id, scp_number')
      .eq('series', seriesId)
      .order('scp_number')
    
    if (!scpsData || scpsData.length === 0) return []
    
    const rangeMap = new Map<number, number>()
    scpsData.forEach(({ scp_number }) => {
      const rangeStart = Math.floor(scp_number / 100) * 100
      rangeMap.set(rangeStart, (rangeMap.get(rangeStart) || 0) + 1)
    })
    
    return Array.from(rangeMap.entries())
      .map(([rangeStart, total]) => ({ rangeStart, total, read: 0 }))
      .sort((a, b) => a.rangeStart - b.rangeStart)
  }
  
  // Authenticated: use RPC
  const { data, error } = await supabase.rpc('get_range_progress', {
    series_id_param: seriesId,
    user_id_param: userId
  })
  
  if (error) {
    console.error('RPC error:', error)
    return []
  }
  
  if (!data) return []
  
  return data.map(row => ({
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

  return (
    <>
      <Navigation />
      <main 
        className="min-h-screen p-6"
        style={{ 
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-primary)'
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/series"
              className="inline-flex items-center text-sm mb-4 transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              ← Back
            </Link>
            
            <h1 className="text-4xl font-bold mb-1">Series {roman}</h1>
            <p 
              className="text-sm uppercase tracking-wide font-bold"
              style={{ color: 'var(--color-accent)' }}
            >
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
                  className="flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--color-grey-9)',
                    borderColor: percentage > 0 ? 'var(--color-accent)' : 'var(--color-grey-8)'
                  }}
                >
                  <span className="font-bold text-lg font-mono">{rangeLabel}</span>
                  
                  <div className="flex items-center gap-3">
                    <span 
                      className="text-sm font-bold"
                      style={{ 
                        color: percentage > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)'
                      }}
                    >
                      {percentage}%
                    </span>
                    <div 
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                      style={{ 
                        borderColor: percentage > 0 ? 'var(--color-accent)' : 'var(--color-grey-7)'
                      }}
                    >
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
