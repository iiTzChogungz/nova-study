import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  BookOpen, 
  Clock, 
  FileText, 
  LayoutDashboard, 
  Settings, 
  CreditCard,
  ChevronRight,
  Sparkles,
  GraduationCap
} from 'lucide-react'
import UploadButton from '@/components/UploadButton'
import DeleteDocButton from '@/components/DeleteDocButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user profile for credits/plan
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Calculate usage percentages
  const uploadLimit = profile?.plan === 'pro' ? 100 : 5
  const queryLimit = profile?.plan === 'pro' ? 500 : 20
  
  const uploadUsed = documents?.length || 0
  const uploadPct = Math.min((uploadUsed / uploadLimit) * 100, 100)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-black text-blue-600 tracking-tight">
            <GraduationCap className="w-8 h-8" />
            Nova Study
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/billing" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all">
            <CreditCard className="w-5 h-5" />
            Billing
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        {/* Usage Stats in Sidebar */}
        <div className="p-6 m-4 bg-slate-900 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Usage Status</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-400">
                <span>Uploads</span>
                <span>{uploadUsed}/{uploadLimit}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${uploadPct}%` }}
                />
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Current Plan: <span className="text-blue-400 font-bold uppercase">{profile?.plan || 'Free'}</span>
              </p>
              {profile?.plan !== 'pro' && (
                <Link href="/dashboard/billing" className="mt-3 block text-center py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors">
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome back, {user.email?.split('@')[0]}</h1>
            <p className="text-slate-500 font-medium">Ready to transform your study materials with AI?</p>
          </div>
          <UploadButton variant="primary" />
        </header>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {documents?.map((doc) => (
            <div 
              key={doc.id} 
              className="group bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                
                {doc.content && doc.content.startsWith('ERROR:') ? (
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-full">Error</span>
                ) : doc.content ? (
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full">Ready</span>
                ) : (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full animate-pulse">Processing</span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 mb-2 truncate pr-8" title={doc.title}>
                {doc.title}
              </h3>
              
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-6">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(doc.created_at).toLocaleDateString()}
                </div>
                <div className="uppercase">{doc.file_type.split('/')[1] || 'DOC'}</div>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <Link 
                  href={`/dashboard/documents/${doc.id}`}
                  className="flex-1 py-3 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  Open Study Lab
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <DeleteDocButton id={doc.id} />
              </div>
            </div>
          ))}

          {documents?.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No documents yet</h3>
              <p className="text-slate-500 mb-8 max-w-sm">Upload your first PDF or image to start learning with Nova Study's AI.</p>
              <UploadButton variant="outline" />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
