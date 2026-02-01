/**
 * Environment variable validation
 * Validates required env vars at startup and provides type-safe access
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
  siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL'),
  // Add other required vars here
} as const

// Optional: Validate on server startup
if (typeof window === 'undefined') {
  console.log('✓ Environment variables validated')
}
