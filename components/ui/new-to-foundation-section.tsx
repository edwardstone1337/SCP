'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Stack } from '@/components/ui/stack'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

function formatScpId(num: number): string {
  const padded = num.toString().padStart(3, '0')
  return `SCP-${padded}`
}

export function NewToFoundationSection() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setIsAuthenticated(true)
    })
  }, [])

  if (isAuthenticated) return null

  const handleRandomFile = () => {
    const num = Math.floor(Math.random() * 9324) + 1
    router.push(`/scp/${formatScpId(num)}`)
  }

  return (
    <section style={{ marginBottom: 'var(--spacing-6)' }}>
      <Stack direction="vertical" gap="normal">
        <Heading
          level={2}
          className="text-sm font-normal text-[var(--color-text-secondary)]"
          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          New to the Foundation?
        </Heading>
        <Text variant="secondary">
          The SCP Foundation is a collaborative fiction project documenting thousands of anomalous
          objects, entities, and phenomena. SCP Reader lets you browse the full archive and track
          your progress through all 9,300+ entries — so you never lose your place.
        </Text>
        <Stack direction="horizontal" gap="tight" style={{ flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" href="/series/series-1">
            Start with the Classics
          </Button>
          <Button variant="secondary" size="sm" href="/top-rated">
            Read the Highest Rated
          </Button>
          <Button variant="secondary" size="sm" onClick={handleRandomFile}>
            Random File
          </Button>
        </Stack>
      </Stack>
    </section>
  )
}
