'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { PRICING, PLAN_LIMITS } from '@/lib/plans'

function Billing() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('yearly')
  const params = useSearchParams()

  const go = async (url: string, key: string, body?: object) => {
    setLoading(key); setError(null)
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else throw new Error(data.error || 'เกิดข้อผิดพลาด')
    } catch (e: any) { setError(e.message); setLoading(null) }
  }

  const f = PLAN_LIMITS.free, p = PLAN_LIMITS.pro
  const price = PRICING[interval]

  return (
    <div className="max-w-4xl mx-auto py-4">
      {params.get('success') && <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-800 font-medium">🎉 ชำระเงินสำเร็จ! แพ็กเกจ Pro จะเปิดใช้งานภายในไม่กี่วินาที (รีเฟรชหน้านี้หากยังไม่เปลี่ยน)</div>}
      {params.get('canceled') && <div className="mb-6 p-4 rounded-2xl bg-slate-100 text-slate-700">ยกเลิกการชำระเงินแล้ว คุณสามารถลองใหม่ได้ทุกเมื่อ</div>}
      {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700">{error}</div>}

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-slate-900">เลือกแพ็กเกจของคุณ</h1>
        <p className="text-slate-500 mt-2">ยกเลิกได้ทุกเมื่อ ชำระเงินปลอดภัยผ่าน Stripe</p>
        <div className="inline-flex mt-5 p-1 bg-slate-100 rounded-full text-sm font-bold">
          {(['monthly', 'yearly'] as const).map((k) => (
            <button key={k} onClick={() => setInterval(k)} className={`px-5 py-2 rounded-full transition-colors ${interval === k ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>
              {k === 'monthly' ? 'รายเดือน' : 'รายปี −17%'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-slate-200">
          <h2 className="text-xl font-bold mb-2">Free</h2>
          <div className="text-4xl font-black mb-6">฿0</div>
          <ul className="space-y-3 mb-8 text-slate-700">
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" />อัปโหลด {f.upload} ไฟล์/วัน</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" />คำสั่ง AI {f.query} ครั้ง/วัน</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" />สรุปย่อ ข้อสอบ แฟลชการ์ด ถาม-ตอบ</li>
          </ul>
          <Link href="/dashboard" className="block text-center w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">เริ่มใช้งานฟรี</Link>
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 shadow-xl text-white md:-translate-y-3 relative">
          <span className="absolute top-0 right-0 bg-gradient-to-r from-orange-400 to-pink-500 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl">ยอดนิยม</span>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">Pro <Sparkles className="w-5 h-5 text-yellow-300" /></h2>
          <div className="text-4xl font-black mb-1">฿{price.amount}<span className="text-lg text-blue-200 font-normal">/{interval === 'monthly' ? 'เดือน' : 'ปี'}</span></div>
          {interval === 'yearly' && <p className="text-blue-100 text-sm mb-4">เฉลี่ย ฿{Math.round(price.amount / 12)}/เดือน</p>}
          <ul className="space-y-3 mb-8 mt-4 text-blue-50">
            <li className="flex gap-3"><Check className="w-5 h-5 shrink-0" />อัปโหลด {p.upload} ไฟล์/เดือน</li>
            <li className="flex gap-3"><Check className="w-5 h-5 shrink-0" />คำสั่ง AI {p.query} ครั้ง/เดือน</li>
            <li className="flex gap-3"><Check className="w-5 h-5 shrink-0" />สรุปละเอียดด้วยโมเดลระดับสูง</li>
            <li className="flex gap-3"><Check className="w-5 h-5 shrink-0" />สร้างรายงาน / Lab Report</li>
          </ul>
          <button onClick={() => go('/api/stripe/checkout', 'up', { interval })} disabled={!!loading}
            className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 flex items-center justify-center">
            {loading === 'up' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'อัปเกรดเลย'}
          </button>
        </div>
      </div>

      <p className="text-center mt-10 text-sm text-slate-500">
        เป็นสมาชิก Pro อยู่แล้ว?{' '}
        <button onClick={() => go('/api/stripe/portal', 'portal')} className="font-bold text-blue-600 underline">
          {loading === 'portal' ? 'กำลังเปิด…' : 'จัดการการสมัคร / ยกเลิก / ใบเสร็จ'}
        </button>
      </p>
    </div>
  )
}

export default function BillingPage() {
  return <Suspense><Billing /></Suspense>
}
