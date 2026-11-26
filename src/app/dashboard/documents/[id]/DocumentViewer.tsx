'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { BILLING_ENABLED } from '@/lib/plans'
import { Send, Loader2, Sparkles, BookOpen, HelpCircle, Brain, AlignLeft, FlaskConical, AlertCircle, Layers, Lock, RotateCcw, Check, X } from 'lucide-react'

type Row = { id?: string; action: string; message: string; response: string }
type Quiz = { questions: { question: string; options: string[]; answer: number; explanation?: string }[] }
type Cards = { cards: { front: string; back: string }[] }

const ACTIONS = [
  { id: 'summarize', btn: 'btn-blue', icon: AlignLeft, label: 'สรุปย่อ', desc: 'ภาพรวมและประเด็นสำคัญภายใน 1 นาที', color: 'bg-blue-600' },
  { id: 'quiz', btn: 'btn-violet', icon: Brain, label: 'สร้างข้อสอบ', desc: 'ข้อสอบปรนัย 8 ข้อ พร้อมเฉลยและคำอธิบาย', color: 'bg-purple-600' },
  { id: 'flashcards', btn: 'btn-pink', icon: Layers, label: 'แฟลชการ์ด', desc: 'การ์ดท่องจำ 12 ใบ พลิกเพื่อดูคำตอบ', color: 'bg-pink-600' },
  { id: 'qa', btn: 'btn-green', icon: HelpCircle, label: 'ถาม-ตอบ', desc: 'ถามอะไรก็ได้เกี่ยวกับเอกสารนี้', color: 'bg-emerald-600' },
  { id: 'detailed_summary', btn: 'btn-blue', icon: BookOpen, label: 'สรุปละเอียด', desc: 'แยกตามหัวข้อ เจาะลึกทุกส่วน', color: 'bg-indigo-600', pro: true },
  { id: 'report', btn: 'btn-yellow', icon: FlaskConical, label: 'รายงาน / Lab Report', desc: 'บทนำ วิธีการ ผลลัพธ์ อภิปราย สรุป', color: 'bg-orange-600', pro: true },
] as const

function parse<T>(s: string | undefined): T | null {
  try { return s ? JSON.parse(s) : null } catch { return null }
}

