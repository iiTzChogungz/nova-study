import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/app/(auth)/actions'
import { getUsage } from '@/lib/usage'
import { GraduationCap, LayoutDashboard, Settings, LogOut, CreditCard, Sparkles } from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'เอกสารของฉัน', icon: LayoutDashboard },
  { href: '/dashboard/billing', label: 'แพ็กเกจ', icon: CreditCard },
  { href: '/dashboard/settings', label: 'ตั้งค่า', icon: Settings },
]

function Bar({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-400">
        <span>{label}</span>
        <span>{used}/{limit}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const usage = await getUsage(user.id)
  const per = usage.period === 'day' ? 'วันนี้' : 'เดือนนี้'

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:flex">
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-black text-blue-600 tracking-tight">
            <GraduationCap className="w-8 h-8" /> Nova Study
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl font-semibold transition-colors">
              <n.icon className="w-5 h-5" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 m-4 bg-slate-900 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">โควตา{per}</span>
          </div>
          <div className="space-y-4">
            <Bar label="อัปโหลด" used={usage.uploads.used} limit={usage.uploads.limit} />
            <Bar label="คำสั่ง AI" used={usage.queries.used} limit={usage.queries.limit} />
            <p className="text-[11px] text-slate-400">
              แพ็กเกจ: <span className="text-blue-400 font-bold uppercase">{usage.plan}</span>
            </p>
            {usage.plan !== 'pro' && (
              <Link href="/dashboard/billing" className="block text-center py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors">
                อัปเกรดเป็น Pro
              </Link>
            )}
          </div>
        </div>
        <div className="px-6 pb-6 flex items-center justify-between gap-2">
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
          <form action={signOut}>
            <button className="text-slate-400 hover:text-red-600" title="ออกจากระบบ"><LogOut className="w-5 h-5" /></button>
          </form>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between gap-3 px-4 h-14 bg-white border-b border-slate-200 sticky top-0 z-40">
          <Link href="/dashboard" className="flex items-center gap-2 font-black text-blue-600"><GraduationCap className="w-6 h-6" /> Nova</Link>
          <nav className="flex items-center gap-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} title={n.label} className="p-2 text-slate-500 hover:text-blue-600"><n.icon className="w-5 h-5" /></Link>
            ))}
            <form action={signOut}><button className="p-2 text-slate-400 hover:text-red-600"><LogOut className="w-5 h-5" /></button></form>
          </nav>
        </header>
        <main className="p-4 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
