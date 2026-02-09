import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import { ScpContent } from './scp-content'

async function getAdjacentScps(
  supabase: ReturnType<typeof createStaticClient>,
  series: string,
  scpNumber: number
) {
  const { data: prev } = await supabase
    .from('scps')
    .select('scp_id, title')
    .eq('series', series)
    .lt('scp_number', scpNumber)
    .order('scp_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: next } = await supabase
    .from('scps')
    .select('scp_id, title')
    .eq('series', series)
    .gt('scp_number', scpNumber)
    .order('scp_number', { ascending: true })
    .limit(1)
    .maybeSingle()

  return { prev, next }
}

async function getScpData(scpId: string) {
  const supabase = createStaticClient()

  const { data: scp } = await supabase
    .from('scps')
    .select('id, scp_id, scp_number, title, rating, series, url, content_file')
    .eq('scp_id', scpId)
    .single()

  if (!scp) return null

  return {
    ...scp,
    rating: scp.rating ?? 0,
    is_read: false,
    is_bookmarked: false,
  }
}

export const revalidate = 86400

export default async function ScpPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const scpData = await getScpData(id)

  if (!scpData) {
    notFound()
  }

  const supabase = createStaticClient()
  const { prev, next } = await getAdjacentScps(
    supabase,
    scpData.series,
    scpData.scp_number
  )

  return (
    <ScpContent scp={scpData} prev={prev} next={next} />
  )
}
