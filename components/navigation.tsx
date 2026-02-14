'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { NavigationClient } from './navigation-client'

export function Navigation() {
  const [user, setUser] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function loadUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(authUser ? { email: authUser.email ?? undefined } : null)
      } catch (error) {
        if (!mounted) return
        logger.error('Failed to load user', { error, component: 'Navigation' })
      }
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ? { email: session.user.email ?? undefined } : null)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return <NavigationClient user={user} />
}
