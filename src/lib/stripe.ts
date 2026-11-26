import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2026-04-22.dahlia',
  appInfo: { name: 'Nova Study', version: '1.0.0' },
})

export const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
