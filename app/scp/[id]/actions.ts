'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleReadStatus(scpUuid: string, currentStatus: boolean) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get the SCP info to know which series to revalidate
  const { data: scpData } = await supabase
    .from('scps')
    .select('series, scp_number')
    .eq('id', scpUuid)
    .single()

  // Toggle the read status
  const newStatus = !currentStatus

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      scp_id: scpUuid,
      is_read: newStatus,
      read_at: newStatus ? new Date().toISOString() : null,
    }, {
      onConflict: 'user_id,scp_id',
    })

  if (error) {
    console.error('Error toggling read status:', error)
    return { success: false, error: error.message }
  }

  // Revalidate series pages
  revalidatePath('/series')

  if (scpData) {
    // Revalidate the specific series and range pages
    revalidatePath(`/series/${scpData.series}`)

    const rangeStart = Math.floor(scpData.scp_number / 100) * 100
    revalidatePath(`/series/${scpData.series}/${rangeStart}`)
  }

  return { success: true, newStatus }
}
