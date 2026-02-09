import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

export default function RangeScpListLoading() {
  return (
    <Main>
      <Container size="md">
        <Stack gap="normal" style={{ minHeight: '40vh', padding: 'var(--spacing-6) 0' }}>
          <Skeleton width="240px" height="0.875rem" />
          <Skeleton width="260px" height="2rem" />

          <Card padding="md">
            <Stack direction="horizontal" justify="between" align="center">
              <Skeleton width="160px" height="1rem" />
              <Skeleton width="120px" height="2.5rem" radius="var(--radius-button)" />
            </Stack>
          </Card>

          <Stack gap="normal">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} padding="md">
                <Stack direction="horizontal" justify="between" align="center">
                  <Stack gap="tight" style={{ flex: 1 }}>
                    <Skeleton width="32%" height="0.875rem" />
                    <Skeleton width="68%" height="1.125rem" />
                    <Skeleton width="22%" height="0.875rem" />
                  </Stack>
                  <Stack direction="horizontal" gap="tight">
                    <Skeleton width="92px" height="2.5rem" radius="var(--radius-button)" />
                    <Skeleton width="92px" height="2.5rem" radius="var(--radius-button)" />
                  </Stack>
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
