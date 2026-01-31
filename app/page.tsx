import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  
  // Test connection by checking Supabase URL
  const { data, error } = await supabase.from('_supabase_test').select('*').limit(1)
  
  const connectionStatus = error?.message.includes('relation') 
    ? 'Connected (no tables yet)' 
    : error 
    ? `Error: ${error.message}` 
    : 'Connected'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          SCP Continuum Tracker
        </h1>
        
        <div className="mb-8 text-center">
          <p className="text-xl mb-4">Phase 1: Foundation ✅</p>
          <p className="text-gray-600 dark:text-gray-400">
            Next.js 16 + Supabase + TypeScript + Tailwind
          </p>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
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

        <p className="mt-8 text-center text-sm text-gray-500">
          Ready for Phase 2: Data Ingestion
        </p>
      </div>
    </main>
  )
}
