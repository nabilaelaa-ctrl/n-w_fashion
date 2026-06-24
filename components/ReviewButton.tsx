"use client"
import { useState } from 'react'
import { submitReviewAction } from '@/app/actions/review'
import toast from 'react-hot-toast'

// Definisi tipe untuk data review
interface ReviewData {
  rating: number
  comment: string | null
  adminReply?: string | null
  adminRepliedAt?: Date | string | null
}

interface ReviewButtonProps {
  orderItemId: string
  productId: string
  productName: string
  hasReviewed: boolean
  // Properti review sekarang menjadi opsi wajib jika hasReviewed true
  review?: ReviewData | null
}

export default function ReviewButton({ orderItemId, productId, productName, hasReviewed, review }: ReviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ==================================================
  // TAMPILAN 1: SUDAH REVIEW (Dengan Balasan Admin)
  // ==================================================
  if (hasReviewed && review) {
    return (
      <div className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        
        {/* Header Card */}
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-3 py-1.5 rounded-full shadow-sm">
            <span className="text-sm">✅</span>
            <span className="text-xs font-bold text-green-700 tracking-wide">Ulasan Terkirim</span>
          </div>
          
          {/* Bintang Rating User */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-lg ${review.rating >= star ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                ⭐
              </span>
            ))}
          </div>
        </div>

        {/* Komentar User */}
        {review.comment ? (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 italic leading-relaxed">
              "{review.comment}"
            </p>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
            <p className="text-xs text-gray-400 italic">Kamu hanya memberikan rating bintang.</p>
          </div>
        )}

        {/* BAGIAN BALASAN ADMIN (Jika Ada) */}
        {review.adminReply && (
          <div className="relative mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm">
            {/* Label Balasan */}
            <div className="absolute -top-2 left-3 px-2 bg-blue-50 text-[10px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Balasan Admin
            </div>
            
            <p className="text-sm text-blue-900 font-medium pt-1 whitespace-pre-wrap leading-relaxed">
              {review.adminReply}
            </p>
            
            {/* Waktu Balasan */}
            {review.adminRepliedAt && (
              <p className="text-[10px] text-blue-400 mt-2 text-right">
                Dibalas pada: {new Date(review.adminRepliedAt).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
  
  // ==================================================
  // TAMPILAN 2: FALLBACK (Sudah review tapi data belum load)
  // ==================================================
  if (hasReviewed) {
     return (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-2 rounded-full shadow-sm">
        <span className="text-lg animate-bounce">✅</span>
        <span className="text-xs font-bold text-green-700 tracking-wide">Sudah Diulas</span>
      </div>
    )
  }

  // ==================================================
  // TAMPILAN 3: FORM ULASAN (Belum Review)
  // ==================================================
  const handleSubmit = async () => {
    setIsLoading(true)
    const res = await submitReviewAction(orderItemId, productId, rating, comment)
    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Terima kasih! Ulasan kamu sangat membantu 💖")
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Tombol Pemicu */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full border border-rose-200 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
      >
        <span>✨</span>
        <span>Tulis Ulasan</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in-fast">
          
          {/* Modal Content */}
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 relative overflow-hidden animate-scale-in">
            
            {/* Decorative Blurs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-60 z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-60 z-0"></div>

            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header */}
            <div className="relative z-10 text-center mb-8">
              <div className="text-5xl mb-3">💌</div>
              <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">Berikan Nilai</h3>
              <p className="text-sm text-gray-400 mt-1">Bagaimana kualitas <span className="font-bold text-gray-600">{productName}</span>?</p>
            </div>

            {/* Bintang Interaktif (SVG) */}
            <div className="flex justify-center gap-3 mb-6 relative z-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="relative focus:outline-none transition-transform duration-150 ease-out hover:scale-125"
                >
                  <svg 
                    className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-150 ${
                      star <= (hoverRating || rating) ? 'text-yellow-400 drop-shadow-md' : 'text-gray-200'
                    }`}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {star <= (hoverRating || rating) && (
                     <div className="absolute inset-0 bg-yellow-200 rounded-full blur-md opacity-50 animate-pulse -z-10"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Label Rating Dinamis */}
            <div className="text-center mb-6 h-7 relative z-10">
               {rating === 5 && <span className="text-sm font-bold text-green-500 animate-bounce-fast">🔥 Wah, Sempurna! (5/5)</span>}
               {rating === 4 && <span className="text-sm font-bold text-blue-500">👍 Bagus Sekali! (4/5)</span>}
               {rating === 3 && <span className="text-sm font-bold text-yellow-600">👌 Biasa Saja (3/5)</span>}
               {rating === 2 && <span className="text-sm font-bold text-orange-500">🤔 Kurang Puas (2/5)</span>}
               {rating === 1 && <span className="text-sm font-bold text-red-500">💔 Tidak Disarankan (1/5)</span>}
            </div>

            {/* Text Area */}
            <div className="relative z-10 mb-6">
              <textarea 
                rows={3} 
                placeholder="Tulis komentar kamu di sini... (Opsional)" 
                className="w-full p-4 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-rose-200 outline-none resize-none bg-gray-50 focus:bg-white transition-all shadow-inner text-gray-700 placeholder-gray-400"
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            {/* Tombol Submit */}
            <button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="relative z-10 w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-rose-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Kirim Ulasan Sekarang</span>
                </>
              )}
            </button>
          </div>

          {/* Global Styles for Animation */}
          <style jsx global>{`
            @keyframes fade-in-fast {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in-fast {
              animation: fade-in-fast 0.2s ease-out forwards;
            }
            
            @keyframes scale-in {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-scale-in {
              animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            @keyframes bounce-fast {
               0%, 100% { transform: translateY(0); }
               50% { transform: translateY(-5px); }
            }
            .animate-bounce-fast {
               animation: bounce-fast 1s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}
    </>
  )
}