export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { Main } from '@/components/ui/main'
import { Stack } from '@/components/ui/stack'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/typography'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Main>
        <Stack direction="vertical" align="center" justify="center" style={{ minHeight: '100vh' }}>
          <Spinner size="md" />
          <Text variant="secondary">{getLoadingMessage('auth')}</Text>
        </Stack>
      </Main>
    }>
      <LoginForm />
    </Suspense>
  )
}
