'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteDocButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm) {
      setConfirm(true)
      // Auto reset confirm state after 3s if not clicked again
      setTimeout(() => setConfirm(false), 3000)
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.refresh()
    } catch {
      setIsDeleting(false)
      setConfirm(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      title={confirm ? 'กดอีกครั้งเพื่อยืนยันการลบ' : 'ลบเอกสาร'}
      className={`absolute bottom-4 right-4 p-1.5 rounded-lg transition-all z-10 ${
        confirm
          ? 'bg-red-100 text-red-600 ring-2 ring-red-400 scale-110'
          : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100'
      }`}
    >
      {isDeleting
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <Trash2 className="w-4 h-4" />
      }
    </button>
  )
}
