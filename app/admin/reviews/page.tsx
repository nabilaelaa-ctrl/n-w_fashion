// app/admin/reviews/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import ReplyActions from '@/components/ReplyActions' // Import komponen baru
import { deleteReview } from '@/app/actions/review' // Import action dari file terpisah

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      product: true,
      orderItem: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : '0.0'
  const fiveStars = reviews.filter(r => r.rating === 5).length

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* HEADER SECTION */}
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
            Ulasan Pelanggan 
            <span className="text-2xl animate-bounce">💌</span>
          </h1>
          <p className="text-gray-400 mt-1">Pantau umpan balik dan tingkat kepuasan pelanggan Anda.</p>
        </div>
        
        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-3xl border border-yellow-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 bg-white border border-yellow-100 text-yellow-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">✨</div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rata-rata Rating</p>
                <p className="text-3xl font-black text-gray-800">{averageRating} <span className="text-base font-medium text-gray-400">/ 5.0</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 bg-white border border-blue-100 text-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">💬</div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Ulasan</p>
                <p className="text-3xl font-black text-gray-800">{totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-3xl border border-green-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 bg-white border border-green-100 text-green-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">🔥</div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Review Sempurna (5⭐)</p>
                <p className="text-3xl font-black text-gray-800">{fiveStars}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DAFTAR ULASAN */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-20 px-4 bg-gradient-to-b from-white to-slate-50">
             <div className="text-6xl mb-4 opacity-50">📝</div>
             <h3 className="text-xl font-bold text-gray-700">Belum Ada Ulasan</h3>
             <p className="text-gray-500 mt-2">Pelanggan Anda belum memberikan ulasan satupun.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map(review => {
              let imageUrl = ''
              try {
                if ((review.product as any)?.images) {
                  const parsedImages = typeof (review.product as any).images === 'string' 
                    ? JSON.parse((review.product as any).images) 
                    : (review.product as any).images
                  if (Array.isArray(parsedImages) && parsedImages.length > 0) imageUrl = parsedImages[0]
                } else if ((review.product as any)?.image) {
                  imageUrl = (review.product as any).image
                }
              } catch (e) { console.error("Error parsing image", e) }

              const adminReply = (review as any).adminReply;
              const adminRepliedAt = (review as any).adminRepliedAt;

              return (
                <div key={review.id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-all duration-300 flex flex-col gap-6 group relative">
                  
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
                    {/* Info Pelanggan */}
                    <div className="w-full lg:w-56 flex-shrink-0 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate">{review.user?.name || 'Anonim'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{review.user?.email}</p>
                        <p className="text-[10px] text-gray-300 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Konten Utama */}
                    <div className="flex-grow min-w-0 border-l-0 lg:border-l border-gray-100 pl-0 lg:pl-6">
                      
                      {/* Rating */}
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-lg transition-transform duration-200 ${review.rating >= star ? 'opacity-100 scale-110' : 'opacity-30 grayscale'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      
                      {/* Komentar */}
                      {review.comment ? (
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                          "{review.comment}"
                        </p>
                      ) : (
                        <p className="text-gray-300 text-sm italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center">
                          Pelanggan ini hanya memberikan rating bintang tanpa komentar 😶
                        </p>
                      )}

                      {/* TAMPILAN BALASAN ADMIN */}
                      {adminReply && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl relative">
                          <div className="absolute -top-2 left-4 px-2 bg-blue-50 text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                            Balasan Anda
                          </div>
                          <p className="text-sm text-blue-900 pt-1 whitespace-pre-wrap">{adminReply}</p>
                          <p className="text-[10px] text-blue-400 mt-2 text-right">
                            Dibalas pada: {adminRepliedAt ? new Date(adminRepliedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                          </p>
                        </div>
                      )}

                      {/* Produk Terkait */}
                      <div className="mt-5 p-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 inline-flex shadow-sm hover:shadow-md transition-shadow">
                        {imageUrl ? (
                          <img src={imageUrl} alt={review.product?.name || 'Produk'} className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-gray-100" />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-gray-300 text-[10px]">No Img</div>
                        )}
                        <div className="min-w-0">
                          <Link href={`/product/${review.productId}`} target="_blank" className="text-sm font-bold text-gray-700 hover:text-rose-600 transition-colors truncate block">
                            {review.product?.name || 'Produk Telah Dihapus'}
                          </Link>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">{review.orderItem?.color || '-'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">{review.orderItem?.size || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Area Aksi Bawah */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-end items-end border-t border-dashed border-gray-100 pt-4 mt-2">
                    
                    {/* KOMPONEN AKSI (Client Component) */}
                    <ReplyActions reviewId={review.id} currentReply={adminReply} />

                    {/* Tombol Hapus */}
                    <div className="shrink-0">
                      <form action={deleteReview}>
                        <input type="hidden" name="reviewId" value={review.id} />
                        <DeleteButton 
                          message="Apakah Anda yakin ingin menghapus ulasan ini secara permanen?"
                          className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-2 border border-red-100 hover:border-red-500 shadow-sm hover:shadow-lg active:scale-95"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </DeleteButton>
                      </form>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}