import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

export default function SeriesRangeLoading() {
  return (
    <Main>
      <Container size="md">
        <Stack gap="normal" style={{ minHeight: '40vh', padding: 'var(--spacing-6) 0' }}>
          <Skeleton width="220px" height="0.875rem" />
          <Skeleton width="320px" height="2rem" />

          <Stack gap="normal">
            {Array.from({ length: 7 }).map((_, index) => (
              <Card key={index} padding="md">
                <Stack direction="horizontal" justify="between" align="center">
                  <Stack gap="tight" style={{ flex: 1 }}>
                    <Skeleton width="45%" height="1.125rem" />
                    <Skeleton width="30%" height="0.875rem" />
                  </Stack>
                  <Skeleton width="64px" height="64px" radius="var(--radius-full)" />
                </Stack>
              </Card>
            ))}
          </Stack>

          <Text variant="secondary" size="sm" style={{ textAlign: 'center' }}>
            {getLoadingMessage('series')}
          </Text>
        </Stack>
      </Container>
    </Main>
  )
}
