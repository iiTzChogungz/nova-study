import Link from 'next/link'
import { GraduationCap, Sparkles, Brain, Layers, MessageCircleQuestion, FileUp, Check, Lock } from 'lucide-react'
import { PRICING, PLAN_LIMITS, BILLING_ENABLED } from '@/lib/plans'

const FEATURES = [
  { icon: Sparkles, title: 'สรุปทันที', body: 'แปลงตำราหนาๆ เป็นสรุปสั้นๆ อ่านจบใน 1 นาที', tint: 'bg-blue-100 text-blue-600' },
  { icon: Brain, title: 'ออกข้อสอบให้เอง', body: 'ข้อสอบปรนัยพร้อมเฉลยและคำอธิบาย ทำแล้วรู้คะแนนทันที', tint: 'bg-purple-100 text-purple-600' },
  { icon: Layers, title: 'แฟลชการ์ด', body: 'ท่องศัพท์และนิยามสำคัญแบบพลิกการ์ด จำแม่นขึ้น', tint: 'bg-pink-100 text-pink-600' },
  { icon: MessageCircleQuestion, title: 'ถามได้ทุกเรื่อง', body: 'สงสัยตรงไหนก็ถาม AI ตอบจากเนื้อหาในเอกสารของคุณจริงๆ', tint: 'bg-emerald-100 text-emerald-600' },
]

const FAQ = [
  ['ใช้ฟรีจริงไหม?', 'ฟรีจริง ทุกฟีเจอร์ มีโควตาต่อวันเพื่อให้ทุกคนได้ใช้อย่างทั่วถึง โควตาจะรีเซ็ตทุกวัน'],
  ['รองรับไฟล์อะไรบ้าง?', 'PDF, รูปภาพ (PNG, JPG, WEBP) และไฟล์ข้อความ ขนาดไม่เกิน 10MB รองรับทั้งภาษาไทยและอังกฤษ'],
  ['ไฟล์ของฉันปลอดภัยไหม?', 'ไฟล์ถูกเก็บแบบส่วนตัว เฉพาะบัญชีของคุณเท่านั้นที่เข้าถึงได้ และคุณลบได้ทุกเมื่อ'],
  ['AI ตอบผิดได้ไหม?', 'ได้ AI อาจผิดพลาด ควรตรวจสอบกับเอกสารต้นฉบับก่อนนำไปสอบหรือใช้งานจริง'],
]

