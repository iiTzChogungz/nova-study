import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
  )
  const body = await req.text()
  const signature = req.headers.get('Stripe-Signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  const session = event.data.object as any

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as any
    
    const userId = session.client_reference_id
    
    // Update user plan
    await supabaseAdmin
      .from('users')
      .update({ plan: 'pro', stripe_customer_id: session.customer as string })
      .eq('id', userId)

    // Store subscription
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as any
    
    // Update subscription period
    await supabaseAdmin.from('subscriptions')
      .update({
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    
    // Set user back to free
    const { data: subData } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()
      
    if (subData) {
      await supabaseAdmin.from('users').update({ plan: 'free' }).eq('id', subData.user_id)
      await supabaseAdmin.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', subscription.id)
    }
  }

  return NextResponse.json({ received: true })
}
