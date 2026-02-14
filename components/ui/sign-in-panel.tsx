'use client'

import { CSSProperties, FormEvent, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getSiteUrl } from '@/lib/utils/site-url'
import { trackSignInModalClose, trackSignInSubmit, type SignInTrigger } from '@/lib/analytics'
import { logger } from '@/lib/logger'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Card } from '@/components/ui/card'
import { Text, Label } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface SignInPanelProps {
  redirectTo?: string
  context?: 'modal' | 'page'
  triggerSource?: SignInTrigger
}

export function SignInPanel({
  redirectTo = '/',
  context = 'modal',
  triggerSource,
}: SignInPanelProps) {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const submitSucceededRef = useRef(false)

  useEffect(() => {
    const urlError = context === 'page' ? searchParams.get('error') : null
    if (urlError) {
      setErrorText(urlError)
    }
  }, [context, searchParams])

  useEffect(() => {
    return () => {
      if (context === 'modal' && triggerSource && !submitSucceededRef.current) {
        trackSignInModalClose(triggerSource)
      }
    }
  }, [context, triggerSource])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmedEmail = email.trim()

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorText('Enter a valid clearance email to continue.')
      return
    }

    setErrorText(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        setErrorText(error.message)
        return
      }

      trackSignInSubmit('magic_link')
      submitSucceededRef.current = true
      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      logger.error('Sign-in panel OTP request failed', {
        error: err instanceof Error ? err.message : 'Unknown error',
      })
      setErrorText('Unable to dispatch access link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorText(null)
    setIsGoogleLoading(true)

    try {
      const supabase = createClient()
      const redirectUrl = `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(redirectTo)}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        setErrorText(error.message)
        setIsGoogleLoading(false)
        return
      }

      trackSignInSubmit('google')
      submitSucceededRef.current = true
      // Browser will redirect to Google — no need to reset loading state
    } catch (err) {
      logger.error('Sign-in panel Google OAuth failed', {
        error: err instanceof Error ? err.message : 'Unknown error',
      })
      setErrorText('Unable to start Google sign-in. Please try again.')
      setIsGoogleLoading(false)
    }
  }

  const panelBodyStyle: CSSProperties = {
    width: '100%',
  }

  const headingStyle: CSSProperties = {
    fontSize: 'var(--font-size-2xl)',
    lineHeight: 'var(--line-height-2xl)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  }

  const subtextStyle: CSSProperties = {
    fontSize: 'var(--font-size-base)',
    lineHeight: 'var(--line-height-base)',
  }

  const benefitsListStyle: CSSProperties = {
    listStyle: 'disc',
    paddingLeft: 'var(--spacing-3)',
    display: 'grid',
    gap: 'var(--spacing-1)',
  }

  const benefitItemStyle: CSSProperties = {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
  }

  const formRegionStyle: CSSProperties = {
    minHeight: 'calc(var(--spacing-16) + var(--spacing-10))',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }

  const errorStyle: CSSProperties = {
    color: 'var(--color-red-7)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
  }

  const trustLineStyle: CSSProperties = {
    textAlign: 'center',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
  }

  const content = (
    <Stack direction="vertical" gap="normal" style={panelBodyStyle}>
      <Stack direction="vertical" gap="tight">
        <h1 style={headingStyle}>Request Archive Access</h1>
        <Text variant="secondary" style={subtextStyle}>
          Verify your identity to unlock your personal archive terminal.
        </Text>
      </Stack>

      <ul style={benefitsListStyle}>
        <li style={benefitItemStyle}>Track your reading progress across all series</li>
        <li style={benefitItemStyle}>Bookmark SCPs for later review</li>
        <li style={benefitItemStyle}>Access your recently viewed files</li>
      </ul>

      <div style={formRegionStyle}>
        {isSuccess ? (
          <div role="status" aria-live="polite">
            <Text variant="secondary" style={subtextStyle}>
              Access link dispatched. Check your inbox to verify your clearance.
            </Text>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack direction="vertical" gap="normal">
              <div>
                <Label htmlFor="clearance-email">Clearance Email</Label>
                <Input
                  id="clearance-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading || isGoogleLoading}
                />
              </div>

              {errorText && (
                <div role="alert" style={errorStyle}>
                  {errorText}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading || isGoogleLoading || email.trim().length === 0}
              >
                Send Access Link
              </Button>

              <Text variant="muted" style={trustLineStyle}>
                No password required. A one-time secure link will be sent to your inbox.
              </Text>
            </Stack>
          </form>
        )}
      </div>

      <Stack direction="vertical" gap="tight">
        <Text variant="muted" style={trustLineStyle}>
          — or —
        </Text>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          loading={isGoogleLoading}
          disabled={isGoogleLoading || isLoading}
          onClick={handleGoogleSignIn}
        >
          {!isGoogleLoading && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              style={{ marginRight: 'var(--spacing-1)', flexShrink: 0 }}
              aria-hidden="true"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </Button>
      </Stack>
    </Stack>
  )

  if (context === 'modal') {
    return content
  }

  return (
    <Main>
      <Stack direction="vertical" align="center" justify="center" style={{ minHeight: '100%' }}>
        <Container size="xs">
          <Card padding="lg" style={{ width: '100%' }}>
            {content}
          </Card>
        </Container>
      </Stack>
    </Main>
  )
}
