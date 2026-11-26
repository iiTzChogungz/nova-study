import { notFound } from 'next/navigation'
import { BILLING_ENABLED } from '@/lib/plans'
import BillingClient from './BillingClient'

export default function BillingPage() {
  if (!BILLING_ENABLED) notFound()
  return <BillingClient />
}
