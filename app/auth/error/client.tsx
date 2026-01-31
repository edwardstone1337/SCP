'use client'

import { useSearchParams } from 'next/navigation'

export function AuthErrorClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An authentication error occurred'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800 p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            Authentication Error
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {error}
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    </main>
  )
}
