'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { ScpListWithToggle } from '@/components/ui/scp-list-with-toggle'

interface ScpItem {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  is_read: boolean
  is_bookmarked: boolean
}

interface RangeContentProps {
  scps: ScpItem[]
}

export function RangeContent({ scps: initialScps }: RangeContentProps) {
  const [scps, setScps] = useState(initialScps)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return
        setIsAuthenticated(true)
        setUserId(user.id)

        const scpIds = initialScps.map((s) => s.id)

        const [progressRes, bookmarkRes] = await Promise.all([
          supabase
            .from('user_progress')
            .select('scp_id, is_read')
            .eq('user_id', user.id)
            .in('scp_id', scpIds),
          supabase
            .from('user_bookmarks')
            .select('scp_id')
            .eq('user_id', user.id)
            .in('scp_id', scpIds),
        ])

        if (!mounted) return

        const progressData = progressRes.data
        const bookmarkData = bookmarkRes.data
        const readMap = new Map(progressData?.map((p) => [p.scp_id, p.is_read]) ?? [])
        const bookmarkSet = new Set(bookmarkData?.map((b) => b.scp_id) ?? [])

        setScps(
          initialScps.map((scp) => ({
            ...scp,
            is_read: readMap.get(scp.id) ?? false,
            is_bookmarked: bookmarkSet.has(scp.id),
          }))
        )
      } catch (error) {
        if (!mounted) return
        logger.error('Failed to load user data', { error, component: 'RangeContent' })
      }
    }

    loadUserData()
    return () => { mounted = false }
  }, [initialScps])

  return (
    <ScpListWithToggle
      scps={scps}
      isAuthenticated={isAuthenticated}
      userId={userId ?? undefined}
    />
  )
}
