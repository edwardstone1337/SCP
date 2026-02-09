import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getLoadingMessage } from '@/lib/utils/loading-messages'

export default function Loading() {
  return (
    <Main>
      <Container size="lg">
        <Stack gap="section" style={{ paddingTop: 'var(--spacing-4)', paddingBottom: 'var(--spacing-8)' }}>
          <section>
            <Stack direction="horizontal" align="start" gap="normal">
              <Stack gap="tight" style={{ flex: 1 }}>
                <Skeleton width="72%" height="3rem" />
                <Skeleton width="84%" height="3rem" />
                <Skeleton width="64%" height="3rem" />
              </Stack>
              <Skeleton width="var(--spacing-1)" height="80px" radius="var(--radius-sm)" />
            </Stack>
            <Skeleton width="56%" height="1.25rem" style={{ marginTop: 'var(--spacing-4)' }} />
          </section>

          <Card padding="lg">
            <Stack gap="normal">
              <Skeleton width="42%" height="1rem" />
              <Skeleton width="88%" height="2.5rem" />
              <Skeleton width="72%" height="1.125rem" />
            </Stack>
          </Card>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 'var(--spacing-card-gap)',
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} padding="md">
                <Stack gap="tight">
                  <Skeleton width="55%" height="1rem" />
                  <Skeleton width="78%" height="1.25rem" />
                  <Skeleton width="40%" height="0.875rem" />
                </Stack>
              </Card>
            ))}
          </div>

          <Text variant="secondary" size="sm" style={{ textAlign: 'center' }}>
            {getLoadingMessage('series')}
          </Text>
        </Stack>
      </Container>
    </Main>
  )
}
