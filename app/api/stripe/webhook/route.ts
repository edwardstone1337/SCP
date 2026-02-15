import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const stripe = new Stripe(env.stripeSecretKey)

const LIFETIME_PREMIUM = '9999-12-31T23:59:59Z'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret)
  } catch (error) {
    logger.error('Stripe webhook signature verification failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.client_reference_id

    if (!userId) {
      logger.error('Stripe webhook: missing client_reference_id', {
        sessionId: session.id,
      })
      return NextResponse.json({ error: 'Missing user reference' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin(
      env.supabaseUrl,
      env.supabaseServiceRoleKey
    )

    const { error: upsertError } = await supabaseAdmin
      .from('user_profiles')
      .upsert(
        { id: userId, premium_until: LIFETIME_PREMIUM },
        { onConflict: 'id' }
      )

    if (upsertError) {
      logger.error('Stripe webhook: failed to update premium status', {
        userId,
        sessionId: session.id,
        error: upsertError.message,
      })
      return NextResponse.json({ error: 'Failed to activate premium' }, { status: 500 })
    }

    logger.info('Premium activated via Stripe checkout', {
      userId,
      sessionId: session.id,
    })
  }

  return NextResponse.json({ received: true })
}
