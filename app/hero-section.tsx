'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heading, Text } from '@/components/ui/typography'
import { Stack } from '@/components/ui/stack'
import { logger } from '@/lib/logger'

export function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!mounted) return
        if (user) setIsAuthenticated(true)
      } catch (error) {
        if (!mounted) return
        logger.error('Failed to check auth in HeroSection', { error, component: 'HeroSection' })
      }
    }

    checkAuth()
    return () => { mounted = false }
  }, [])

  return (
    <section style={{ marginBottom: 'var(--spacing-6)' }}>
      {isAuthenticated ? (
        <Text variant="secondary" size="lg" style={{ marginTop: 'var(--spacing-4)' }}>
          Welcome back, Researcher. Your assignment continues.
        </Text>
      ) : (
        <>
          <Stack direction="horizontal" align="start" gap="normal">
            <Heading level={1} style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              SECURE{'\n'}CONTAIN{'\n'}PROTECT
            </Heading>
            <div
              style={{
                width: 'var(--spacing-1)',
                alignSelf: 'stretch',
                flexShrink: 0,
                backgroundColor: 'var(--color-accent)',
              }}
            />
          </Stack>
          <Text variant="secondary" size="lg" style={{ marginTop: 'var(--spacing-4)' }}>
            Access and track 9,300+ classified anomaly files.
          </Text>
        </>
      )}
    </section>
  )
}
