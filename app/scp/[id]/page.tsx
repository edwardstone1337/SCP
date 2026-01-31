import { Navigation } from '@/components/navigation'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ScpReader } from './scp-reader'

async function getScpData(scpId: string, userId: string) {
  const supabase = await createClient()

  // Get SCP metadata
  const { data: scp } = await supabase
    .from('scps')
    .select('id, scp_id, scp_number, title, rating, series, url')
    .eq('scp_id', scpId)
    .single()

  if (!scp) return null

  // Get read status
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

  if (!user) {
    redirect('/login')
  }

  const scpData = await getScpData(id, user.id)

  if (!scpData) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <ScpReader scp={scpData} />
    </>
  )
}
