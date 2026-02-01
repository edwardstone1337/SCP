import { createClient } from '@/lib/supabase/server'
import { Navigation } from '@/components/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navigation />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8 text-center">
            SCP Continuum Tracker
          </h1>

          <div className="mb-8 text-center">
            <p className="text-xl mb-4">Track Your SCP Reading Progress</p>
            <p className="text-gray-600 dark:text-gray-400">
              Browse 9,324 SCPs across 10 series and never lose your place
            </p>
          </div>

          {/* Auth Status - Simple */}
          {user && (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900 mb-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Signed in as <span className="font-mono">{user.email}</span>
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 text-center space-y-4">
            {user ? (
              <Link
                href="/series"
                className="inline-block px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Browse Series →
              </Link>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to start tracking your progress
                </p>
                <Link
                  href="/login"
                  className="inline-block px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  Sign In →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
