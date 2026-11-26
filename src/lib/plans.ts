export const APP_NAME = 'Nova Study'

export type PlanId = 'free' | 'pro'
export type BillingInterval = 'monthly' | 'yearly'

export const PLAN_LIMITS = {
  free: { upload: 3, query: 20, period: 'day' as const },
  pro: { upload: 50, query: 500, period: 'month' as const },
}

// Prices in THB (whole baht). Stripe expects satang (x100).
export const PRICING = {
  monthly: { amount: 99, interval: 'month' as const, label: 'รายเดือน' },
  yearly: { amount: 990, interval: 'year' as const, label: 'รายปี (ประหยัด 2 เดือน)' },
}

// Actions that cost more (Pro model) and are Pro-only: the upgrade driver.
export const PRO_ONLY_ACTIONS = ['detailed_summary', 'report'] as const

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
]
