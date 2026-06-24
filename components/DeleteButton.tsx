"use client"

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DeleteButtonProps {
  className?: string
  message?: string
  children?: React.ReactNode
}

export default function DeleteButton({ 
  className, 
  message = "Apakah Anda yakin ingin menghapus data ini?", 
  children 
}: DeleteButtonProps) {
  
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Efek untuk mounting portal (hanya di client-side)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleConfirm = () => {
    // Cari form parent terdekat dari tombol yang memicu modal
    // Kita perlu menandai tombol asli sedikit lebih baik atau cari relatif
    // Cara paling aman: cari form yang berisi input hidden 'reviewId' aktif
    
    // Trik: Karena tombol ini ada di dalam form, kita bisa referensi parent form-nya via ref atau logic sederhana
    const form = document.querySelector('form')
    
    if (form) {
      form.requestSubmit()
    }
    setShowModal(false)
  }

  // Komponen Modal yang akan di-teleport
  const ModalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setShowModal(false)} // Klik luar untuk tutup
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam menutup modal
      >
        
        {/* Header dengan Icon */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 pt-8 pb-12 relative flex justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg absolute -bottom-10 border-4 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>

        {/* Konten */}
        <div className="pt-14 pb-6 px-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus Data?</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all focus:outline-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all focus:outline-none shadow-sm"
          >
            Ya, Hapus
          </button>
        </div>
        
      </div>
    </div>
  )

  return (
    <>
      {/* TOMBOL UTAMA */}
      <button 
        type="button"
        className={className || "bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"}
        onClick={() => setShowModal(true)}
      >
        {children || "Hapus"}
      </button>

      {/* RENDER MODAL VIA PORTAL */}
      {/* Hanya render jika sudah mounted (di client) dan showModal true */}
      {mounted && showModal && createPortal(ModalContent, document.body)}
    </>
  )
}