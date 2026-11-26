import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS, type PlanId } from '@/lib/plans'

type UsageType = 'upload' | 'query'

// Quota days/months roll over at midnight Thailand time (UTC+7).
const TZ_MS = 7 * 3600 * 1000

function periodStart(period: 'day' | 'month') {
  const d = new Date(Date.now() + TZ_MS)
  d.setUTCHours(0, 0, 0, 0)
  if (period === 'month') d.setUTCDate(1)
  return new Date(d.getTime() - TZ_MS).toISOString()
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

// Consecutive days (Thailand time) with at least one AI query, ending today or yesterday.
export async function getStreak(userId: string): Promise<number> {
  const supabase = await createClient()
  const since = new Date(Date.now() - 60 * 86400000).toISOString()
  const { data } = await supabase
    .from('usage_events').select('created_at').eq('user_id', userId).eq('type', 'query').gte('created_at', since)
  const th = (t: number) => new Date(t + TZ_MS).toISOString().slice(0, 10)
  const days = new Set((data || []).map((r) => th(new Date(r.created_at).getTime())))
  const day = (offset: number) => th(Date.now() - offset * 86400000)
  let i = days.has(day(0)) ? 0 : 1
  let streak = 0
  while (days.has(day(i))) { streak++; i++ }
  return streak
}
