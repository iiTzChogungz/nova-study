import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function AuthForm({ mode, action, message }: { mode: 'login' | 'register'; action: (f: FormData) => Promise<void>; message?: string }) {
  const login = mode === 'login'
  const ok = message?.startsWith('สมัครสำเร็จ')
  return (
    <div className="w-full px-8 sm:max-w-md">
      <Link href="/" className="absolute left-6 top-6 text-sm text-ink/60 hover:text-slate-900">← หน้าแรก</Link>
      <form action={action} className="flex flex-col gap-2">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="bg-yellow-300 border-2 border-ink p-3 rounded-2xl wiggle"><GraduationCap className="w-8 h-8" /></div>
          <h1 className="text-3xl font-black tracking-tight">{login ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีฟรี'}</h1>
          <p className="text-ink/60 text-sm">{login ? 'เข้าสู่ระบบ Nova Study' : 'เริ่มติวกับ AI ได้ทันที ไม่ต้องใช้บัตรเครดิต'}</p>
        </div>
        <label className="text-sm font-medium" htmlFor="email">อีเมล</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com"
          className="rounded-2xl px-4 py-3 border-2 border-ink/20 bg-white font-medium mb-3" />
        <label className="text-sm font-medium" htmlFor="password">รหัสผ่าน</label>
        <input id="password" name="password" type="password" required minLength={login ? undefined : 8} autoComplete={login ? 'current-password' : 'new-password'} placeholder={login ? '••••••••' : 'อย่างน้อย 8 ตัวอักษร'}
          className="rounded-2xl px-4 py-3 border-2 border-ink/20 bg-white font-medium mb-5" />
        <button className="btn btn-green">{login ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</button>
        {message && <p className={`mt-3 p-3 text-center rounded-xl text-sm font-medium ${ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{message}</p>}
        <p className="text-center text-sm text-ink/60 mt-4">
          {login ? 'ยังไม่มีบัญชี? ' : 'มีบัญชีอยู่แล้ว? '}
          <Link href={login ? '/register' : '/login'} className="font-bold text-violet-700 hover:underline">{login ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</Link>
        </p>
        {!login && <p className="text-center text-xs text-slate-400 mt-2">การสมัครถือว่ายอมรับ <Link href="/terms" className="underline">ข้อกำหนด</Link> และ <Link href="/privacy" className="underline">นโยบายความเป็นส่วนตัว</Link></p>}
      </form>
    </div>
  )
}