function QuizView({ data }: { data: Quiz }) {
  const [picked, setPicked] = useState<Record<number, number>>({})
  const done = Object.keys(picked).length === data.questions.length
  const score = data.questions.filter((q, i) => picked[i] === q.answer).length
  return (
    <div className="space-y-5">
      {done && (
        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
          <div><p className="text-sm text-purple-700 font-medium">คะแนนของคุณ</p><p className="text-3xl font-black text-purple-900">{score}/{data.questions.length}</p></div>
          <button onClick={() => setPicked({})} className="flex items-center gap-2 text-sm font-bold text-purple-700"><RotateCcw className="w-4 h-4" />ทำใหม่</button>
        </div>
      )}
      {data.questions.map((q, i) => (
        <div key={i} className="bg-white border-2 border-ink/15 rounded-2xl p-5 shadow-[0_4px_0_rgb(30_27_75/0.12)]">
          <p className="font-bold text-slate-900 mb-3">{i + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((o, j) => {
              const has = picked[i] !== undefined
              const correct = j === q.answer
              const chosen = picked[i] === j
              return (
                <button key={j} disabled={has} onClick={() => setPicked((p) => ({ ...p, [i]: j }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm flex items-center justify-between gap-2 transition-colors ${
                    !has ? 'border-slate-200 hover:border-purple-400 hover:bg-purple-50'
                    : correct ? 'border-green-400 bg-green-50 text-green-900'
                    : chosen ? 'border-red-400 bg-red-50 text-red-900' : 'border-slate-200 opacity-60'}`}>
                  <span>{o}</span>
                  {has && correct && <Check className="w-4 h-4 text-green-600 shrink-0" />}
                  {has && chosen && !correct && <X className="w-4 h-4 text-red-600 shrink-0" />}
                </button>
              )
            })}
          </div>
          {picked[i] !== undefined && q.explanation && <p className="mt-3 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">💡 {q.explanation}</p>}
        </div>
      ))}
    </div>
  )
}

function CardsView({ data }: { data: Cards }) {
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)
  const c = data.cards[i]
  const go = (d: number) => { setFlip(false); setI((x) => (x + d + data.cards.length) % data.cards.length) }
  return (
    <div className="max-w-lg mx-auto">
      <p className="text-center text-sm text-slate-500 mb-3">{i + 1} / {data.cards.length}</p>
      <button onClick={() => setFlip((f) => !f)} className={`w-full min-h-64 rounded-3xl p-8 text-center text-lg font-semibold shadow-lg transition-colors ${flip ? 'bg-pink-600 text-white' : 'bg-white border-2 border-pink-200 text-slate-900'}`}>
        {flip ? c.back : c.front}
        <span className={`block mt-4 text-xs font-medium ${flip ? 'text-pink-200' : 'text-slate-400'}`}>{flip ? 'คำตอบ' : 'แตะเพื่อพลิกดูคำตอบ'}</span>
      </button>
      <div className="flex justify-between mt-5">
        <button onClick={() => go(-1)} className="btn btn-white">ก่อนหน้า</button>
        <button onClick={() => go(1)} className="btn btn-pink">ถัดไป</button>
      </div>
    </div>
  )
}

export default function DocumentViewer({ document, history, plan }: { document: any; history: Row[]; plan: 'free' | 'pro' }) {
  const [rows, setRows] = useState<Row[]>(history)
  const [selected, setSelected] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ msg: string; upgrade: boolean } | null>(null)

  const active = ACTIONS.find((a) => a.id === selected)
  const latest = (action: string) => [...rows].reverse().find((r) => r.action === action)
  const qa = rows.filter((r) => r.action === 'qa')
  const ready = document.hasContent && !document.failed

  const run = async (action: string, prompt?: string) => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentId: document.id, action, prompt }) })
      const data = await res.json()
      if (!res.ok) { setError({ msg: data.error || 'เกิดข้อผิดพลาด', upgrade: data.code === 'LIMIT' || data.code === 'PRO_ONLY' }); return }
      setRows((r) => [...r, { action, message: prompt || action, response: data.result }])
      if (action === 'qa') setInput('')
    } catch { setError({ msg: 'เชื่อมต่อไม่ได้ กรุณาลองใหม่', upgrade: false }) }
    finally { setLoading(false) }
  }

  const ErrorBox = () => error && (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-sm text-red-700 mb-4">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <div>
        <p>{error.msg}</p>
        {error.upgrade && BILLING_ENABLED && <Link href="/dashboard/billing" className="inline-block mt-2 font-bold underline">ดูแพ็กเกจ Pro →</Link>}
      </div>
    </div>
  )

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="pop-card overflow-hidden h-[40vh] lg:h-[78vh] lg:sticky lg:top-6">
        {document.file_type === 'application/pdf' && document.previewUrl ? (
          <iframe src={document.previewUrl} className="w-full h-full" title={document.title} />
        ) : document.file_type.startsWith('image/') && document.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={document.previewUrl} alt={document.title} className="w-full h-full object-contain p-4" />
        ) : (
          <div className="p-6 overflow-y-auto h-full whitespace-pre-wrap text-sm text-slate-700">{document.text || 'ไม่มีเนื้อหา'}</div>
        )}
      </div>

      <div className="pop-card p-5 md:p-6 min-h-[50vh]">
        {!ready && (
          <div className={`p-4 rounded-xl flex gap-3 text-sm mb-4 ${document.failed ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'}`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{document.failed ? 'อ่านข้อความจากไฟล์นี้ไม่สำเร็จ ลองอัปโหลดไฟล์ที่ชัดเจนกว่าเดิม' : 'กำลังประมวลผลเอกสาร… รีเฟรชหน้านี้อีกครั้งในไม่กี่วินาที'}</p>
          </div>
        )}

        {!active && (
          <>
            <h2 className="text-xl font-black flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-blue-500" />อยากให้ AI ช่วยอะไร?</h2>
            <div className="grid gap-3">
              {ACTIONS.map((a) => {
                const locked = BILLING_ENABLED && 'pro' in a && a.pro && plan !== 'pro'
                return (
                  <button key={a.id} disabled={!ready} onClick={() => { setSelected(a.id); setError(null) }}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-ink/15 shadow-[0_4px_0_rgb(30_27_75/0.15)] hover:-translate-y-0.5 hover:border-ink text-left transition-all disabled:opacity-50 bg-white">
                    <div className={`w-12 h-12 rounded-2xl border-2 border-ink/20 flex items-center justify-center text-white ${a.color}`}><a.icon className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 flex items-center gap-2">{a.label}{locked && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1"><Lock className="w-3 h-3" />PRO</span>}</p>
                      <p className="text-sm text-slate-500">{a.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {active && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => { setSelected(null); setError(null) }} className="text-sm text-slate-500 hover:text-slate-900 font-medium">← กลับ</button>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${active.color}`}><active.icon className="w-4 h-4" /></div>
              <h3 className="font-bold text-slate-900">{active.label}</h3>
            </div>
            <ErrorBox />

            {active.id === 'qa' ? (
              <div className="flex flex-col h-[55vh]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-3">
                  {qa.length === 0 && !loading && <p className="text-center text-slate-400 mt-16">พิมพ์คำถามเกี่ยวกับเอกสารด้านล่างได้เลย</p>}
                  {qa.map((m, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-end"><div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%]">{m.message}</div></div>
                      <div className="bg-slate-100 text-slate-900 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[90%] prose prose-sm"><ReactMarkdown>{m.response}</ReactMarkdown></div>
                    </div>
                  ))}
                  {loading && <div className="text-slate-400 flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" />กำลังคิด…</div>}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (input.trim() && !loading) run('qa', input) }} className="flex gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={1000} placeholder="ถามคำถาม…" disabled={loading}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button disabled={loading || !input.trim()} className="btn btn-green !p-3"><Send className="w-5 h-5" /></button>
                </form>
              </div>
            ) : (
              <>
                {loading ? (
                  <div className="py-20 flex flex-col items-center gap-3 text-slate-500"><Loader2 className="w-10 h-10 animate-spin text-blue-500" />AI กำลังทำงาน… ประมาณ 10-30 วินาที</div>
                ) : latest(active.id) ? (
                  <div>
                    {active.id === 'quiz' ? (() => { const d = parse<Quiz>(latest('quiz')?.response); return d ? <QuizView key={rows.length} data={d} /> : null })()
                    : active.id === 'flashcards' ? (() => { const d = parse<Cards>(latest('flashcards')?.response); return d ? <CardsView key={rows.length} data={d} /> : null })()
                    : <div className="prose prose-sm max-w-none text-slate-800"><ReactMarkdown>{latest(active.id)!.response}</ReactMarkdown></div>}
                    <button onClick={() => run(active.id)} className="mt-6 text-sm text-blue-600 font-bold flex items-center gap-1.5"><RotateCcw className="w-4 h-4" />สร้างใหม่ (ใช้ 1 โควตา)</button>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-slate-500 mb-6">{active.desc}</p>
                    <button onClick={() => run(active.id)} disabled={!ready} className={`btn ${active.btn} text-lg px-10`}>เริ่มเลย</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
