import Link from 'next/link'
import { GraduationCap, Sparkles, Brain, Layers, MessageCircleQuestion, FileUp, Flame, Star, Trophy } from 'lucide-react'
import { PLAN_LIMITS } from '@/lib/plans'

const FEATURES = [
  { icon: Sparkles, title: 'สรุปทันที', body: 'แปลงตำราหนาๆ เป็นสรุปสั้นๆ อ่านจบใน 1 นาที', bg: 'bg-sky-200' },
  { icon: Brain, title: 'ออกข้อสอบให้เอง', body: 'ข้อสอบปรนัยพร้อมเฉลยและคำอธิบาย ทำแล้วรู้คะแนนทันที', bg: 'bg-violet-200' },
  { icon: Layers, title: 'แฟลชการ์ด', body: 'พลิกการ์ดท่องศัพท์และนิยามสำคัญ จำแม่นขึ้น', bg: 'bg-pink-200' },
  { icon: MessageCircleQuestion, title: 'ถามได้ทุกเรื่อง', body: 'สงสัยตรงไหนถาม AI ตอบจากเนื้อหาในไฟล์ของคุณจริงๆ', bg: 'bg-green-200' },
]

const FAQ = [
  ['ใช้ฟรีจริงไหม?', 'ฟรีจริง ทุกฟีเจอร์ มีโควตาต่อวันเพื่อให้ทุกคนได้ใช้อย่างทั่วถึง โควตาจะรีเซ็ตทุกวัน'],
  ['รองรับไฟล์อะไรบ้าง?', 'PDF, รูปภาพ (PNG, JPG, WEBP) และไฟล์ข้อความ ขนาดไม่เกิน 10MB รองรับทั้งภาษาไทยและอังกฤษ'],
  ['ไฟล์ของฉันปลอดภัยไหม?', 'ไฟล์ถูกเก็บแบบส่วนตัว เฉพาะบัญชีของคุณเท่านั้นที่เข้าถึงได้ และคุณลบได้ทุกเมื่อ'],
  ['AI ตอบผิดได้ไหม?', 'ได้ AI อาจผิดพลาด ควรตรวจสอบกับเอกสารต้นฉบับก่อนนำไปสอบหรือใช้งานจริง'],
]

export default function Home() {
  const f = PLAN_LIMITS.free
  return (
    <div className="min-h-screen overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Nova Study', applicationCategory: 'EducationalApplication', operatingSystem: 'Web', inLanguage: 'th', description: 'ติวเตอร์ AI สรุปบทเรียน ออกข้อสอบ แฟลชการ์ด จากไฟล์ PDF และรูปภาพ', offers: { '@type': 'Offer', price: '0', priceCurrency: 'THB' } }) }} />
      <nav className="flex items-center justify-between px-5 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-black text-2xl">
          <span className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-ink flex items-center justify-center wiggle"><GraduationCap className="w-6 h-6" /></span>
          Nova Study
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/login" className="font-bold px-3 py-2 hover:underline">เข้าสู่ระบบ</Link>
          <Link href="/register" className="btn btn-green text-sm">เริ่มฟรี</Link>
        </div>
      </nav>

      <main>
        <section className="relative max-w-5xl mx-auto px-5 pt-12 pb-20 text-center">
          <span className="hidden md:block absolute left-4 top-24 text-5xl floaty">⭐</span>
          <span className="hidden md:block absolute right-6 top-40 text-5xl floaty [animation-delay:1s]">🚀</span>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-ink font-bold text-sm mb-8 shadow-[0_3px_0_var(--ink)]">
            <Flame className="w-4 h-4 text-orange-500" />ติวทุกวัน สะสมสตรีค
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.15] mb-6">
            เปลี่ยนชีทน่าเบื่อ<br />ให้เป็น <span className="bg-yellow-300 px-3 rounded-2xl border-2 border-ink inline-block -rotate-2">เกมติวสอบ</span>
          </h1>
          <p className="text-lg md:text-xl text-ink/70 max-w-2xl mx-auto mb-10 font-medium">
            อัปโหลดชีท สไลด์ หรือรูปโน้ต แล้ว Nova Study จะสรุป ออกข้อสอบ ทำแฟลชการ์ด และตอบทุกคำถามจากเนื้อหาของคุณ
          </p>
          <Link href="/register" className="btn btn-green text-lg md:text-xl !px-10 !py-4">
            <FileUp className="w-6 h-6" />เริ่มใช้ฟรีเลย
          </Link>
          <p className="text-sm text-ink/60 mt-5 font-medium">ไม่ต้องใช้บัตรเครดิต · ทุกวัน {f.upload} ไฟล์ · {f.query} คำสั่ง AI</p>
        </section>

        <section className="max-w-6xl mx-auto px-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-20">
          {FEATURES.map((x, i) => (
            <div key={x.title} className={`pop-card p-6 ${i % 2 ? 'sm:translate-y-3' : ''}`}>
              <div className={`w-14 h-14 rounded-2xl border-2 border-ink flex items-center justify-center mb-4 ${x.bg}`}><x.icon className="w-7 h-7" /></div>
              <h3 className="text-lg font-black mb-1">{x.title}</h3>
              <p className="text-ink/70 text-sm leading-relaxed">{x.body}</p>
            </div>
          ))}
        </section>

        <section className="bg-ink text-white py-20">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-12">เลเวลอัปใน 3 ขั้นตอน</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[[Star, 'อัปโหลดไฟล์เรียนของคุณ'], [Brain, 'เลือกให้ AI สรุป ออกข้อสอบ หรือทำแฟลชการ์ด'], [Trophy, 'ทำข้อสอบ เก็บสตรีค แล้วไปสอบอย่างมั่นใจ']].map(([Icon, t], i) => {
                const I = Icon as typeof Star
                return (
                  <div key={i}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-yellow-300 text-ink border-2 border-white/30 flex items-center justify-center"><I className="w-8 h-8" /></div>
                    <p className="font-bold">{i + 1}. {t as string}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-5 py-20">
          <h2 className="text-3xl font-black text-center mb-10">คำถามที่พบบ่อย</h2>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group pop-card-soft p-5">
                <summary className="font-black cursor-pointer list-none flex justify-between">{q}<span className="group-open:rotate-45 transition-transform">+</span></summary>
                <p className="text-ink/70 mt-3 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-14"><Link href="/register" className="btn btn-yellow text-lg !px-10">เริ่มติวเลย 🚀</Link></div>
        </section>
      </main>

      <footer className="border-t-2 border-ink/10 py-8 text-center text-sm text-ink/60">
        <div className="flex justify-center gap-6 mb-2 font-medium">
          <Link href="/terms" className="hover:underline">ข้อกำหนดการใช้งาน</Link>
          <Link href="/privacy" className="hover:underline">นโยบายความเป็นส่วนตัว</Link>
        </div>
        © {new Date().getFullYear()} Nova Study
      </footer>
    </div>
  )
}
