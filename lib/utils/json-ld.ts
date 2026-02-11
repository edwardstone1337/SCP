import { AUTHOR_NAME, LICENSE_URL } from '@/lib/constants'

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
