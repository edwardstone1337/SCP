'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceRoleClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function deleteAccount(): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    logger.error('Delete account: user verification failed', {
      error: userError?.message ?? 'No user session',
    })
    return { error: 'You must be signed in to delete your account.' }
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    logger.error('Delete account: SUPABASE_SERVICE_ROLE_KEY not configured')
    return { error: 'Account deletion is not available. Please contact support.' }
  }

  const adminClient = createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  )

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

  if (deleteError) {
    logger.error('Delete account: admin deleteUser failed', {
      userId: user.id,
      error: deleteError.message,
    })
    return { error: 'Failed to delete account. Please try again.' }
  }

  logger.info('Delete account: user deleted successfully', { userId: user.id })

  // Clear server session — user is already deleted from auth, so ignore errors
  try {
    await supabase.auth.signOut()
  } catch {
    // Expected: session invalidation may fail for a deleted user
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
