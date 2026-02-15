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
import { Heading, Text, Label } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Logo } from '@/components/ui/logo'

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
  const [showEmailForm, setShowEmailForm] = useState(false)
  const submitSucceededRef = useRef(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (showEmailForm && emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [showEmailForm])

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

  const subtextStyle: CSSProperties = {
    fontSize: 'var(--font-size-base)',
    lineHeight: 'var(--line-height-base)',
  }

  const benefitRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  }

  const errorStyle: CSSProperties = {
    color: 'var(--color-red-7)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
  }

  const googleButtonStyle: CSSProperties = {
    backgroundColor: '#fff',
    color: '#3c4043',
    borderColor: 'var(--color-grey-4)',
    fontWeight: 500,
  }


  const content = (
    <>
      <style>{`
        .email-expand-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows var(--transition-base) ease;
        }
        .email-expand-wrapper[data-expanded='true'] {
          grid-template-rows: 1fr;
        }
        .email-expand-wrapper > div {
          overflow: hidden;
        }
      `}</style>
      <Stack direction="vertical" gap="normal" style={panelBodyStyle}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2)' }}>
          <Logo size="sm" />
        </div>

        <Stack direction="vertical" gap="tight">
          <Heading level={2}>Create Your Free Account</Heading>
          <Text variant="secondary" style={subtextStyle}>
            Thousands of SCPs. Never lose your place.
          </Text>
        </Stack>

        <Stack direction="vertical" gap="tight">
          <div style={benefitRowStyle}>
            <Icon name="check-circle" size="sm" style={{ color: '#22c55e' }} />
            <Text variant="secondary" size="base" as="span">Mark SCPs as read as you go</Text>
          </div>
          <div style={benefitRowStyle}>
            <Icon name="check-circle" size="sm" style={{ color: '#22c55e' }} />
            <Text variant="secondary" size="base" as="span">See your progress at a glance</Text>
          </div>
          <div style={benefitRowStyle}>
            <Icon name="check-circle" size="sm" style={{ color: '#22c55e' }} />
            <Text variant="secondary" size="base" as="span">Bookmark your favorites for later</Text>
          </div>
          <div style={benefitRowStyle}>
            <Icon name="check-circle" size="sm" style={{ color: '#22c55e' }} />
            <Text variant="secondary" size="base" as="span">Pick up right where you left off</Text>
          </div>
        </Stack>

        {errorText && (
          <div role="alert" style={errorStyle}>
            {errorText}
          </div>
        )}

        <Stack direction="vertical" gap="normal" style={{ marginTop: 'var(--spacing-1)' }}>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={isGoogleLoading}
            disabled={isGoogleLoading || isLoading}
            onClick={handleGoogleSignIn}
            style={googleButtonStyle}
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

          {!showEmailForm && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={isGoogleLoading}
              onClick={() => setShowEmailForm(true)}
              aria-expanded={showEmailForm}
            >
              Continue with Email
            </Button>
          )}
        </Stack>

        <div
          className="email-expand-wrapper"
          data-expanded={showEmailForm}
          aria-hidden={!showEmailForm}
        >
          <div>
            {isSuccess ? (
              <div role="status" aria-live="polite" style={{ padding: 'var(--spacing-1) 0' }}>
                <Text variant="secondary" style={subtextStyle}>
                  Access link dispatched. Check your inbox to verify your clearance.
                </Text>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack direction="vertical" gap="relaxed">
                  <div>
                    <Label htmlFor="clearance-email">Clearance Email</Label>
                    <Input
                      ref={emailInputRef}
                      id="clearance-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={isLoading || isGoogleLoading}
                      tabIndex={showEmailForm ? 0 : -1}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading || isGoogleLoading || email.trim().length === 0}
                    tabIndex={showEmailForm ? 0 : -1}
                  >
                    Send Access Link
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowEmailForm(false)}
                    tabIndex={showEmailForm ? 0 : -1}
                  >
                    Cancel
                  </Button>
                </Stack>
              </form>
            )}
          </div>
        </div>
      </Stack>
    </>
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
