import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Heading, Text, Mono } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

export default function NotFound() {
  return (
    <Main>
      <Container size="sm">
        <Stack direction="vertical" gap="loose" align="center" style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)' }}>
          <Logo size="lg" />

          <div>
            <Mono size="lg" style={{ color: 'var(--color-accent)' }}>
              ERROR 404
            </Mono>
            <Heading level={1} style={{ marginTop: 'var(--spacing-2)' }}>
              DOCUMENT NOT FOUND
            </Heading>
          </div>

          <Text variant="secondary" style={{ maxWidth: '400px' }}>
            The requested file has been redacted, reclassified, or does not exist in the Foundation database.
            This incident has been logged.
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
              If you believe this is an error, contact your Site Director or return to the main archive.
            </Text>
          </div>

          <Stack direction="horizontal" gap="normal" style={{ marginTop: 'var(--spacing-4)' }}>
            <Button href="/" variant="primary">
              Return to Archive
            </Button>
            <Button href="/" variant="secondary">
              Home
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Main>
  )
}
