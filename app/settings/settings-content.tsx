'use client'

import { CSSProperties, useCallback, useState } from 'react'
import { usePreferences } from '@/lib/hooks/use-preferences'
import { PremiumGate } from '@/components/ui/premium-gate'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { logger } from '@/lib/logger'

interface SettingsContentProps {
  userId: string
}

const sectionHeadingStyle: CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  lineHeight: 'var(--line-height-lg)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  margin: 0,
}

const sectionStyle: CSSProperties = {
  borderBottom: '1px solid var(--color-surface-border)',
  paddingBottom: 'var(--spacing-4)',
}

const toggleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--spacing-2)',
}

const switchTrackStyle = (checked: boolean): CSSProperties => ({
  position: 'relative',
  width: '44px',
  height: '24px',
  backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-grey-7)',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'background-color var(--transition-base)',
  flexShrink: 0,
  border: 'none',
  padding: 0,
})

const switchThumbStyle = (checked: boolean): CSSProperties => ({
  position: 'absolute',
  top: '2px',
  left: checked ? '22px' : '2px',
  width: '20px',
  height: '20px',
  backgroundColor: 'var(--color-text-primary)',
  borderRadius: '50%',
  transition: 'left var(--transition-base)',
  pointerEvents: 'none',
})

const savedIndicatorStyle: CSSProperties = {
  color: 'var(--color-green-5)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  transition: 'opacity var(--transition-base)',
}

export function SettingsContent({ userId }: SettingsContentProps) {
  const { preferences, updatePreference, isLoading } = usePreferences(userId)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleImageSafeModeToggle = useCallback(async () => {
    const newValue = !preferences.imageSafeMode
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
  }, [preferences.imageSafeMode, updatePreference])

  return (
    <Stack direction="vertical" gap="loose">
      {/* Reading Preferences */}
      <section style={sectionStyle}>
        <Stack direction="vertical" gap="normal">
          <h2 style={sectionHeadingStyle}>Reading Preferences</h2>

          <PremiumGate userId={userId} featureName="Image Safe Mode">
            <div style={toggleRowStyle}>
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
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!preferences.imageSafeMode}
                  aria-label="Toggle image safe mode"
                  disabled={isLoading}
                  onClick={handleImageSafeModeToggle}
                  style={switchTrackStyle(!!preferences.imageSafeMode)}
                >
                  <span style={switchThumbStyle(!!preferences.imageSafeMode)} />
                </button>
              </Stack>
            </div>
          </PremiumGate>

          {/* Future settings: font size, theme, line height, etc. */}
        </Stack>
      </section>

      {/* Account section */}
      <section>
        <Stack direction="vertical" gap="normal">
          <h2 style={sectionHeadingStyle}>Account</h2>
          <Text variant="secondary" size="sm">
            Account management options are available in the navigation menu.
          </Text>
          {/* TODO: Move Delete Account functionality here from nav in a future phase */}
        </Stack>
      </section>
    </Stack>
  )
}
