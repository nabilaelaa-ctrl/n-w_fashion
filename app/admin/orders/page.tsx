import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

// Komponen Ikon SVG
const Icons = {
  menunggu: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  diproses: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  dikirim: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  selesai: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  receipt: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

// Helper untuk style status
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'MENUNGGU': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'DIPROSES': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'DIKIRIM': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'SELESAI': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  // SERVER ACTION: Update Status Pesanan
  async function updateOrderStatus(formData: FormData) {
    "use server"
    const id = formData.get('orderId') as string
    const status = formData.get('status') as any
    await prisma.order.update({ where: { id }, data: { status } })
    revalidatePath('/admin/orders') 
  }

  // Hitung Statistik Pesanan
  const stats = {
    menunggu: orders.filter(o => o.status === 'MENUNGGU').length,
    diproses: orders.filter(o => o.status === 'DIPROSES').length,
    dikirim: orders.filter(o => o.status === 'DIKIRIM').length,
    selesai: orders.filter(o => o.status === 'SELESAI').length,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* HEADER & STATISTIK */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Daftar Pesanan</h1>
            <p className="text-gray-400 mt-1">Pantau status pengiriman pesanan pelanggan.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menunggu</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.menunggu}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                {Icons.menunggu}
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Diproses</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.diproses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                {Icons.diproses}
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dikirim</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.dikirim}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                {Icons.dikirim}
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Selesai</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.selesai}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                {Icons.selesai}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DAFTAR PESANAN */}
      <div className="space-y-5">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            
            {/* Header Kartu Pesanan */}
            <div className="bg-rose-50/50 px-6 py-4 border-b border-rose-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 rounded-t-3xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider shadow-sm shadow-rose-200">
                  #{order.id.split('-')[0].toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              {/* Info Waktu & Metode */}
              <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                
                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100 font-medium text-gray-700">
                  {order.paymentMethod === 'TRANSFER_BANK' ? '💳 Transfer Bank' : order.paymentMethod === 'E_WALLET' ? '📱 E-Wallet' : '💵 COD'}
                </span>

                {/* Tombol Bukti Pembayaran */}
                {order.paymentProof && (
                  <a 
                    href={order.paymentProof} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-md font-bold hover:bg-green-200 hover:scale-105 transition-all shadow-sm"
                    title="Klik untuk melihat struk"
                  >
                    {Icons.receipt}
                    Cek Bukti
                  </a>
                )}
              </div>
            </div>

            {/* Body Kartu Pesanan */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-start">
              
              {/* Kolom 1: Info Pelanggan */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 text-rose-600 font-bold text-lg border border-rose-200">
                  {order.receiverName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-lg">{order.receiverName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {order.phone}
                  </p>
                  <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                    <span className="font-semibold block mb-1 text-gray-400 uppercase tracking-wide">Alamat:</span>
                    {order.address}
                  </div>
                </div>
              </div>

              {/* Kolom 2: Rincian Produk */}
              <div className="lg:border-l lg:border-r lg:border-gray-100 lg:px-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                  Pesanan <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{order.orderItems.length} Item</span>
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
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
                    // Fallback jika field 'images' kosong tapi ada field lama 'image'
                    if (!imageUrl && (item.product as any).image) {
                      imageUrl = (item.product as any).image;
                    }
                    // --------------------------------

                    return (
                      <div key={item.id} className="flex items-center gap-3 group/item">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 relative">
                          {imageUrl ? (
                            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate">{item.product.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {item.color && <span>{item.color}</span>}
                            {item.color && item.size && <span> • </span>}
                            {item.size && <span>{item.size}</span>}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-600">x{item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Kolom 3: Total & Aksi */}
              <div className="flex flex-col h-full">
                
                {/* Bagian Total */}
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Total Tagihan
                  </span>
                  <p className="text-3xl font-extrabold text-rose-500 mt-1">
                    Rp {order.total.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Form Update Status */}
                <form
                  action={updateOrderStatus}
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-auto"
                >
                  <input type="hidden" name="orderId" value={order.id} />

                  <label className="block text-xs font-semibold text-gray-500 mb-2">
                    Update Status
                  </label>

                  <div className="flex flex-col gap-3">
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="w-full border-gray-200 bg-white p-2.5 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all cursor-pointer"
                    >
                      <option value="MENUNGGU">⏳ Menunggu Pembayaran</option>
                      <option value="DIPROSES">📦 Sedang Diproses</option>
                      <option value="DIKIRIM">🚚 Sedang Dikirim</option>
                      <option value="SELESAI">✅ Selesai</option>
                    </select>

                    <button
                      type="submit"
                      className="w-full bg-rose-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-rose-600 active:scale-95 transition-all shadow-sm shadow-rose-200 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Status
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-white p-20 rounded-3xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-400">Pesanan baru akan muncul di sini setelah pelanggan melakukan checkout.</p>
          </div>
        )}
      </div>
    </div>
  )
}