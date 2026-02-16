import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { redirect } from 'next/navigation'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Text } from '@/components/ui/typography'
import { SavedList, type SavedScpItem } from '@/app/saved/saved-list'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Saved Articles — SCP Reader',
  robots: { index: false, follow: false },
}

interface BookmarkRow {
  scp_id: string
  bookmarked_at: string
  scps: {
    id: string
    scp_id: string
    scp_number: number
    title: string
    rating: number
    series: string
  } | null
}

async function getBookmarkedScps(userId: string): Promise<SavedScpItem[]> {
  const supabase = await createClient()

  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('user_bookmarks')
    .select(
      `
      scp_id,
      bookmarked_at,
      scps (
        id,
        scp_id,
        scp_number,
        title,
        rating,
        series
      )
    `
    )
    .eq('user_id', userId)
    .order('bookmarked_at', { ascending: false })

  if (bookmarksError) {
    logger.error('Failed to fetch bookmarks', { error: bookmarksError.message })
  }
  const rows = (bookmarks ?? []) as unknown as BookmarkRow[]
  const valid = rows.filter((r) => r.scps != null) as (BookmarkRow & { scps: NonNullable<BookmarkRow['scps']> })[]
  if (valid.length === 0) return []

  const scpIds = valid.map((r) => r.scps.id)
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('scp_id, is_read')
    .eq('user_id', userId)
    .in('scp_id', scpIds)

  const readMap = new Map(progressData?.map((p) => [p.scp_id, p.is_read]) ?? [])

  return valid.map((r) => ({
    id: r.scps.id,
    scp_id: r.scps.scp_id,
    scp_number: r.scps.scp_number,
    title: r.scps.title,
    rating: r.scps.rating,
    is_read: readMap.get(r.scps.id) ?? false,
    bookmarked_at: r.bookmarked_at,
  }))
}

export default async function SavedPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/saved')
  }

  const items = await getBookmarkedScps(user.id)

  return (
    <>
      <Main>
        <Container size="md">
          <Breadcrumb items={[{ label: 'Saved' }]} />
          <PageHeader title="Saved Articles" />
          {items.length === 0 ? (
            <Text variant="secondary" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
              No saved articles yet. Browse the Series to find SCPs to save.
            </Text>
          ) : (
            <SavedList items={items} userId={user.id} />
          )}
        </Container>
      </Main>
    </>
  )
}
