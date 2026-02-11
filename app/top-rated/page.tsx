import { Metadata } from 'next'
import { createStaticClient } from '@/lib/supabase/static'
import { logger } from '@/lib/logger'
import { getSiteUrl } from '@/lib/utils/site-url'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { TopRatedContent } from './top-rated-content'

export const revalidate = 2592000 // 30 days

interface ScpRow {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  is_read: boolean
  is_bookmarked: boolean
  rank: number
}

async function getTopRatedScps(): Promise<ScpRow[]> {
  const supabase = createStaticClient()

  const { data: scpsData, error: scpsError } = await supabase
    .from('scps')
    .select('id, scp_id, scp_number, title, rating')
    .order('rating', { ascending: false })
    .limit(100)

  if (scpsError) {
    logger.error('Failed to fetch top rated SCPs', { error: scpsError.message })
  }
  if (!scpsData) return []

  return scpsData.map((scp, index) => ({
    ...scp,
    rating: scp.rating ?? 0,
    is_read: false,
    is_bookmarked: false,
    rank: index + 1,
  }))
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Top 100 Highest Rated SCPs'
  const description = 'The 100 highest rated SCP Foundation entries as voted by the community. Read and track your progress through the best SCPs.'
  const canonicalUrl = `${getSiteUrl()}/top-rated`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      siteName: 'SCP Reader',
      type: 'website',
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function TopRatedPage() {
  const scps = await getTopRatedScps()

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Top Rated' },
  ]

  return (
    <Main>
      <Container size="md">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title="Top 100 Rated SCPs" />
        <TopRatedContent scps={scps} />
      </Container>
    </Main>
  )
}
