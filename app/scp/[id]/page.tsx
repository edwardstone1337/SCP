import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ScpReader } from './scp-reader'

async function getAdjacentScps(
  supabase: Awaited<ReturnType<typeof createClient>>,
  series: string,
  scpNumber: number
) {
  // Previous SCP (same series, lower number)
  const { data: prev } = await supabase
    .from('scps')
    .select('scp_id, title')
    .eq('series', series)
    .lt('scp_number', scpNumber)
    .order('scp_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Next SCP (same series, higher number)
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

async function getScpData(scpId: string, userId: string | undefined) {
  const supabase = await createClient()

  // Get SCP metadata
  const { data: scp } = await supabase
    .from('scps')
    .select('id, scp_id, scp_number, title, rating, series, url, content_file')
    .eq('scp_id', scpId)
    .single()

  if (!scp) return null

  // Get read status only if user is authenticated
  if (!userId) {
    return {
      ...scp,
      is_read: false,
    }
  }

  const { data: progress } = await supabase
    .from('user_progress')
    .select('is_read')
    .eq('user_id', userId)
    .eq('scp_id', scp.id)
    .single()

  return {
    ...scp,
    is_read: progress?.is_read || false,
  }
}

export default async function ScpPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Allow guests
  const scpData = await getScpData(id, user?.id)

  if (!scpData) {
    notFound()
  }

  // After getting user and SCP data, check if bookmarked
  let isBookmarked = false
  if (user) {
    const { data: bookmark } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('scp_id', scpData.id)
      .maybeSingle()

    isBookmarked = !!bookmark
  }

  const { prev, next } = await getAdjacentScps(
    supabase,
    scpData.series,
    scpData.scp_number
  )

  return (
    <>
      <ScpReader scp={{ ...scpData, is_bookmarked: isBookmarked }} userId={user?.id} prev={prev} next={next} />
    </>
  )
}
