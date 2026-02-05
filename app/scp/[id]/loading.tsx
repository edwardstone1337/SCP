import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/typography'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

export default function ScpReaderLoading() {
  return (
    <>
      <Main>
        <Container size="lg">
          <Stack
            direction="vertical"
            gap="normal"
            align="center"
            justify="center"
            style={{ minHeight: '50vh', padding: 'var(--spacing-8)' }}
          >
            <Spinner size="lg" />
            <Text variant="secondary" size="sm">
              {getLoadingMessage('reader')}
            </Text>
          </Stack>
        </Container>
      </Main>
    </>
  )
}
