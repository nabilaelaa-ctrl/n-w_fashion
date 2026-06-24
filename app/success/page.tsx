"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti' 

// Komponen Ikon SVG
const Icons = {
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  shop: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  receipt: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Konfigurasi Confetti Pinky
    try {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        
        // Confetti dari kiri
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#f43f5e', '#fb7185', '#fda4af', '#ffffff'] 
        });
        // Confetti dari kanan
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#ec4899', '#f472b6', '#fbcfe8', '#ffffff'] 
        });
      }, 250);
    } catch (e) {
      // Abaikan jika library tidak ada
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative overflow-hidden p-4">
      
      {/* Dekorasi Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 w-full max-w-lg">
        
        {/* Card Utama */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-200/50 border border-white overflow-hidden p-8 md:p-12 text-center">
          
          {/* Ikon Sukses */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Lingkaran Pinggir (Pulse Effect) */}
            <div className="absolute inset-0 rounded-full bg-rose-400 opacity-20 animate-ping"></div>
            {/* Lingkaran Utama */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-300/50">
              {Icons.check}
            </div>
          </div>

          {/* Teks */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-3">
            Checkout Berhasil!
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed max-w-sm mx-auto">
            Terima kasih telah berbelanja di <span className="font-bold text-rose-500">TokoBaju</span>. Pesanan Anda sedang diproses dan akan segera dikirim.
          </p>

          {/* Ilustrasi Kecil (Opsional) */}
          <div className="flex justify-center gap-4 mb-10 text-gray-300">
            <svg className="w-8 h-8 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            <svg className="w-8 h-8 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <svg className="w-8 h-8 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>

          {/* Tombol Aksi */}
          <div className="space-y-4">
            <Link href="/" className="group flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-rose-200 active:scale-[0.98] transition-all duration-300">
              {Icons.shop}
              Lanjut Belanja
            </Link>
            <Link href="/orders" className="flex items-center justify-center gap-2 w-full bg-white text-gray-600 font-semibold py-4 rounded-xl border border-gray-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all">
              {Icons.receipt}
              Lihat Pesanan Saya
            </Link>
          </div>
          
          <p className="text-center text-[10px] text-gray-400 mt-8 tracking-wide">
            Anda akan menerima notifikasi melalui WhatsApp/Email.
          </p>

        </div>
      </div>
    </div>
  )
}