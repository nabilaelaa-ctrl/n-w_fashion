"use client"
import { useState } from "react"

export default function ProductGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Jika tidak ada gambar sama sekali
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
        <div className="text-center p-8">
          <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="font-medium text-gray-500">Foto Tidak Tersedia</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full">
      
      {/* --- THUMBNAIL (Samping Kiri untuk Desktop, Bawah untuk Mobile) --- */}
      <div className="flex flex-row md:flex-col gap-3 md:w-24 lg:w-28 order-2 md:order-1 overflow-x-auto md:overflow-y-auto scrollbar-hide pb-2 md:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative flex-shrink-0 w-16 h-16 md:w-full md:h-auto md:aspect-square rounded-xl overflow-hidden transition-all duration-300 group border-2 ${
              activeIndex === idx 
                ? 'border-rose-500 shadow-lg scale-105' 
                : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-200'
            }`}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              className="w-full h-full object-cover" 
            />
            
            {/* Efet Overlay saat Aktif */}
            {activeIndex === idx && (
              <div className="absolute inset-0 bg-black/10"></div>
            )}
          </button>
        ))}
      </div>

      {/* --- GAMBAR UTAMA (Kanan/Besar) --- */}
      <div className="flex-1 relative order-1 md:order-2 group">
        
        <div className="relative w-full aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          
          {/* Gambar dengan Animasi Fade & Zoom */}
          {/* Kita pakai key agar animasi trigger setiap gambar berubah */}
          <div key={activeIndex} className="relative w-full h-full group/img cursor-zoom-in">
            <img 
              src={images[activeIndex]} 
              alt={`Product Image ${activeIndex + 1}`}
              className="w-full h-full object-contain transition-transform duration-700 ease-in-out group-hover/img:scale-125"
            />
            
            {/* Gradient Overlay untuk estetika */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Navigasi Panah (Hanya muncul saat Hover) */}
          {images.length > 1 && (
            <>
               <button 
                  onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-rose-500 hover:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               </button>
               <button 
                  onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-rose-500 hover:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </button>
            </>
          )}
        </div>

        {/* Indikator Posisi Gambar (misal: 1 / 5) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {activeIndex + 1} / {images.length}
          </div>
        )}
        
      </div>
    </div>
  )
}