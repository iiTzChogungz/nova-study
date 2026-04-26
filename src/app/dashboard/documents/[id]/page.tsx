import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DocumentViewer from './DocumentViewer'
import Link from 'next/link'
import { ChevronLeft, GraduationCap } from 'lucide-react'

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .eq('document_id', id)
    .order('created_at', { ascending: true })

  if (!doc) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-2 font-black text-blue-600 tracking-tight text-lg">
            <GraduationCap className="w-6 h-6" />
            Nova Study
          </div>
        </div>

        <div className="hidden md:block">
          <h1 className="font-bold text-slate-900 text-sm max-w-[300px] truncate">{doc.title}</h1>
        </div>

        <div className="flex items-center gap-4">
           <span className="text-[10px] font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full uppercase">
             Study Lab
           </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <DocumentViewer document={doc} initialConversations={conversations || []} />
      </div>
    </div>
  )
}
