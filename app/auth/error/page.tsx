export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { AuthErrorClient } from './client'
import { Main } from '@/components/ui/main'
import { Stack } from '@/components/ui/stack'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/typography'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <Main>
        <Stack direction="vertical" align="center" justify="center" style={{ minHeight: '100vh' }}>
          <Spinner size="md" />
          <Text variant="secondary">Loading...</Text>
        </Stack>
      </Main>
    }>
      <AuthErrorClient />
    </Suspense>
  )
}
