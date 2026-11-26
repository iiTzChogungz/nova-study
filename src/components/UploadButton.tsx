'use client'

import { useState, useRef } from 'react'
import { Plus, X, CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UploadButton({ variant = 'outline' }: { variant?: 'primary' | 'outline' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)
  
  const router = useRouter()
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  const startProgressSimulation = () => {
    stopProgress()
    setProgress(0)
    
    progressIntervalRef.current = setInterval(() => {
      setProgress((old) => {
        if (old >= 90) {
          stopProgress()
          return 90
        }
        // Speed up early, slow down later
        const increment = old < 50 ? 5 : 1
        return old + increment
      })
    }, 400)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setError('ไฟล์ใหญ่เกิน 10MB'); return }

    setIsUploading(true)
    setIsDone(false)
    setError(null)
    startProgressSimulation()

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      stopProgress()

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'อัปโหลดไม่สำเร็จ')
      }

      // If we reach here, it's a success
      setProgress(100)
      setIsDone(true)
      router.refresh()

      // Close modal quickly after success
      setTimeout(() => {
        setIsOpen(false)
        setIsUploading(false)
        setIsDone(false)
        setProgress(0)
      }, 1000)

    } catch (err: any) {
      stopProgress()
      setError(err.message)
      setIsUploading(false)
      setProgress(0)
    }
  }

  const styles = {
    primary: "btn btn-green",
    outline: "btn btn-green"
  }

  return (
    <>
      <button onClick={() => { setIsOpen(true); setError(null); setIsDone(false); }} className={styles[variant]}>
        <Plus className="w-5 h-5" />
        อัปโหลดเอกสาร
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="pop-card w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {!isUploading && (
              <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">อัปโหลดเอกสาร</h2>
            <p className="text-sm text-gray-500 mb-8">AI จะอ่านและเรียนรู้จากไฟล์ของคุณ</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-start gap-3 animate-in slide-in-from-top-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            {!isUploading ? (
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleUpload}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                />
                <div className="pointer-events-none flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-gray-700">คลิกเพื่อเลือกไฟล์</p>
                  <p className="text-xs text-gray-400 font-medium">PDF, รูปภาพ หรือ TXT (ไม่เกิน 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-3">
                     {isDone ? (
                       <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in" />
                     ) : (
                       <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                     )}
                     <span className="font-bold text-gray-900">
                       {isDone ? 'อัปโหลดสำเร็จ!' : 'กำลังอัปโหลด...'}
                     </span>
                   </div>
                   <span className="text-2xl font-black text-gray-300">{Math.round(progress)}%</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-300 ease-out ${isDone ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                  {isDone ? 'กำลังรีเฟรช...' : 'อย่าปิดหน้านี้ขณะอัปโหลด'}
                </p>
              </div>
            )}

            {!isUploading && (
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
