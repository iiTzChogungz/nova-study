import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Settings, User, CreditCard, Mail } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch user details from our public.users table
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile and preferences.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Profile Section */}
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            Profile Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email Address
              </label>
              <input 
                type="email" 
                value={user.email || ''} 
                disabled 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-2">Your email address is managed via your authentication provider.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input 
                type="text" 
                value={user.id} 
                disabled 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Plan Section */}
        <div className="p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            Subscription Plan
          </h2>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Plan</p>
              <p className="text-xl font-bold text-gray-900 capitalize flex items-center gap-2">
                {userProfile?.plan || 'Free'}
                {userProfile?.plan === 'pro' && (
                  <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full uppercase tracking-wider">Active</span>
                )}
              </p>
            </div>
            {userProfile?.plan === 'free' && (
              <a href="/dashboard/billing" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-sm">
                Upgrade to Pro
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
