"use client"
import { useState } from 'react'

export default function ProductAccordions({ 
  description, 
  reviews 
}: { 
  description: string, 
  reviews?: any[]
}) {
  const [openSection, setOpenSection] = useState<string | null>('desc')

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg 
      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180 text-rose-500' : ''}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  )

  return (
    <div className="mt-8 space-y-4 font-sans">
      
      {/* 1. DROPDOWN DESKRIPSI */}
      <div className="group border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <button 
          onClick={() => toggleSection('desc')} 
          className="w-full px-6 py-5 flex items-center justify-between bg-transparent outline-none"
        >
          <span className={`font-semibold text-base flex items-center gap-3 transition-colors duration-300 ${openSection === 'desc' ? 'text-rose-600' : 'text-gray-700 group-hover:text-rose-500'}`}>
            <div className={`p-2 rounded-xl transition-colors duration-300 ${openSection === 'desc' ? 'bg-rose-100 text-rose-600' : 'bg-gray-50 text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            Detail & Deskripsi Produk
          </span>
          <ChevronIcon isOpen={openSection === 'desc'} />
        </button>

        {/* Animasi Grid untuk Deskripsi */}
        <div className={`grid transition-all duration-300 ease-in-out ${openSection === 'desc' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="px-6 pb-6 pt-2 text-gray-600 text-[15px] leading-loose whitespace-pre-wrap">
              <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-50">
                {description || "Tidak ada deskripsi untuk produk ini."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DROPDOWN ULASAN PEMBELI */}
      <div className="group border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <button 
          onClick={() => toggleSection('review')} 
          className="w-full px-6 py-5 flex items-center justify-between bg-transparent outline-none"
        >
          <span className={`font-semibold text-base flex items-center gap-3 transition-colors duration-300 ${openSection === 'review' ? 'text-yellow-600' : 'text-gray-700 group-hover:text-yellow-600'}`}>
            <div className={`p-2 rounded-xl transition-colors duration-300 ${openSection === 'review' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-50 text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-500'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            Ulasan Pembeli ({reviews?.length || 0})
          </span>
          <ChevronIcon isOpen={openSection === 'review'} />
        </button>
        
        <div className={`grid transition-all duration-300 ease-in-out ${openSection === 'review' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            {/* Container dengan Scroll */}
            <div className="px-6 pb-6 pt-2 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 space-y-5">
              
              {reviews && reviews.length > 0 ? (
                reviews.map((rev: any) => (
                  <div key={rev.id} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm">
                    
                    {/* Header Review: Avatar, Nama, Rating */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700 flex items-center justify-center font-bold text-sm uppercase shadow-sm border border-rose-50">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{rev.user?.name || 'Anonim'}</p>
                          <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                            {new Date(rev.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-yellow-400 text-sm">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </div>
                    </div>

                    {/* Komentar User */}
                    {rev.comment && (
                      <p className="text-[14px] text-gray-600 leading-relaxed bg-gray-50/80 p-4 rounded-xl mt-3">
                        "{rev.comment}"
                      </p>
                    )}

                    {/* --- BAGIAN BALASAN ADMIN (DITAMBAHKAN) --- */}
                    {rev.adminReply && (
                      <div className="mt-4 ml-4 border-l-4 border-blue-400 bg-blue-50/50 p-4 rounded-r-xl relative">
                        <div className="absolute -top-2 left-3 px-2 bg-blue-50 text-[10px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Balasan Admin
                        </div>
                        <p className="text-sm text-blue-900 font-medium pt-1 whitespace-pre-wrap leading-relaxed">
                          {rev.adminReply}
                        </p>
                        {rev.adminRepliedAt && (
                          <p className="text-[10px] text-blue-400 mt-2 text-right">
                            {new Date(rev.adminRepliedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    )}
                    {/* ------------------------------------------ */}

                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                   </div>
                   <h3 className="text-sm font-semibold text-gray-700">Belum ada ulasan</h3>
                   <p className="text-xs text-gray-500 mt-1">Jadilah yang pertama memberikan ulasan untuk produk ini.</p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}