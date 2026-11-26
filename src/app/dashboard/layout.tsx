import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/app/(auth)/actions'
import { getUsage, getStreak } from '@/lib/usage'
import { BILLING_ENABLED } from '@/lib/plans'
import { GraduationCap, LayoutDashboard, Settings, LogOut, CreditCard, Flame } from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'เอกสารของฉัน', icon: LayoutDashboard },
  ...(BILLING_ENABLED ? [{ href: '/dashboard/billing', label: 'แพ็กเกจ', icon: CreditCard }] : []),
  { href: '/dashboard/settings', label: 'ตั้งค่า', icon: Settings },
]

function Bar({ label, used, limit, color }: { label: string; used: number; limit: number; color: string }) {
  const pct = Math.min((used / limit) * 100, 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1 font-bold"><span>{label}</span><span>{used}/{limit}</span></div>
      <div className="h-3.5 bg-ink/10 rounded-full overflow-hidden border-2 border-ink/10">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [usage, streak] = await Promise.all([getUsage(user.id), getStreak(user.id)])

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden lg:flex w-72 bg-white border-r-2 border-ink/10 flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <span className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-ink flex items-center justify-center wiggle"><GraduationCap className="w-6 h-6" /></span>
            Nova Study
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold border-2 border-transparent hover:border-ink/15 hover:bg-yellow-100 transition-colors">
              <n.icon className="w-5 h-5" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="m-4 p-5 pop-card-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border-2 border-orange-300 flex items-center justify-center"><Flame className="w-7 h-7 text-orange-500" /></div>
            <div>
              <p className="text-2xl font-black leading-none">{streak} วัน</p>
              <p className="text-xs text-ink/60 font-medium">ติวต่อเนื่อง</p>
            </div>
          </div>
          <Bar label="เป้าหมายวันนี้ (AI)" used={usage.queries.used} limit={usage.queries.limit} color="var(--green)" />
          <Bar label="อัปโหลด" used={usage.uploads.used} limit={usage.uploads.limit} color="var(--blue)" />
          {BILLING_ENABLED && usage.plan !== 'pro' && <Link href="/dashboard/billing" className="btn btn-violet w-full text-sm">อัปเกรดเป็น Pro</Link>}
        </div>
        <div className="px-6 pb-6 flex items-center justify-between gap-2">
          <p className="text-xs text-ink/60 truncate">{user.email}</p>
          <form action={signOut}><button className="text-ink/50 hover:text-red-600" aria-label="ออกจากระบบ"><LogOut className="w-5 h-5" /></button></form>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between gap-3 px-4 h-14 bg-white border-b-2 border-ink/10 sticky top-0 z-40">
          <Link href="/dashboard" className="flex items-center gap-2 font-black"><GraduationCap className="w-6 h-6" /> Nova</Link>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 font-black text-orange-500 mr-2"><Flame className="w-5 h-5" />{streak}</span>
            {NAV.map((n) => <Link key={n.href} href={n.href} aria-label={n.label} className="p-2.5"><n.icon className="w-5 h-5" /></Link>)}
            <form action={signOut}><button aria-label="ออกจากระบบ" className="p-2.5"><LogOut className="w-5 h-5" /></button></form>
          </div>
        </header>
        <main className="p-4 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
