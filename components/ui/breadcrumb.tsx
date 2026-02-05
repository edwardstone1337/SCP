import { Link } from '@/components/ui/link'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn(className)}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--spacing-1)',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: 'var(--font-size-sm)',
          lineHeight: 'var(--line-height-sm)',
        }}
      >
        {items.map((item, index) => {
          const showSeparator = index > 0

          return (
            <li
              key={`${item.label}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
              }}
            >
              {showSeparator && (
                <span
                  aria-hidden
                  style={{
                    color: 'var(--color-text-muted)',
                    userSelect: 'none',
                  }}
                >
                  ›
                </span>
              )}
              {item.href != null ? (
                <Link href={item.href} variant="default">
                  {item.label}
                </Link>
              ) : (
                <Text variant="secondary" size="sm">
                  {item.label}
                </Text>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
