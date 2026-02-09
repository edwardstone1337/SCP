import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

function getSafeRedirect(next: string | null, requestUrl: URL): string {
  const fallback = '/'
  if (!next || next.trim() === '') return fallback
  const trimmed = next.trim()
  // Only allow relative paths (same-origin); reject protocol-relative or absolute URLs
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  try {
    const parsed = new URL(trimmed, requestUrl.origin)
    if (parsed.origin === requestUrl.origin) return parsed.pathname + parsed.search
  } catch {
    // ignore invalid URL
  }
  return fallback
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = getSafeRedirect(requestUrl.searchParams.get('next'), requestUrl)

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const successUrl = new URL(next, request.url)
      successUrl.searchParams.set('auth', 'complete')
      return NextResponse.redirect(successUrl)
    }
    logger.error('Auth code exchange failed', { error: error.message })
  }

  // Return to login with error
  const message = 'Could not verify magic link'
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(message)}`, request.url)
  )
}
