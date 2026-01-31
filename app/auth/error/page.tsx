import { Suspense } from 'react'
import { AuthErrorContent } from './error-content'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <div className="text-center">Loading...</div>
      </main>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
