import { Navigation } from '@/components/navigation'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/typography'

export default function SeriesRangeLoading() {
  return (
    <>
      <Navigation />
      <Main>
        <Container size="md">
          <Stack
            direction="vertical"
            gap="normal"
            align="center"
            justify="center"
            style={{ minHeight: '40vh', padding: 'var(--spacing-8)' }}
          >
            <Spinner size="lg" />
            <Text variant="secondary" size="sm">
              Loading...
            </Text>
          </Stack>
        </Container>
      </Main>
    </>
  )
}
