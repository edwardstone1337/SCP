'use client'

import { CSSProperties, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { usePremium } from '@/lib/hooks/use-premium'
import { useModal } from '@/components/ui/modal-provider'
import { UpgradeModal } from '@/components/ui/upgrade-modal'
import { SignInPanel } from '@/components/ui/sign-in-panel'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { trackSignInModalOpen } from '@/lib/analytics'

interface PremiumGateProps {
  children: ReactNode
  userId: string | null
  featureName: string
}

const lockIconStyle: CSSProperties = {
  fontSize: 'var(--font-size-2xl)',
  lineHeight: 1,
}

const featureLabelStyle: CSSProperties = {
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

export function PremiumGate({ children, userId, featureName }: PremiumGateProps) {
  const { isPremium, isLoading } = usePremium(userId)
  const { openModal } = useModal()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Premium user — render children
  if (userId && isPremium) {
    return <>{children}</>
  }

  // Still loading premium status — show nothing to avoid flash
  if (userId && isLoading) {
    return null
  }

  const queryString = searchParams.toString()
  const redirectPath = `${pathname}${queryString ? `?${queryString}` : ''}`

  // Not signed in
  if (!userId) {
    return (
      <Card padding="md" variant="bordered">
        <Stack direction="vertical" gap="tight" align="center" style={{ textAlign: 'center' }}>
          <span aria-hidden="true" style={lockIconStyle}>🔒</span>
          <Text variant="secondary" size="sm">
            Sign in to access {featureName}
          </Text>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              trackSignInModalOpen('nav')
              openModal(
                <SignInPanel context="modal" redirectTo={redirectPath} triggerSource="nav" />,
                'Request Archive Access'
              )
            }}
          >
            Sign In
          </Button>
        </Stack>
      </Card>
    )
  }

  // Signed in but not premium
  return (
    <Card padding="md" variant="bordered">
      <Stack direction="vertical" gap="tight" align="center" style={{ textAlign: 'center' }}>
        <span aria-hidden="true" style={lockIconStyle}>🔒</span>
        <Text variant="secondary" size="sm" style={featureLabelStyle}>Premium Feature</Text>
        <Text variant="secondary" size="sm">
          {featureName} requires Clearance Level 5
        </Text>
        <Button
          variant="primary"
          size="sm"
          onClick={() => openModal(<UpgradeModal />, 'Upgrade to Premium')}
        >
          Upgrade
        </Button>
      </Stack>
    </Card>
  )
}
