import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

/**
 * Fetches the ordered list of top 100 SCP IDs by rating.
 * Used for contextual navigation when browsing from the top-rated list.
 *
 * @param enabled - Whether to fetch the list (default: false, must be explicitly enabled)
 */
export function useTopRatedList(enabled = false) {
  return useQuery({
    queryKey: ['top-rated-list'],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('scps')
        .select('scp_id')
        .order('rating', { ascending: false })
        .limit(100)

      if (error) throw error
      if (!data) return []

      return data.map((row) => row.scp_id)
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled,
  })
}
