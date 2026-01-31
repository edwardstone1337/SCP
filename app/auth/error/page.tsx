export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { AuthErrorClient } from './client'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </main>
    }>
      <AuthErrorClient />
    </Suspense>
  )
}
