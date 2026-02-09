import { createClient } from '@supabase/supabase-js'

/**
 * Cookie-free Supabase client for public data queries in static/ISR pages.
 * Does NOT access cookies, so it won't force dynamic rendering.
 * Only use for reading public data (relies on RLS: "Anyone can read scps").
 * Never use for authenticated operations.
 */
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
