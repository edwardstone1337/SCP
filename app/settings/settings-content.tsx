'use client'

import { CSSProperties, useCallback, useState } from 'react'
import { usePreferences } from '@/lib/hooks/use-preferences'
import { PremiumGate } from '@/components/ui/premium-gate'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeleteAccountModal } from '@/components/ui/delete-account-modal'
import { useModal } from '@/components/ui/modal-provider'
import { Stack } from '@/components/ui/stack'
import { Toggle } from '@/components/ui/toggle'
import { Heading, Text } from '@/components/ui/typography'
import { logger } from '@/lib/logger'
import { flags } from '@/lib/flags'
import { usePremium } from '@/lib/hooks/use-premium'
import { PremiumBadge } from '@/components/ui/premium-badge'

interface SettingsContentProps {
  userId: string
  userEmail?: string
}

const sectionStyle: CSSProperties = {
  borderBottom: '1px solid var(--color-surface-border)',
  paddingBottom: 'var(--spacing-4)',
}

const savedIndicatorStyle: CSSProperties = {
  color: 'var(--color-green-5)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  transition: 'opacity var(--transition-base)',
}

const dangerZoneHeadingStyle: CSSProperties = {
  color: 'var(--color-red-7)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: 'var(--spacing-3)',
}

export function SettingsContent({ userId, userEmail }: SettingsContentProps) {
  const { openModal } = useModal()
  const { preferences, updatePreference, isLoading } = usePreferences(userId)
  const { isPremium } = usePremium(userId)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const showPremiumFeatures = flags.premiumEnabled || isPremium

  const handleImageSafeModeToggle = useCallback(
    async (newValue: boolean) => {
      setSaveMessage(null)

      try {
        await updatePreference('imageSafeMode', newValue)
        setSaveMessage('Saved')
        setTimeout(() => setSaveMessage(null), 2000)
      } catch (err) {
        logger.error('Failed to toggle image safe mode', {
          error: err instanceof Error ? err.message : String(err),
          component: 'SettingsContent',
        })
        setSaveMessage('Failed to save')
        setTimeout(() => setSaveMessage(null), 3000)
      }
    },
    [updatePreference]
  )

  return (
      <Stack direction="vertical" gap="loose">
      {/* Reading Preferences */}
      <section style={sectionStyle}>
        <Stack direction="vertical" gap="normal">
          <Heading level={2}>Reading Preferences</Heading>

          {showPremiumFeatures ? (
            <PremiumGate userId={userId} featureName="Image Safe Mode">
              <Stack direction="horizontal" align="center" justify="between" gap="normal">
                <div>
                  <Text size="sm" style={{ fontWeight: 500 }}>
                    Image Safe Mode
                  </Text>
                  <Text variant="secondary" size="sm">
                    Hide images by default — tap to reveal individual images while reading
                  </Text>
                </div>
                <Stack direction="horizontal" align="center" gap="tight">
                  {saveMessage && (
                    <span
                      style={{
                        ...savedIndicatorStyle,
                        color: saveMessage === 'Saved' ? 'var(--color-green-5)' : 'var(--color-red-7)',
                      }}
                      role="status"
                      aria-live="polite"
                    >
                      {saveMessage}
                    </span>
                  )}
                  <Toggle
                    checked={!!preferences.imageSafeMode}
                    onCheckedChange={handleImageSafeModeToggle}
                    disabled={isLoading}
                    ariaLabel="Toggle image safe mode"
                  />
                </Stack>
              </Stack>
            </PremiumGate>
          ) : (
            <Text variant="secondary" size="sm">
              No reading preferences available yet. More options coming soon.
            </Text>
          )}

          {/* Future settings: font size, theme, line height, etc. */}
        </Stack>
      </section>

      {/* Account section */}
      <section>
        <Stack direction="vertical" gap="normal">
          <Heading level={2}>Account</Heading>
          {userEmail && (
            <Text size="sm" variant="secondary" as="p" style={{ margin: 0 }}>
              Signed in as {userEmail}
              {flags.premiumEnabled && isPremium && (
                <span style={{ marginLeft: 'var(--spacing-1)' }}>
                  <PremiumBadge />
                </span>
              )}
            </Text>
          )}
          <Heading level={3} style={dangerZoneHeadingStyle}>Danger Zone</Heading>
          <Card variant="bordered" accentBorder>
            <Stack
              direction={{ base: 'vertical', md: 'horizontal' }}
              align={{ base: 'stretch', md: 'center' }}
              justify={{ md: 'between' }}
              gap="normal"
            >
              <div>
                <Text as="span" size="sm" style={{ fontWeight: 700, display: 'block' }}>Delete Account</Text>
                <Text as="p" size="sm" variant="secondary" style={{ margin: 'var(--spacing-1) 0 0' }}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </Text>
              </div>
              <Button variant="danger" onClick={() => openModal(<DeleteAccountModal />, 'Delete Account')}>
                Delete Account
              </Button>
            </Stack>
          </Card>
        </Stack>
      </section>
      </Stack>
  )
}
