'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { useTopRatedList } from '@/lib/hooks/use-top-rated-list'
import { ScpReader } from './scp-reader'

interface AdjacentScp {
  scp_id: string
  title: string
}

interface ScpData {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  series: string
  url: string
  content_file: string | null
  is_read: boolean
  is_bookmarked: boolean
}

interface ScpContentProps {
  scp: ScpData
  prev: AdjacentScp | null
  next: AdjacentScp | null
}

export function ScpContent({ scp: initialScp, prev, next }: ScpContentProps) {
  const [scp, setScp] = useState(initialScp)
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const searchParams = useSearchParams()

  // Read context params
  const context = searchParams.get('context')
  const rankStr = searchParams.get('rank')
  const rank = rankStr ? parseInt(rankStr, 10) : null

  // Fetch top-rated list only when context is top-rated
  const { data: topRatedList } = useTopRatedList(context === 'top-rated' && rank !== null)

  // Compute contextual prev/next when in top-rated context
  let contextualPrev = prev
  let contextualNext = next
  let contextInfo: { context: string; rank: number } | null = null

  if (context === 'top-rated' && rank !== null && topRatedList && topRatedList.length > 0) {
    contextInfo = { context: 'top-rated', rank }

    // Prev: rank > 1 → list[rank - 2]
    if (rank > 1 && topRatedList[rank - 2]) {
      contextualPrev = {
        scp_id: topRatedList[rank - 2],
        title: '', // Title not needed for navigation
      }
    } else {
      contextualPrev = null
    }

    // Next: rank < list.length → list[rank]
    if (rank < topRatedList.length && topRatedList[rank]) {
      contextualNext = {
        scp_id: topRatedList[rank],
        title: '', // Title not needed for navigation
      }
    } else {
      contextualNext = null
    }
  }

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return
        setUserId(user.id)

        const [progressRes, bookmarkRes] = await Promise.all([
          supabase
            .from('user_progress')
            .select('is_read')
            .eq('user_id', user.id)
            .eq('scp_id', initialScp.id)
            .maybeSingle(),
          supabase
            .from('user_bookmarks')
            .select('id')
            .eq('user_id', user.id)
            .eq('scp_id', initialScp.id)
            .maybeSingle(),
        ])

        if (!mounted) return
        const is_read = progressRes.data?.is_read ?? false
        const is_bookmarked = !!bookmarkRes.data
        setScp((s) => ({ ...s, is_read, is_bookmarked }))
      } catch (error) {
        if (!mounted) return
        logger.error('Failed to load user data', { error, component: 'ScpContent' })
      }
    }

    loadUserData()
    return () => { mounted = false }
  }, [initialScp.id])

  return (
    <ScpReader
      scp={scp}
      userId={userId}
      prev={contextualPrev}
      next={contextualNext}
      contextInfo={contextInfo}
    />
  )
}
