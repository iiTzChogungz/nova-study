import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const ACTIVE = new Set(['active', 'trialing', 'past_due'])

// Single source of truth: derive plan from the subscription's current state.
async function syncSubscription(sub: Stripe.Subscription, fallbackUserId?: string | null) {
  const admin = createAdminClient()
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  let userId = sub.metadata?.user_id || fallbackUserId || null
  if (!userId) {
    const { data } = await admin.from('users').select('id').eq('stripe_customer_id', customerId).single()
    userId = data?.id ?? null
  }
  if (!userId) {
    console.error('Webhook: no user for subscription', sub.id)
    return
  }

  // API versions moved current_period_end onto the subscription item.
  const periodEnd = (sub as any).current_period_end ?? (sub as any).items?.data?.[0]?.current_period_end
  const isPro = ACTIVE.has(sub.status)

  await admin.from('users').update({ plan: isPro ? 'pro' : 'free', stripe_customer_id: customerId }).eq('id', userId)
  await admin.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      status: sub.status,
      current_period_end: new Date((periodEnd ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    },
    { onConflict: 'user_id' }
  )
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          await syncSubscription(sub, session.client_reference_id)
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
      case 'invoice.paid': {
        const invoice = event.data.object as any
        const subId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription
        if (subId) await syncSubscription(await stripe.subscriptions.retrieve(subId as string))
        break
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 }) // Stripe will retry
  }

  return NextResponse.json({ received: true })
}
