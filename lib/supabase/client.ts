import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser Supabase client. Uses process.env so Next.js can inline NEXT_PUBLIC_*
 * at build time. Env validation runs only on the server (see server.ts → lib/env.ts).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
