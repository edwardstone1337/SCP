import { Stack } from '@/components/ui/stack'
import { Mono, Text } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { Button } from '@/components/ui/button'

export interface RecentlyViewedItem {
  scp_id: string    // e.g. "SCP-173"
  title: string
  viewed_at: string
}

interface RecentlyViewedSectionProps {
  items: RecentlyViewedItem[]
  isAuthenticated: boolean
}

export function RecentlyViewedSection({ items, isAuthenticated }: RecentlyViewedSectionProps) {
  // Guest: prompt to sign in
  if (!isAuthenticated) {
    return (
      <section style={{ marginBottom: 'var(--spacing-6)' }}>
        <Stack direction="vertical" gap="normal">
          <Text size="sm" variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recently Viewed
          </Text>
          <Text variant="secondary">Sign in to track your reading history.</Text>
          <Button href="/login" variant="secondary" size="sm">Sign In</Button>
        </Stack>
      </section>
    )
  }

  // Authenticated but no items yet
  if (items.length === 0) {
    return (
      <section style={{ marginBottom: 'var(--spacing-6)' }}>
        <Stack direction="vertical" gap="normal">
          <Text size="sm" variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recently Viewed
          </Text>
          <Text variant="secondary">Articles you read will appear here.</Text>
        </Stack>
      </section>
    )
  }

  // Authenticated with items
  return (
    <section style={{ marginBottom: 'var(--spacing-6)' }}>
      <Stack direction="vertical" gap="normal">
        <Text size="sm" variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Recently Viewed
        </Text>
        <Stack direction="vertical" gap="tight">
          {items.map((item) => (
            <Link key={item.scp_id} href={`/scp/${item.scp_id}`} variant="default">
              <Card variant="interactive" padding="sm">
                <Stack direction="horizontal" align="center" justify="between">
                  <Stack direction="vertical" gap="tight">
                    <Text>{item.title}</Text>
                    <Mono size="sm">{item.scp_id}</Mono>
                  </Stack>
                </Stack>
              </Card>
            </Link>
          ))}
        </Stack>
      </Stack>
    </section>
  )
}

