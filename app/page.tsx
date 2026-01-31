import { Navigation } from '@/components/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Test connection by checking Supabase URL
  const { data, error } = await supabase.from('_supabase_test').select('*').limit(1)

  const connectionStatus = error?.message.includes('relation') || error?.message.includes('Could not find the table')
    ? 'Connected (no tables yet)'
    : error
    ? `Error: ${error.message}`
    : 'Connected'

  return (
    <>
      <Navigation />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8 text-center">
            SCP Continuum
          </h1>

        <div className="mb-8 text-center">
          <p className="text-xl mb-4">Phase 3: Authentication ✅</p>
          <p className="text-gray-600 dark:text-gray-400">
            Next.js 16 + Supabase + TypeScript + Tailwind + Magic Link Auth
          </p>
        </div>

        {/* Auth Status */}
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900 mb-6">
          <h2 className="text-lg font-semibold mb-4">Authentication Status</h2>
          {user ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <dt className="text-gray-600 dark:text-gray-400">Status:</dt>
                <dd className="font-mono text-sm text-green-600 dark:text-green-400">
                  ✓ Authenticated
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600 dark:text-gray-400">Email:</dt>
                <dd className="font-mono text-sm">{user.email}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600 dark:text-gray-400">User ID:</dt>
                <dd className="font-mono text-xs truncate max-w-xs">{user.id}</dd>
              </div>

              <form action="/auth/logout" method="post" className="mt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <dt className="text-gray-600 dark:text-gray-400">Status:</dt>
                <dd className="font-mono text-sm text-gray-500">Not signed in</dd>
              </div>

              <a
                href="/login"
                className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition-colors mt-4"
              >
                Sign In
              </a>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900 mb-6">
          <h2 className="text-lg font-semibold mb-4">Database Status</h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Supabase:</dt>
              <dd className="font-mono text-sm">{connectionStatus}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Project:</dt>
              <dd className="font-mono text-sm truncate max-w-xs">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Browse Series - prominent CTA */}
        <div className="mt-8 text-center space-y-4">
          <Link
            href="/series"
            className="inline-block px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Browse Series →
          </Link>

          <p className="text-sm text-gray-500">
            Ready for Phase 4: The Tracker
          </p>
        </div>
      </div>
    </main>
    </>
  )
}
