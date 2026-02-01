'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSiteUrl } from '@/lib/utils/site-url'
import { useSearchParams } from 'next/navigation'
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">SCP Continuum Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to track your reading progress
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-xl font-semibold mb-6">Sign in with Magic Link</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || !email}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
            No password required. We'll send you a secure link to sign in.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button href="/" variant="ghost" size="sm">
            ← Back to home
          </Button>
        </div>
      </div>
    </main>
  )
}
