'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)

      Promise.all([
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
      ]).then(([progressRes, bookmarkRes]) => {
        const is_read = progressRes.data?.is_read ?? false
        const is_bookmarked = !!bookmarkRes.data
        setScp((s) => ({ ...s, is_read, is_bookmarked }))
      })
    })
  }, [initialScp.id])

  return <ScpReader scp={scp} userId={userId} prev={prev} next={next} />
}
