'use client'

import { useSearchParams } from 'next/navigation'
import { Main } from '@/components/ui/main'
import { Stack } from '@/components/ui/stack'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

export function AuthErrorClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An authentication error occurred'

  return (
    <Main>
      <Stack direction="vertical" align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Container size="xs">
          <Card padding="lg" accentBorder>
            <Stack direction="vertical" gap="normal">
              <Heading level={2} accent>
                Authentication Error
              </Heading>
              <Text variant="secondary">
                {error}
              </Text>
              <Button href="/login" variant="primary">
                Try Again
              </Button>
            </Stack>
          </Card>
        </Container>
      </Stack>
    </Main>
  )
}
