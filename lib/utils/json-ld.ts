import { AUTHOR_NAME, LICENSE_URL, SITE_NAME } from '@/lib/constants'

interface CreativeWorkParams {
  scp_id: string
  title: string
  description: string
  url: string
  isBasedOn: string
  isPartOf: {
    name: string
    url: string
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface CollectionPageParams {
  name: string
  description: string
  url: string
}

/**
 * Generate JSON-LD schema for a CreativeWork (SCP article).
 * Used on SCP detail pages.
 */
export function generateCreativeWorkJsonLd(params: CreativeWorkParams) {
  // Only format as "SCP-XXX — Title" when title is distinct and non-empty
  const trimmedTitle = params.title?.trim()
  const hasDistinctTitle = trimmedTitle && trimmedTitle !== params.scp_id
  const name = hasDistinctTitle ? `${params.scp_id} — ${trimmedTitle}` : params.scp_id

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description: params.description,
    url: params.url,
    isBasedOn: params.isBasedOn,
    isPartOf: {
      '@type': 'CollectionPage',
      name: params.isPartOf.name,
      url: params.isPartOf.url,
    },
    license: LICENSE_URL,
    author: {
      '@type': 'Organization',
      name: AUTHOR_NAME,
    },
  }
}

/**
 * Generate JSON-LD schema for a BreadcrumbList.
 * Reusable for both SCP and Series pages.
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate JSON-LD schema for a CollectionPage (Series page).
 * Used on Series list pages.
 */
export function generateCollectionPageJsonLd(params: CollectionPageParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: params.url,
  }
}

/**
 * Generate JSON-LD schemas for the homepage.
 * Returns WebApplication + WebSite schemas.
 */
export function generateHomepageJsonLd(siteUrl: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: siteUrl,
      description:
        'Browse and track your reading progress through 9,300+ SCP Foundation entries. A free reading companion for SCP completionists.',
      applicationCategory: 'Entertainment',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      creator: {
        '@type': 'Person',
        name: 'Edward Stone',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: siteUrl,
    },
  ]
}
