import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

export default function ScpReaderLoading() {
  return (
    <Main>
      <Container size="lg">
        <Stack gap="normal" style={{ minHeight: '50vh', padding: 'var(--spacing-4) 0 var(--spacing-8)' }}>
          <Skeleton width="260px" height="0.875rem" />
          <Stack direction="horizontal" justify="between" align="center">
            <Skeleton width="120px" height="2.5rem" radius="var(--radius-button)" />
            <Skeleton width="120px" height="2.5rem" radius="var(--radius-button)" />
          </Stack>

          <Stack direction="horizontal" justify="between" align="start" style={{ gap: 'var(--spacing-4)' }}>
            <Stack gap="tight" style={{ flex: 1 }}>
              <Skeleton width="70%" height="2.25rem" />
              <Skeleton width="35%" height="1rem" />
            </Stack>
            <Stack direction="horizontal" gap="tight">
              <Skeleton width="104px" height="2.5rem" radius="var(--radius-button)" />
              <Skeleton width="104px" height="2.5rem" radius="var(--radius-button)" />
            </Stack>
          </Stack>

          <Card padding="lg">
            <Stack gap="normal">
              <Skeleton width="96%" height="1rem" />
              <Skeleton width="90%" height="1rem" />
              <Skeleton width="94%" height="1rem" />
              <Skeleton width="82%" height="1rem" />
              <Skeleton width="88%" height="1rem" />
              <Skeleton width="79%" height="1rem" />
              <Skeleton width="92%" height="1rem" />
              <Skeleton width="84%" height="1rem" />
            </Stack>
          </Card>

          <Text variant="secondary" size="sm" style={{ textAlign: 'center' }}>
            {getLoadingMessage('reader')}
          </Text>
        </Stack>
      </Container>
    </Main>
  )
}
