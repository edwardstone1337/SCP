import { createClient } from '@/lib/supabase/server'
import { seriesToRoman, formatRange } from '@/lib/utils/series'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'

export const dynamic = 'force-dynamic'

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
  userId: string | undefined
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
  
  if (!userId) {
    // Guest: all unread
    return scpsData.map(scp => ({
      ...scp,
      is_read: false,
    }))
  }
  
  // Get read status for these SCPs
  const scpIds = scpsData.map(s => s.id)
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('scp_id, is_read')
    .eq('user_id', userId)
    .in('scp_id', scpIds)
  
  const readMap = new Map(progressData?.map(p => [p.scp_id, p.is_read]) || [])
  
  return scpsData.map(scp => ({
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
  
  const scps = await getScpsInRange(seriesId, rangeStart, user?.id)
  
  if (scps.length === 0) {
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
              href={`/series/${seriesId}`}
              className="inline-flex items-center text-sm mb-4 transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              ← Back
            </Link>
            
            <h1 className="text-4xl font-bold mb-1">{formatRange(rangeStart)}</h1>
          </div>

          {/* SCP List */}
          <div className="space-y-2">
            {scps.map((scp) => (
              <Link
                key={scp.id}
                href={`/scp/${scp.scp_id}`}
                className="flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--color-grey-9)',
                  borderColor: scp.is_read ? 'var(--color-accent)' : 'var(--color-grey-8)'
                }}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate mb-1">{scp.title}</h3>
                  <div 
                    className="flex items-center gap-3 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span className="flex items-center gap-1">
                      ★ {scp.rating}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{scp.scp_id}</span>
                  </div>
                </div>
                
                <div className="ml-4">
                  {scp.is_read ? (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                      style={{ 
                        backgroundColor: 'var(--color-red-1)',
                        borderColor: 'var(--color-accent)'
                      }}
                    >
                      <span style={{ color: 'var(--color-accent)' }}>✓</span>
                    </div>
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                      style={{ borderColor: 'var(--color-grey-7)' }}
                    >
                      <span style={{ color: 'var(--color-grey-7)' }}>👁️</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
