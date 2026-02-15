import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'

/**
 * Checks whether the current user has active premium status.
 *
 * @param userId - The authenticated user's ID, or null if not signed in.
 * @returns isPremium (boolean) and isLoading state.
 */
export function usePremium(userId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['user-premium', userId],
    queryFn: async () => {
      try {
        const supabase = createClient()

        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('premium_until')
          .eq('id', userId!)
          .single()

        if (error) throw error

        return profile?.premium_until ?? null
      } catch (err) {
        logger.error('Premium status fetch failed', {
          error: err instanceof Error ? err.message : String(err),
          userId: userId ?? undefined,
          component: 'usePremium',
        })
        throw err
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes — called on every page via nav
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  if (!userId) {
    return { isPremium: false, isLoading: false }
  }

  const isPremium = !!data && new Date(data) > new Date()

  return { isPremium, isLoading }
}
