import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import ReviewButton from '@/components/ReviewButton'

// Komponen Ikon SVG
const Icons = {
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  box: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  truck: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  shoppingBag: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) redirect('/login')

  let userId = ''
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    userId = payload.id as string
  } catch (error) {
    redirect('/login')
  }

  // AMBIL DATA PESANAN
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { 
      orderItems: { 
        include: { 
          product: true,
          reviews: true 
        } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  })

  async function completeOrder(formData: FormData) {
    "use server"
    const orderId = formData.get('orderId') as string
    await prisma.order.update({ where: { id: orderId }, data: { status: 'SELESAI' } })
    revalidatePath('/orders') 
  }

  const TRACKING_STEPS = [
    { key: 'MENUNGGAU', label: 'Menunggu', icon: Icons.clock },
    { key: 'DIPROSES', label: 'Dikemas', icon: Icons.box },
    { key: 'DIKIRIM', label: 'Dikirim', icon: Icons.truck },
    { key: 'SELESAI', label: 'Selesai', icon: Icons.check }
  ]

  const getStepIndex = (status: string) => TRACKING_STEPS.findIndex(s => s.key === status)

  return (
    <div className="min-h-screen bg-rose-50/30 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Pesanan Saya</h1>
          <p className="text-gray-400 mt-1">Pantau status pengiriman pesananmu di sini.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl shadow-sm border border-rose-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100">
              {Icons.shoppingBag}
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Pesanan</h2>
            <p className="text-gray-400 mb-8 max-w-sm">Sepi di sini... Ayo mulai belanja produk fashion terbaik kami!</p>
            <Link href="/" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-95">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => {
              const currentStepIdx = getStepIndex(order.status)
              const progressWidth = `${(currentStepIdx / (TRACKING_STEPS.length - 1)) * 100}%`
              
              return (
                <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  
                  {/* Header Kartu */}
                  <div className="bg-rose-50/50 px-6 py-4 border-b border-rose-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg border border-rose-100 shadow-xs text-rose-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="font-mono font-bold text-gray-800 tracking-wide">#{order.id.split('-')[0].toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1 w-full sm:w-auto">
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-lg font-extrabold text-rose-500">
                        Rp {order.total.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Status */}
                  <div className="px-6 py-8 border-b border-gray-50 bg-white">
                    <div className="relative max-w-xl mx-auto">
                      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 rounded-full"></div>
                      <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-1000 ease-in-out" style={{ width: progressWidth }}></div>
                      
                      <div className="relative flex justify-between">
                        {TRACKING_STEPS.map((step, idx) => {
                          const isActive = currentStepIdx >= idx
                          return (
                            <div key={step.key} className="flex flex-col items-center w-1/4 pt-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 transform ${isActive ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200 scale-110' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>
                                {step.icon}
                              </div>
                              <span className={`text-[10px] sm:text-xs font-bold mt-3 transition-colors duration-300 text-center ${isActive ? 'text-rose-600' : 'text-gray-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Daftar Item & Ulasan */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.orderItems.map(item => {
                        
                        // --- PERBAIKAN LOGIKA GAMBAR ---
                        let imageUrl = '';
                        const rawImages = item.product.images;

                        if (rawImages) {
                          // 1. Cek jika Prisma mengembalikan Array (tipe Json)
                          if (Array.isArray(rawImages)) {
                            imageUrl = rawImages[0] || '';
                          } 
                          // 2. Cek jika berbentuk String JSON
                          else if (typeof rawImages === 'string') {
                            try {
                              const parsed = JSON.parse(rawImages);
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                imageUrl = parsed[0];
                              }
                            } catch (e) {
                              // Jika gagal parse, mungkin string biasa
                              imageUrl = rawImages; 
                            }
                          }
                        }
                        // --------------------------------

                        const isReviewed = item.reviews && item.reviews.length > 0;

                        return (
                          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-50 group hover:bg-white hover:shadow-sm transition-all">
                            
                            <div className="flex gap-4 items-center flex-grow min-w-0">
                              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
                                {imageUrl ? (
                                  <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm truncate">{item.product.name}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {item.color && <span>{item.color}</span>}
                                  {item.color && item.size && <span> • </span>}
                                  {item.size && <span>{item.size}</span>}
                                </p>
                                <p className="text-xs font-bold text-gray-500 mt-1">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                              <div className="font-black text-rose-500 text-sm">
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                              </div>
                              
                              {order.status === 'SELESAI' && (
                                <ReviewButton 
                                  orderItemId={item.id} 
                                  productId={item.productId} 
                                  productName={item.product.name} 
                                  hasReviewed={isReviewed}
                                />
                              )}
                            </div>
                            
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="font-medium">Metode:</span> 
                        <span className="bg-white px-3 py-1 rounded-lg border text-xs font-bold text-gray-600 shadow-xs">
                          {order.paymentMethod === 'TRANSFER_BANK' ? 'Transfer Bank' : order.paymentMethod === 'E_WALLET' ? 'E-Wallet' : 'COD'}
                        </span>
                      </div>
                      <div className="w-full sm:w-auto">
                        {order.status === 'DIKIRIM' ? (
                          <form action={completeOrder}>
                            <input type="hidden" name="orderId" value={order.id} />
                            <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse hover:animate-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              Pesanan Diterima
                            </button>
                          </form>
                        ) : order.status === 'SELESAI' ? (
                          <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Transaksi Selesai
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic text-center sm:text-right block pt-2 sm:pt-0">Menunggu konfirmasi Admin...</span>
                        )}
                      </div>
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