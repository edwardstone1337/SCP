'use client'

import { CSSProperties, useState } from 'react'
import { useModal } from '@/components/ui/modal-provider'
import { Stack } from '@/components/ui/stack'
import { Text, Mono } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

const headingStyle: CSSProperties = {
  fontSize: 'var(--font-size-xl)',
  lineHeight: 'var(--line-height-xl)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  margin: 0,
}

const classificationStyle: CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--color-accent)',
}

const featureListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: 'var(--spacing-1)',
}

const featureItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-1)',
  color: 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
}

const checkStyle: CSSProperties = {
  color: 'var(--color-green-5)',
  flexShrink: 0,
}

const comingSoonStyle: CSSProperties = {
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-xs)',
  marginLeft: 'var(--spacing-1)',
}

const errorStyle: CSSProperties = {
  color: 'var(--color-red-7)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
}

const dismissStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
  fontFamily: 'var(--font-family-sans)',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
}

export function UpgradeModal() {
  const { closeModal } = useModal()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to start checkout. Please try again.')
        setIsLoading(false)
        return
      }

      if (!data.url) {
        setError('Failed to start checkout. Please try again.')
        setIsLoading(false)
        return
      }

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (err) {
      logger.error('Upgrade modal checkout failed', {
        error: err instanceof Error ? err.message : String(err),
        component: 'UpgradeModal',
      })
      setError('Unable to connect to payment service. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Stack direction="vertical" gap="normal">
      <Stack direction="vertical" gap="tight">
        <Mono style={classificationStyle}>Clearance Upgrade</Mono>
        <h2 style={headingStyle}>Upgrade to Clearance Level 5</h2>
        <Text variant="secondary" size="sm">
          Unlock advanced containment tools for your archive terminal.
        </Text>
      </Stack>

      <ul style={featureListStyle}>
        <li style={featureItemStyle}>
          <span style={checkStyle} aria-hidden="true">✓</span>
          Image Safe Mode — hide and reveal images on tap
        </li>
        <li style={featureItemStyle}>
          <span style={checkStyle} aria-hidden="true">✓</span>
          Reading settings
          <span style={comingSoonStyle}>(coming soon)</span>
        </li>
        <li style={featureItemStyle}>
          <span style={checkStyle} aria-hidden="true">✓</span>
          Achievements
          <span style={comingSoonStyle}>(coming soon)</span>
        </li>
      </ul>

      {error && (
        <div role="alert" style={errorStyle}>
          {error}
        </div>
      )}

      <Stack direction="vertical" gap="tight" align="center">
        <Button
          variant="primary"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          onClick={handleUpgrade}
        >
          Upgrade Now
        </Button>
        <button
          type="button"
          onClick={closeModal}
          disabled={isLoading}
          style={dismissStyle}
        >
          Maybe later
        </button>
      </Stack>
    </Stack>
  )
}
