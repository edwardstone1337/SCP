import { createClient } from '@/lib/supabase/server'
import { seriesToRoman, formatRange } from '@/lib/utils/series'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ScpListWithToggle } from '@/components/ui/scp-list-with-toggle'

export const dynamic = 'force-dynamic'

interface ScpRow {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  is_read: boolean
  is_bookmarked: boolean
}

async function getScpsInRange(
  seriesId: string,
  rangeStart: number,
  userId: string | undefined
): Promise<ScpRow[]> {
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
    // Guest: all unread, no bookmarks
    return scpsData.map(scp => ({
      ...scp,
      is_read: false,
      is_bookmarked: false,
    }))
  }

  const scpIds = scpsData.map(s => s.id)

  // Get read status for these SCPs
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('scp_id, is_read')
    .eq('user_id', userId)
    .in('scp_id', scpIds)

  // Get bookmarks for these SCPs
  const { data: bookmarkData } = await supabase
    .from('user_bookmarks')
    .select('scp_id')
    .eq('user_id', userId)
    .in('scp_id', scpIds)

  const readMap = new Map(progressData?.map(p => [p.scp_id, p.is_read]) || [])
  const bookmarkSet = new Set(bookmarkData?.map(b => b.scp_id) || [])

  return scpsData.map(scp => ({
    ...scp,
    is_read: readMap.get(scp.id) || false,
    is_bookmarked: bookmarkSet.has(scp.id),
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

  const rangeEnd = rangeStart + 99
  const rangeLabel = `${String(rangeStart).padStart(3, '0')}-${String(rangeEnd).padStart(3, '0')}`
  const breadcrumbItems = [
    { label: 'Series', href: '/series' },
    { label: `Series ${roman}` || seriesId, href: `/series/${seriesId}` },
    { label: rangeLabel }, // Current page, no href
  ]

  return (
    <>
      <Navigation />
      <Main>
        <Container size="md">
          <Breadcrumb items={breadcrumbItems} />
          <PageHeader title={formatRange(rangeStart)} />
          <ScpListWithToggle scps={scps} isAuthenticated={!!user?.id} userId={user?.id} />
        </Container>
      </Main>
    </>
  )
}
