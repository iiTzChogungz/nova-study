import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Clock, FileText, ChevronRight } from 'lucide-react'
import UploadButton from '@/components/UploadButton'
import DeleteDocButton from '@/components/DeleteDocButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: documents } = await supabase
    .from('documents')
    .select('id, title, file_type, created_at, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const processing = documents?.some((d) => !d.content)

  return (
    <div className="max-w-6xl mx-auto">
      {processing && <meta httpEquiv="refresh" content="6" />}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">สวัสดี, {user.email?.split('@')[0]}</h1>
          <p className="text-slate-500 font-medium">อัปโหลดเอกสาร แล้วให้ AI สรุป ติว และออกข้อสอบให้</p>
        </div>
        <UploadButton variant="primary" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {documents?.map((doc) => {
          const failed = doc.content?.startsWith('ERROR:')
          return (
            <div key={doc.id} className="group relative bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><FileText className="w-6 h-6" /></div>
                {failed ? (
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full">อ่านไฟล์ไม่สำเร็จ</span>
                ) : doc.content ? (
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full">พร้อมใช้งาน</span>
                ) : (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full animate-pulse">กำลังประมวลผล</span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 mb-2 truncate" title={doc.title}>{doc.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-6">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(doc.created_at).toLocaleDateString('th-TH')}</span>
                <span className="uppercase">{doc.file_type.split('/')[1] || 'DOC'}</span>
              </div>
              <Link href={`/dashboard/documents/${doc.id}`} className="py-3 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all">
                เปิดห้องติว <ChevronRight className="w-4 h-4" />
              </Link>
              <DeleteDocButton id={doc.id} />
            </div>
          )
        })}

        {documents?.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6"><BookOpen className="w-10 h-10 text-slate-300" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">ยังไม่มีเอกสาร</h3>
            <p className="text-slate-500 mb-8 max-w-sm">อัปโหลด PDF, รูปภาพ หรือโน้ตแรกของคุณ เพื่อเริ่มติวกับ Nova Study</p>
            <UploadButton variant="outline" />
          </div>
        )}
      </div>
    </div>
  )
}
