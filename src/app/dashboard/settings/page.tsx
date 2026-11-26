import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUsage } from '@/lib/usage'
import { BILLING_ENABLED } from '@/lib/plans'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const usage = await getUsage(user.id)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-6">ตั้งค่าบัญชี</h1>
      <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100">
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-1">อีเมล</p>
          <p className="font-semibold text-slate-900">{user.email}</p>
        </div>
        {BILLING_ENABLED && (
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">แพ็กเกจปัจจุบัน</p>
            <p className="text-xl font-black text-slate-900 uppercase">{usage.plan}</p>
          </div>
          <Link href="/dashboard/billing" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
            {usage.plan === 'pro' ? 'จัดการแพ็กเกจ' : 'อัปเกรดเป็น Pro'}
          </Link>
        </div>
        )}
        <div className="p-6 text-sm text-slate-500 flex gap-4">
          <Link href="/terms" className="underline">ข้อกำหนดการใช้งาน</Link>
          <Link href="/privacy" className="underline">นโยบายความเป็นส่วนตัว</Link>
        </div>
      </div>
    </div>
  )
}
