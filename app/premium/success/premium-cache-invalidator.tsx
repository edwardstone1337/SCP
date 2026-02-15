'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Invalidates the user-premium TanStack Query cache on mount.
 * Placed on the premium success page so that when the user navigates
 * away, usePremium() will refetch and pick up the new premium status.
 */
export function PremiumCacheInvalidator() {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['user-premium'] })
    queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
  }, [queryClient])

  return null
}
