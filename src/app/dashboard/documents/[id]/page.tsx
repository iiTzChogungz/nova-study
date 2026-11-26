import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DocumentViewer from './DocumentViewer'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { storagePath } from '@/lib/storage'
import { getPlan } from '@/lib/usage'

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: doc } = await supabase.from('documents').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!doc) redirect('/dashboard')

  const { data: history } = await supabase
    .from('conversations')
    .select('id, action, message, response, created_at')
    .eq('document_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  // Bucket is private: hand the browser a short-lived signed URL for the preview.
  const { data: signed } = await supabase.storage.from('documents').createSignedUrl(storagePath(doc.file_url), 3600)
  const plan = await getPlan(user.id)

  const { content, file_url: _omit, ...safeDoc } = doc
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all"><ChevronLeft className="w-6 h-6" /></Link>
        <h1 className="font-bold text-slate-900 truncate">{doc.title}</h1>
      </div>
      <DocumentViewer
        document={{ ...safeDoc, previewUrl: signed?.signedUrl ?? null, hasContent: !!content, failed: !!content?.startsWith('ERROR:'), text: content && !content.startsWith('ERROR:') ? content.slice(0, 20000) : '' }}
        history={history || []}
        plan={plan}
      />
    </div>
  )
}
