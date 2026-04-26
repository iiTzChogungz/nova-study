import Link from 'next/link'
import { Rocket, Sparkles, Brain, Zap, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <Rocket className="w-8 h-8" />
          Rocket Learn
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4" />
          Your AI Study Companion
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 delay-150 fill-mode-both">
          Master any subject <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">in record time.</span>
        </h1>
        
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 delay-300 fill-mode-both">
          Upload your PDFs, images, or notes. Rocket Learn instantly generates summaries, answers questions, and builds interactive quizzes.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 delay-500 fill-mode-both">
          <Link href="/register" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
            Start Learning for Free
            <Rocket className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400 sm:hidden">No credit card required</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Summaries</h3>
            <p className="text-gray-500">Transform long, boring textbooks into bite-sized, easy-to-understand summaries in seconds.</p>
          </div>
          
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Q&A</h3>
            <p className="text-gray-500">Have a question? Ask our AI tutor. It reads your documents and gives you the exact answer instantly.</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Auto-Generated Quizzes</h3>
            <p className="text-gray-500">Test your knowledge before the exam. Generate comprehensive multiple-choice quizzes with explanations.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
