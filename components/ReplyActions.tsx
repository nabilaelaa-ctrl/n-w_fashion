// components/ReplyActions.tsx
"use client"

import { useState } from 'react'
import { replyToReview, deleteReply } from '@/app/actions/review'

interface ReplyActionsProps {
  reviewId: string
  currentReply: string | null
}

export default function ReplyActions({ reviewId, currentReply }: ReplyActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(currentReply || "")

  // Jika sedang mode edit (tampilan input)
  if (isEditing || !currentReply) {
    return (
      <form 
        action={async (formData) => {
          // Panggil server action
          await replyToReview(formData)
          // Jika sebelumnya tidak ada balasan (mode baru), reset input state
          if (!currentReply) setText("")
          // Jika mode edit, kembali ke mode biasa
          if (isEditing) setIsEditing(false)
        }} 
        className="flex-grow w-full sm:w-auto flex gap-2 items-center"
      >
        <input type="hidden" name="reviewId" value={reviewId} />
        <input 
          type="text" 
          name="replyText" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis balasan..."
          className="flex-grow sm:w-64 text-sm px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
          required
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md active:scale-95"
        >
          {currentReply ? "Simpan" : "Balas"}
        </button>
        {/* Tombol Batal hanya muncul saat Edit */}
        {currentReply && (
          <button 
            type="button"
            onClick={() => { setIsEditing(false); setText(currentReply); }}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Batal
          </button>
        )}
      </form>
    )
  }

  // Jika sudah ada balasan (tampilan tombol)
  return (
    <div className="flex gap-2 items-center justify-end w-full sm:w-auto">
      <span className="text-xs text-green-600 font-bold flex items-center gap-1 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Sudah Dibalas
      </span>

      {/* Tombol Edit */}
      <button 
        onClick={() => setIsEditing(true)}
        className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-lg hover:bg-yellow-100 border border-yellow-200 transition-all"
      >
        Edit Balasan
      </button>

      {/* Tombol Hapus Balasan */}
      <form action={deleteReply}>
        <input type="hidden" name="reviewId" value={reviewId} />
        <button 
          type="submit"
          className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-red-50 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-all"
        >
          Hapus Balasan
        </button>
      </form>
    </div>
  )
}