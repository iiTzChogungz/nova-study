import { createClient } from '@/lib/supabase/server'

export async function checkUsageLimit(userId: string, type: 'upload' | 'query'): Promise<boolean> {
  const supabase = await createClient()

  // 1. Get user plan
  const { data: user } = await supabase
    .from('users')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = user?.plan || 'free'

  // Define limits
  const limits = {
    free: { upload: 3, query: 20, period: 'day' },
    pro: { upload: 50, query: 500, period: 'month' }
  }

  const limit = limits[plan as keyof typeof limits]

  // Calculate start of period
  const now = new Date()
  let startDate = new Date()
  if (limit.period === 'day') {
    startDate.setUTCHours(0, 0, 0, 0)
  } else {
    startDate.setUTCDate(1)
    startDate.setUTCHours(0, 0, 0, 0)
  }

  // 2. Count usage in period
  const { count } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', type)
    .gte('created_at', startDate.toISOString())

  if (count !== null && count >= limit[type]) {
    return false // Limit exceeded
  }

  return true // Within limit
}

export async function recordUsage(userId: string, type: 'upload' | 'query') {
  const supabase = await createClient()
  await supabase.from('usage_events').insert({
    user_id: userId,
    type,
    count: 1
  })
}
