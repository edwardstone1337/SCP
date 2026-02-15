'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'

export async function toggleReadStatus(scpUuid: string, currentStatus: boolean, routeId?: string) {
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
    logger.error('Failed to toggle read status', {
      error: error instanceof Error ? error.message : String(error),
      userId: user.id,
      scpId: scpUuid,
      context: 'toggleReadStatus'
    })
    return { success: false, error: error.message }
  }

  // Revalidate series pages and current SCP page
  revalidatePath('/')
  if (routeId) {
    revalidatePath(`/scp/${routeId}`, 'page')
  }

  if (scpData) {
    // Revalidate the specific series and range pages
    revalidatePath(`/series/${scpData.series}`)

    const rangeStart = Math.floor(scpData.scp_number / 100) * 100
    revalidatePath(`/series/${scpData.series}/${rangeStart}`)
  }

  return { success: true, newStatus }
}

export async function toggleBookmarkStatus(
  scpId: string,           // UUID for DB operations
  isCurrentlyBookmarked: boolean,
  routeId: string          // Text ID for revalidation (e.g., "SCP-173")
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  if (isCurrentlyBookmarked) {
    // Remove bookmark
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('scp_id', scpId)

    if (error) {
      logger.error('Bookmark toggle failed', {
        error: error.message,
        scpId,
        action: 'delete',
      })
      return { error: error.message }
    }
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('user_bookmarks')
      .insert({
        user_id: user.id,
        scp_id: scpId,
      })

    if (error) {
      logger.error('Bookmark toggle failed', {
        error: error.message,
        scpId,
        action: 'insert',
      })
      return { error: error.message }
    }
  }

  revalidatePath(`/scp/${routeId}`, 'page')
  revalidatePath('/saved', 'page')
  return { success: true }
}

export async function recordView(scpUuid: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return // Silently skip for guests

  // Upsert: update viewed_at if already exists, insert if new
  const { error: upsertError } = await supabase
    .from('user_recently_viewed')
    .upsert({
      user_id: user.id,
      scp_id: scpUuid,
      viewed_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,scp_id',
    })

  if (upsertError) {
    logger.error('Failed to record view', {
      error: upsertError instanceof Error ? upsertError.message : String(upsertError),
      userId: user.id,
      scpId: scpUuid,
      context: 'recordView'
    })
    return
  }

  // Keep 6 most recent — matches homepage display limit
  const { data: recent } = await supabase
    .from('user_recently_viewed')
    .select('id')
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })
    .range(6, 100)

  if (recent && recent.length > 0) {
    const { error: deleteError } = await supabase
      .from('user_recently_viewed')
      .delete()
      .in('id', recent.map(r => r.id))
    if (deleteError) {
      logger.error('Failed to trim recently viewed', {
        error: deleteError.message,
        userId: user.id,
      })
    }
  }
}
