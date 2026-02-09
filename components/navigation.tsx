'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { NavigationClient } from './navigation-client'

export function Navigation() {
  const [user, setUser] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      setUser(authUser ? { email: authUser.email ?? undefined } : null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ? { email: session.user.email ?? undefined } : null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return <NavigationClient user={user} />
}
