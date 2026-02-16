import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sign In — SCP Reader',
  robots: { index: false, follow: false },
}

import { Suspense } from 'react'
import { SignInPanel } from '@/components/ui/sign-in-panel'
import { Main } from '@/components/ui/main'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams
  const redirectParam = Array.isArray(resolvedSearchParams.redirect)
    ? resolvedSearchParams.redirect[0]
    : resolvedSearchParams.redirect

  return (
    <Suspense fallback={
      <Main>
        <Stack direction="vertical" align="center" justify="center" style={{ minHeight: '100vh' }}>
          <Container size="xs">
            <Card padding="lg" style={{ width: '100%' }}>
              <Stack direction="vertical" gap="normal">
                <Skeleton width="55%" height="1.5rem" />
                <Skeleton width="100%" height="2.75rem" radius="var(--radius-input)" />
                <Skeleton width="100%" height="2.75rem" radius="var(--radius-button)" />
                <Text variant="secondary" size="sm" style={{ textAlign: 'center' }}>
                  {getLoadingMessage('auth')}
                </Text>
              </Stack>
            </Card>
          </Container>
        </Stack>
      </Main>
    }>
      <SignInPanel context="page" redirectTo={redirectParam || '/'} />
    </Suspense>
  )
}
