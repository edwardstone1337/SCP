import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/typography'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

export default function Loading() {
  return (
    <Main>
      <Container size="lg">
        <Stack align="center" style={{ paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)' }}>
          <Spinner size="lg" />
          <Text variant="secondary" size="sm">{getLoadingMessage('series')}</Text>
        </Stack>
      </Container>
    </Main>
  )
}
