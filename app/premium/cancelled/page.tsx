import type { Metadata } from 'next'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Heading, Text, Mono } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Upgrade Cancelled — SCP Reader',
  robots: { index: false, follow: false },
}

export default function PremiumCancelledPage() {
  return (
    <Main>
      <Container size="sm">
        <Stack direction="vertical" gap="loose" align="center" style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)' }}>
          <div>
            <Mono size="lg" style={{ color: 'var(--color-text-muted)' }}>
              REQUEST WITHDRAWN
            </Mono>
            <Heading level={1} style={{ marginTop: 'var(--spacing-2)' }}>
              Clearance Upgrade Cancelled
            </Heading>
          </div>

          <Text variant="secondary" style={{ maxWidth: '400px' }}>
            Your upgrade request has been withdrawn. No charges were made. You can request an upgrade again at any time.
          </Text>

          <Button href="/" variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>
            Return to Archive
          </Button>
        </Stack>
      </Container>
    </Main>
  )
}
