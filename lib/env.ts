/**
 * Environment variable validation (server-side only).
 * Import this only from server code (e.g. lib/supabase/server.ts).
 * The browser client uses process.env directly so Next.js can inline NEXT_PUBLIC_* at build time.
 */

function getEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

// Validate at module load time
export const env = {
  supabaseUrl: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  // NEXT_PUBLIC_SITE_URL is optional — getSiteUrl() falls back to window.location.origin
  stripeSecretKey: getEnvVar('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  stripePriceId: getEnvVar('NEXT_PUBLIC_STRIPE_PRICE_ID'),
  supabaseServiceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
} as const
