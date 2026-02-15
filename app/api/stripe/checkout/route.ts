import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

const stripe = new Stripe(env.stripeSecretKey)

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Prevent duplicate purchases
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('premium_until')
    .eq('id', user.id)
    .single()

  if (profile?.premium_until && new Date(profile.premium_until) > new Date()) {
    return NextResponse.json({ error: 'Already premium' }, { status: 400 })
  }

  try {
    const origin = new URL(request.url).origin

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: env.stripePriceId, quantity: 1 }],
      success_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium/cancelled`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: { supabase_user_id: user.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    logger.error('Stripe checkout session creation failed', {
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
