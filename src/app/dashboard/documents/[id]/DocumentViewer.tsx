'use client'

import { useState } from 'react'
import { Send, Loader2, Sparkles, BookOpen, HelpCircle, FileSignature, Brain, AlignLeft, FlaskConical, CheckCircle, AlertCircle } from 'lucide-react'

type Message = { id?: string, message: string, response: string, created_at?: string }

const ACTIONS = [
  {
    id: 'summarize',
    icon: AlignLeft,
    label: 'Quick Summary',
    description: 'Get a concise overview of the whole document',
    color: 'blue',
    bgClass: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400',
    iconClass: 'text-blue-600',
    badgeClass: 'bg-blue-600 text-white',
  },
  {
    id: 'detailed_summary',
    icon: BookOpen,
    label: 'Detailed Summary',
    description: 'Section-by-section in-depth breakdown',
    color: 'indigo',
    bgClass: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 hover:border-indigo-400',
    iconClass: 'text-indigo-600',
    badgeClass: 'bg-indigo-600 text-white',
  },
  {
    id: 'quiz',
    icon: Brain,
    label: 'Generate Quiz',
    description: 'Multiple-choice questions with explanations',
    color: 'purple',
    bgClass: 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400',
    iconClass: 'text-purple-600',
    badgeClass: 'bg-purple-600 text-white',
  },
  {
    id: 'qa',
    icon: HelpCircle,
    label: 'Ask a Question',
    description: 'Type your question and get a precise answer',
    color: 'emerald',
    bgClass: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-400',
    iconClass: 'text-emerald-600',
    badgeClass: 'bg-emerald-600 text-white',
  },
  {
    id: 'report',
    icon: FlaskConical,
    label: 'Lab Report',
    description: 'Auto-generate Introduction, Methodology & Discussion',
    color: 'orange',
    bgClass: 'bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-400',
    iconClass: 'text-orange-600',
    badgeClass: 'bg-orange-600 text-white',
  },
]

export default function DocumentViewer({ document, initialConversations = [] }: { document: any, initialConversations?: Message[] }) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialConversations)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAIAction = async (action: string, prompt?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id, action, prompt })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      if (action === 'qa' && prompt) {
        setMessages(prev => [...prev, { message: prompt, response: data.result }])
        setInput('')
      } else {
        setResult(data.result)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const activeAction = ACTIONS.find(a => a.id === selectedAction)

  const hasContent = !!document.content

  return (
    <div className="flex h-full">
      {/* File Viewer Pane (desktop only) */}
      <div className="w-1/2 border-r border-gray-200 bg-gray-50 flex flex-col relative hidden lg:flex">
        {document.file_type === 'application/pdf' ? (
          <iframe src={document.file_url} className="w-full h-full" title={document.title} />
        ) : document.file_type.startsWith('image/') ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={document.file_url} alt={document.title} className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
          </div>
        ) : (
          <div className="p-8 overflow-y-auto w-full h-full whitespace-pre-wrap font-mono text-sm">
            {document.content || "No text content available."}
          </div>
        )}
      </div>

      {/* AI Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden shadow-2xl lg:shadow-none lg:border-l lg:border-slate-100">

        {/* No content warning */}
        {!hasContent && (
          <div className="m-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3 text-sm text-yellow-800">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-yellow-600" />
            <div>
              <p className="font-semibold">Document is still processing</p>
              <p className="text-yellow-700 mt-1">Text extraction may have failed or is in progress. AI features may not work correctly for this document. Try re-uploading the file.</p>
            </div>
          </div>
        )}

        {/* Action Picker – shown when no action selected */}
        {!selectedAction && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                What would you like to do?
              </h2>
              <p className="text-sm text-gray-500 mt-1">Choose an AI action below to get started</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => { setSelectedAction(action.id); setResult(null); setError(null) }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group ${action.bgClass}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm`}>
                    <action.icon className={`w-6 h-6 ${action.iconClass}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-gray-800">{action.label}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Action View */}
        {selectedAction && activeAction && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Action header */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b border-gray-100`}>
              <button onClick={() => { setSelectedAction(null); setResult(null); setError(null) }} className="text-xs text-gray-500 hover:text-gray-800 font-medium underline underline-offset-2">
                ← Back
              </button>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeAction.badgeClass}`}>
                <activeAction.icon className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-gray-900">{activeAction.label}</h3>
            </div>

            {/* Q&A Chat Mode */}
            {selectedAction === 'qa' ? (
              <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
                <div className="flex-1 overflow-y-auto space-y-6 mb-4">
                  {messages.length === 0 && !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-8 h-8" />
                      </div>
                      <p className="text-gray-500 max-w-xs">Ask any question about your document. The AI will find the most relevant parts and answer accurately.</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className="space-y-4 animate-in slide-in-from-bottom-2">
                      <div className="flex justify-end">
                        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                          {m.message}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 px-5 py-3 rounded-2xl rounded-tl-sm max-w-[85%] whitespace-pre-wrap">
                          {m.response}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-500 px-5 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                      </div>
                    </div>
                  )}
                </div>
                <form
                  onSubmit={(e) => { e.preventDefault(); if (input.trim()) handleAIAction('qa', input) }}
                  className="border-t border-gray-100 pt-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ) : (
              /* All other actions: Summary, Quiz, Report */
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {!result && !isLoading && !error && (
                  <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${activeAction.bgClass}`}>
                      <activeAction.icon className={`w-10 h-10 ${activeAction.iconClass}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{activeAction.label}</h3>
                      <p className="text-gray-500 mt-2 max-w-sm">{activeAction.description}</p>
                    </div>
                    <button
                      onClick={() => handleAIAction(selectedAction)}
                      disabled={!hasContent}
                      className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-[0.95] flex items-center gap-2 ${activeAction.badgeClass} disabled:opacity-50`}
                    >
                      <Sparkles className="w-5 h-5" />
                      {!hasContent ? 'Document not ready' : `Start ${activeAction.label}`}
                    </button>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    <p className="text-gray-500 font-medium">AI is working on your document...</p>
                    <p className="text-xs text-gray-400">This may take 10-30 seconds</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 text-sm text-red-700">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="mt-1">{error}</p>
                      <button onClick={() => setError(null)} className="mt-3 underline text-red-600 font-medium">Try again</button>
                    </div>
                  </div>
                )}

                {result && !isLoading && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Done! Here is your {activeAction.label.toLowerCase()}.
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {result}
                    </div>
                    <button
                      onClick={() => { setResult(null); setError(null) }}
                      className="text-sm text-blue-600 underline underline-offset-2"
                    >
                      Generate again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
