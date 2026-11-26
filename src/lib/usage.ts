import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS, type PlanId } from '@/lib/plans'

type UsageType = 'upload' | 'query'

function periodStart(period: 'day' | 'month') {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  if (period === 'month') d.setUTCDate(1)
  return d.toISOString()
}

export async function getPlan(userId: string): Promise<PlanId> {
  const supabase = await createClient()
  const { data } = await supabase.from('users').select('plan').eq('id', userId).single()
  return data?.plan === 'pro' ? 'pro' : 'free'
}

export async function getUsage(userId: string) {
  const supabase = await createClient()
  const plan = await getPlan(userId)
  const limit = PLAN_LIMITS[plan]
  const since = periodStart(limit.period)

  const count = async (type: UsageType) => {
    const { count } = await supabase
      .from('usage_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('type', type)
      .gte('created_at', since)
    return count ?? 0
  }

  const [uploads, queries] = await Promise.all([count('upload'), count('query')])
  return {
    plan,
    period: limit.period,
    uploads: { used: uploads, limit: limit.upload },
    queries: { used: queries, limit: limit.query },
  }
}

export async function checkUsageLimit(userId: string, type: UsageType): Promise<boolean> {
  const u = await getUsage(userId)
  const bucket = type === 'upload' ? u.uploads : u.queries
  return bucket.used < bucket.limit
}

export async function recordUsage(userId: string, type: UsageType) {
  const supabase = await createClient()
  await supabase.from('usage_events').insert({ user_id: userId, type, count: 1 })
}
