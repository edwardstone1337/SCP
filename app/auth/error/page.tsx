export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { AuthErrorClient } from './client'
import { Main } from '@/components/ui/main'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <Main>
        <Stack direction="vertical" align="center" justify="center" style={{ minHeight: '100vh' }}>
          <Container size="xs">
            <Card padding="lg" accentBorder style={{ width: '100%' }}>
              <Stack direction="vertical" gap="normal">
                <Skeleton width="60%" height="1.5rem" />
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="70%" height="2.75rem" radius="var(--radius-button)" />
                <Text variant="secondary" size="sm" style={{ textAlign: 'center' }}>
                  {getLoadingMessage('auth')}
                </Text>
              </Stack>
            </Card>
          </Container>
        </Stack>
      </Main>
    }>
      <AuthErrorClient />
    </Suspense>
  )
}
