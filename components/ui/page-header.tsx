'use client'

import { Link } from '@/components/ui/link'
import { Heading, Text } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/ui/stack'
import { CSSProperties } from 'react'

export interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
  badge?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  backHref,
  badge,
  className,
}: PageHeaderProps) {
  const containerStyle: CSSProperties = {
    marginBottom: 'var(--spacing-4)',
  }

  return (
    <header className={className} style={containerStyle}>
      <Stack gap="tight">
        {backHref && (
          <Link href={backHref} variant="back">
            ← Back
          </Link>
        )}
        <Heading level={1}>{title}</Heading>
        {badge && (
          <Badge variant="accent">{badge}</Badge>
        )}
        {description && (
          <Text variant="secondary">{description}</Text>
        )}
      </Stack>
    </header>
  )
}
