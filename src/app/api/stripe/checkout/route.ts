import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { BILLING_ENABLED } from '@/lib/plans'
import { stripe, appUrl } from '@/lib/stripe'
import { PRICING, APP_NAME, type BillingInterval } from '@/lib/plans'

export async function POST(request: Request) {
  if (!BILLING_ENABLED) return NextResponse.json({ error: 'Billing is disabled' }, { status: 404 })
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const interval: BillingInterval = body.interval === 'yearly' ? 'yearly' : 'monthly'
    const price = PRICING[interval]

    const { data: profile } = await supabase
      .from('users').select('plan, stripe_customer_id').eq('id', user.id).single()
    if (profile?.plan === 'pro') {
      return NextResponse.json({ error: 'คุณเป็นสมาชิก Pro อยู่แล้ว' }, { status: 400 })
    }

    // Optional: use real Stripe Price IDs from env, else inline price_data.
    const priceId = interval === 'yearly' ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY
    const lineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: 'thb',
            product_data: { name: `${APP_NAME} Pro`, description: '50 อัปโหลดและ 500 คำสั่ง AI ต่อเดือน + สรุปละเอียด/รายงาน' },
            unit_amount: price.amount * 100,
            recurring: { interval: price.interval },
          },
          quantity: 1,
        }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [lineItem],
      ...(profile?.stripe_customer_id ? { customer: profile.stripe_customer_id } : { customer_email: user.email }),
      allow_promotion_codes: true,
      client_reference_id: user.id,
      subscription_data: { metadata: { user_id: user.id } },
      success_url: `${appUrl()}/dashboard/billing?success=true`,
      cancel_url: `${appUrl()}/dashboard/billing?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'เริ่มชำระเงินไม่สำเร็จ' }, { status: 500 })
  }
}
