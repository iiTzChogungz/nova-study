import Link from 'next/link'

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-blue-600 font-bold text-sm">← Nova Study</Link>
      <h1 className="text-3xl font-black mt-6 mb-2">{title}</h1>
      <p className="text-sm text-slate-400 mb-8">อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}</p>
      <div className="prose prose-slate max-w-none">{children}</div>
    </div>
  )
}
