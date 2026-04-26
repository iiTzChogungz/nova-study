'use client'

import { useState } from 'react'
import { Check, Loader2, Sparkles } from 'lucide-react'

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      })
      const data = await res.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to start checkout process')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Upgrade to Pro</h1>
        <p className="text-gray-500 mt-2">Unlock the full potential of Rocket Learn.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative">
          <h2 className="text-xl font-semibold mb-2">Free Plan</h2>
          <div className="text-4xl font-bold mb-6">0 THB<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span>3 File Uploads per day</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span>20 AI Queries per day</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span>Basic Summaries</span>
            </li>
          </ul>

          <button disabled className="w-full py-3 px-4 bg-gray-100 text-gray-500 font-medium rounded-xl cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-blue-600 rounded-3xl p-8 border border-blue-500 shadow-xl relative text-white transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-400 to-pink-500 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider">
            Most Popular
          </div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            Pro Plan <Sparkles className="w-5 h-5 text-yellow-300" />
          </h2>
          <div className="text-4xl font-bold mb-6">99 THB<span className="text-lg text-blue-200 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 text-blue-50">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-blue-200" />
              <span>50 File Uploads per month</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-blue-200" />
              <span>500 AI Queries per month</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-blue-200" />
              <span>Detailed Summaries (GPT-4o)</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-blue-200" />
              <span>Advanced Lab Reports</span>
            </li>
          </ul>

          <button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upgrade Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
