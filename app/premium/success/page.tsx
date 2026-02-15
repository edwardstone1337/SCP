import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Heading, Text, Mono } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { PremiumCacheInvalidator } from '@/app/premium/success/premium-cache-invalidator'

export const metadata = {
  title: 'Clearance Upgraded — SCP Reader',
}

export default function PremiumSuccessPage() {
  return (
    <Main>
      <PremiumCacheInvalidator />
      <Container size="sm">
        <Stack direction="vertical" gap="loose" align="center" style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)' }}>
          <div>
            <Mono size="lg" style={{ color: 'var(--color-green-5)' }}>
              UPGRADE CONFIRMED
            </Mono>
            <Heading level={1} style={{ marginTop: 'var(--spacing-2)' }}>
              Clearance Level Upgraded
            </Heading>
          </div>

          <Text variant="secondary" style={{ maxWidth: '400px' }}>
            Your security clearance has been elevated. Premium access is now active on your account.
          </Text>

          <div
            style={{
              padding: 'var(--spacing-3)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-surface-border)',
              marginTop: 'var(--spacing-2)',
            }}
          >
            <Text size="sm" variant="secondary">
              All premium features are now available. Return to the archive to continue your research.
            </Text>
          </div>

          <Button href="/" variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>
            Return to Archive
          </Button>
        </Stack>
      </Container>
    </Main>
  )
}
