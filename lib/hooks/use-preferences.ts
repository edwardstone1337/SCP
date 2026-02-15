import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'

export interface UserPreferences {
  imageSafeMode?: boolean
  // Future settings: fontSize, theme, etc.
}

const DEFAULT_PREFERENCES: UserPreferences = {}

/**
 * Fetches and manages user preferences stored in user_profiles.preferences.
 *
 * @param userId - The authenticated user's ID, or null if not signed in.
 */
export function usePreferences(userId: string | null) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['user-preferences', userId], [userId])

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const supabase = createClient()

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('preferences')
        .eq('id', userId!)
        .single()

      if (error) throw error

      return (profile?.preferences ?? {}) as UserPreferences
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const updatePreference = useCallback(
    async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      if (!userId) return

      const currentPrefs = queryClient.getQueryData<UserPreferences>(queryKey) ?? {}
      const updatedPrefs = { ...currentPrefs, [key]: value }

      // Optimistic update
      queryClient.setQueryData<UserPreferences>(queryKey, updatedPrefs)

      try {
        const supabase = createClient()

        const { error } = await supabase.rpc('update_user_preferences', {
          new_preferences: updatedPrefs,
        })

        if (error) {
          // Revert on error
          queryClient.setQueryData<UserPreferences>(queryKey, currentPrefs)
          logger.error('Failed to update preferences', {
            error: error.message,
            key,
            component: 'usePreferences',
          })
          throw error
        }
      } catch (err) {
        // Revert on unexpected error
        queryClient.setQueryData<UserPreferences>(queryKey, currentPrefs)
        logger.error('Failed to update preferences', {
          error: err instanceof Error ? err.message : String(err),
          key,
          component: 'usePreferences',
        })
        throw err
      }
    },
    [userId, queryClient, queryKey]
  )

  if (!userId) {
    return {
      preferences: DEFAULT_PREFERENCES,
      updatePreference,
      isLoading: false,
    }
  }

  return {
    preferences: data ?? DEFAULT_PREFERENCES,
    updatePreference,
    isLoading,
  }
}