export default function Home() {
  const f = PLAN_LIMITS.free
  const p = PLAN_LIMITS.pro
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Nova Study', applicationCategory: 'EducationalApplication', operatingSystem: 'Web', inLanguage: 'th', description: 'ติวเตอร์ AI สรุปบทเรียน ออกข้อสอบ แฟลชการ์ด จากไฟล์ PDF และรูปภาพ', offers: { '@type': 'Offer', price: '0', priceCurrency: 'THB' } }) }} />
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-black text-2xl text-blue-600"><GraduationCap className="w-8 h-8" />Nova Study</div>
        <div className="flex items-center gap-3 sm:gap-5">
          {BILLING_ENABLED && <a href="#pricing" className="hidden sm:block text-slate-600 font-medium hover:text-slate-900">ราคา</a>}
          <Link href="/login" className="text-slate-600 font-medium hover:text-slate-900">เข้าสู่ระบบ</Link>
          <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700">เริ่มฟรี</Link>
        </div>
      </nav>

      <main>
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-8"><Sparkles className="w-4 h-4" />ติวเตอร์ AI ส่วนตัวของคุณ</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            อ่านน้อยลง เข้าใจมากขึ้น<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">สอบผ่านแบบมั่นใจ</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            อัปโหลดชีท สไลด์ หรือรูปโน้ต แล้ว Nova Study จะสรุป ออกข้อสอบ ทำแฟลชการ์ด และตอบทุกคำถามจากเนื้อหาของคุณ
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30">
            <FileUp className="w-5 h-5" />เริ่มใช้ฟรีเลย
          </Link>
          <p className="text-sm text-slate-400 mt-4">ใช้ฟรี ไม่ต้องใช้บัตรเครดิต · ทุกวัน {f.upload} ไฟล์ · {f.query} คำสั่ง AI</p>
        </section>

        <section className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-24">
          {FEATURES.map((x) => (
            <div key={x.title} className="bg-slate-50 rounded-3xl p-7 border border-slate-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${x.tint}`}><x.icon className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold mb-2">{x.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{x.body}</p>
            </div>
          ))}
        </section>

        <section className="bg-slate-50 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black mb-12">ใช้งานง่ายใน 3 ขั้นตอน</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {['อัปโหลดไฟล์เรียนของคุณ', 'เลือกให้ AI สรุป ออกข้อสอบ หรือทำแฟลชการ์ด', 'ทบทวน ทำข้อสอบ แล้วไปสอบอย่างมั่นใจ'].map((t, i) => (
                <div key={i}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-600 text-white font-black flex items-center justify-center">{i + 1}</div>
                  <p className="font-semibold text-slate-700">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {BILLING_ENABLED && <section id="pricing" className="max-w-4xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-black text-center mb-3">ราคาที่นักเรียนจ่ายไหว</h2>
          <p className="text-center text-slate-500 mb-12">เริ่มฟรี อัปเกรดเมื่อพร้อม ยกเลิกได้ทุกเมื่อ</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-slate-200 p-8">
              <h3 className="font-bold text-xl mb-1">Free</h3>
              <p className="text-4xl font-black mb-6">฿0</p>
              <ul className="space-y-3 text-slate-600 mb-8">
                <li className="flex gap-2"><Check className="w-5 h-5 text-green-500 shrink-0" />{f.upload} ไฟล์/วัน</li>
                <li className="flex gap-2"><Check className="w-5 h-5 text-green-500 shrink-0" />{f.query} คำสั่ง AI/วัน</li>
                <li className="flex gap-2"><Check className="w-5 h-5 text-green-500 shrink-0" />สรุป ข้อสอบ แฟลชการ์ด ถาม-ตอบ</li>
                <li className="flex gap-2 text-slate-400"><Lock className="w-5 h-5 shrink-0" />สรุปละเอียด / รายงาน</li>
              </ul>
              <Link href="/register" className="block text-center py-3 rounded-xl bg-slate-100 font-bold hover:bg-slate-200">เริ่มฟรี</Link>
            </div>
            <div className="rounded-3xl bg-blue-600 text-white p-8 shadow-xl">
              <h3 className="font-bold text-xl mb-1">Pro</h3>
              <p className="text-4xl font-black">฿{PRICING.monthly.amount}<span className="text-lg font-normal text-blue-200">/เดือน</span></p>
              <p className="text-blue-100 text-sm mb-6">หรือ ฿{PRICING.yearly.amount}/ปี (ประหยัด 2 เดือน)</p>
              <ul className="space-y-3 text-blue-50 mb-8">
                <li className="flex gap-2"><Check className="w-5 h-5 shrink-0" />{p.upload} ไฟล์/เดือน</li>
                <li className="flex gap-2"><Check className="w-5 h-5 shrink-0" />{p.query} คำสั่ง AI/เดือน</li>
                <li className="flex gap-2"><Check className="w-5 h-5 shrink-0" />สรุปละเอียดด้วยโมเดลระดับสูง</li>
                <li className="flex gap-2"><Check className="w-5 h-5 shrink-0" />สร้างรายงาน / Lab Report</li>
              </ul>
              <Link href="/register" className="block text-center py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50">สมัครแล้วอัปเกรด</Link>
            </div>
          </div>
        </section>}

        <section className="max-w-3xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-black text-center mb-10">คำถามที่พบบ่อย</h2>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <summary className="font-bold cursor-pointer list-none flex justify-between">{q}<span className="text-slate-400 group-open:rotate-45 transition-transform">+</span></summary>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        <div className="flex justify-center gap-6 mb-2">
          <Link href="/terms" className="hover:text-slate-600">ข้อกำหนดการใช้งาน</Link>
          <Link href="/privacy" className="hover:text-slate-600">นโยบายความเป็นส่วนตัว</Link>
        </div>
        © {new Date().getFullYear()} Nova Study
      </footer>
    </div>
  )
}
