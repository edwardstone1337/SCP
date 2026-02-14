'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Text } from '@/components/ui/typography'

export function HeroSubhead() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setIsAuthenticated(true)
    })
  }, [])

  return (
    <Text variant="secondary" size="lg" style={{ marginTop: 'var(--spacing-4)' }}>
      {isAuthenticated
        ? 'Welcome back, Researcher. Your assignment continues.'
        : 'Access and track 9,300+ classified anomaly files.'}
    </Text>
  )
}
