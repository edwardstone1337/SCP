'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSiteUrl } from '@/lib/utils/site-url'
import { useSearchParams } from 'next/navigation'
import { Main } from '@/components/ui/main'
import { Stack } from '@/components/ui/stack'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { Heading, Text, Label } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Message } from '@/components/ui/message'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const searchParams = useSearchParams()

  // Show error from URL params (e.g., from failed callback)
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setMessage({ type: 'error', text: error })
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const redirectTo = searchParams.get('redirect') || '/'
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'Check your email for the magic link!',
        })
        setEmail('')
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main>
      <Stack direction="vertical" align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Container size="xs">
          <Stack direction="vertical" gap="loose" align="center">
            {/* Header section */}
            <Stack direction="vertical" gap="normal" align="center">
              <Logo size="md" />
              <Heading level={1}>SCP Continuum Tracker</Heading>
              <Text variant="secondary">Sign in to track your reading progress</Text>
            </Stack>

            {/* Form card */}
            <Card padding="lg" style={{ width: '100%' }}>
              <Stack direction="vertical" gap="normal">
                <Heading level={3}>Sign in with Magic Link</Heading>

                <form onSubmit={handleLogin}>
                  <Stack direction="vertical" gap="normal">
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={loading}
                      />
                    </div>

                    {message && (
                      <Message type={message.type}>
                        {message.text}
                      </Message>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      loading={loading}
                      disabled={loading || !email}
                    >
                      Send Magic Link
                    </Button>
                  </Stack>
                </form>

                <Text size="xs" variant="muted" style={{ textAlign: 'center' }}>
                  No password required. We'll send you a secure link to sign in.
                </Text>
              </Stack>
            </Card>

            {/* Footer */}
            <Button href="/" variant="ghost" size="sm">
              ← Back to home
            </Button>
          </Stack>
        </Container>
      </Stack>
    </Main>
  )
}
