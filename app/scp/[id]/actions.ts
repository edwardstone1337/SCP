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

  // Toggle the read status
  const newStatus = !currentStatus

  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: user.id,
        scp_id: scpUuid,
        is_read: newStatus,
        read_at: newStatus ? new Date().toISOString() : null,
      },
      {
        onConflict: 'user_id,scp_id',
      }
    )

  if (error) {
    console.error('Error toggling read status:', error)
    return { success: false, error: error.message }
  }

  // Revalidate relevant paths to update progress indicators
  revalidatePath('/series')
  revalidatePath('/series/[seriesId]', 'page')
  revalidatePath('/series/[seriesId]/[range]', 'page')

  return { success: true, newStatus }
}
