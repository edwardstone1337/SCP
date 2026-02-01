import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { Heading } from '@/components/ui/typography'
import { Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Stack } from '@/components/ui/stack'

export default function Home() {
  return (
    <Main className="flex flex-col">
      {/* Logo - mb-12 (48px) */}
      <Stack style={{ marginBottom: 'var(--spacing-6)' }}>
        <Logo size="md" />
      </Stack>

      {/* Main Content - Centered */}
      <Stack
        justify="center"
        style={{
          flex: 1,
          marginBottom: 'var(--spacing-6)',
        }}
      >
        <Container size="xs">
          <Stack style={{ gap: 'var(--spacing-8)' }}>
            {/* Title Block - mb-16 (64px) */}
            <Stack direction="horizontal" align="start" gap="normal">
              <Heading level={1} className="leading-tight tracking-tight">
                SECURE<br />
                CONTAIN<br />
                PROTECT
              </Heading>
              {/* Red accent bar - unique to home, no component */}
              <div
                style={{
                  width: 4,
                  height: 80,
                  marginTop: 4,
                  flexShrink: 0,
                  backgroundColor: 'var(--color-accent)',
                }}
              />
            </Stack>

            {/* Warning Block - mb-12 (48px) */}
            <Stack style={{ gap: 'var(--spacing-4)' }}>
              <Heading level={3} accent>
                WARNING
              </Heading>
              <Heading level={4} className="leading-tight">
                THE FOUNDATION DATABASE<br />IS CLASSIFIED
              </Heading>
              <Text variant="secondary" size="lg" className="leading-relaxed">
                Access by unauthorized personnel is strictly prohibited.
                Perpetrators will be tracked, located, and detained
              </Text>
            </Stack>
          </Stack>
        </Container>
      </Stack>

      {/* Continue Button - Bottom */}
      <Stack style={{ marginTop: 'auto' }}>
        <Button href="/series" variant="primary" fullWidth size="lg">
          Continue
        </Button>
      </Stack>
    </Main>
  )
}
