"use client"
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// Komponen Ikon SVG
const Icons = {
  cart: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  minus: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  bag: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, toggleSelect, toggleSelectAll } = useCartStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) },[])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-rose-50/30 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-rose-300 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const selectedItems = items.filter(item => item.selected)
  const totalBarang = selectedItems.reduce((acc, item) => acc + item.qty, 0)
  const totalHarga = selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
  const isAllSelected = items.length > 0 && items.every(item => item.selected)

  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) {
      toast.error("Pilih minimal satu produk untuk di-checkout!")
      return;
    }
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-rose-50/30 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Keranjang Saya</h1>
          <p className="text-gray-400 mt-1">Review kembali item belanjaanmu sebelum checkout.</p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white p-16 text-center rounded-3xl shadow-sm border border-rose-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100">
              {Icons.cart}
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-400 mb-8 max-w-sm">Wah, keranjangmu masih kosong nih. Yuk cari produk favoritmu!</p>
            <Link href="/" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-95 flex items-center gap-2">
              <span>{Icons.bag}</span>
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Daftar Produk */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Pilih Semua */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between sticky top-20 z-10">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-700 group-hover:text-rose-500 transition-colors">
                    Pilih Semua ({items.length} Produk)
                  </span>
                </label>
                {selectedItems.length > 0 && (
                   <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                     {selectedItems.length} Dipilih
                   </span>
                )}
              </div>

              {/* List Item */}
              {items.map(item => (
                <div key={item.cartItemId} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-rose-100 transition-all flex gap-4 items-start sm:items-center relative group">
                  
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1 sm:pt-0">
                    <input 
                      type="checkbox" 
                      checked={item.selected}
                      onChange={() => toggleSelect(item.cartItemId)}
                      className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                    />
                  </div>

                  {/* Gambar */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">Img</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate hover:text-rose-500 transition-colors">{item.name}</h3>
                      
                      {/* Varian Badge */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                         {item.color && (
                           <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                             {item.color}
                           </span>
                         )}
                         {item.size && (
                           <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                             {item.size}
                           </span>
                         )}
                      </div>

                      <p className="text-rose-500 font-extrabold text-lg mt-2">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Kontrol Kanan */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                      
                      {/* Quantity Control */}
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.qty - 1)} 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                        >
                          {Icons.minus}
                        </button>
                        <span className="w-8 text-center font-bold text-gray-800 text-sm">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.qty + 1)} 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                        >
                          {Icons.plus}
                        </button>
                      </div>

                      {/* Hapus */}
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)} 
                        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors"
                        title="Hapus"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Belanja */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  {Icons.bag}
                  Ringkasan Belanja
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Harga Item</span>
                    <span className="font-medium text-gray-700">Rp {totalHarga.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Jumlah Item</span>
                    <span className="font-medium text-gray-700">{totalBarang} Pcs</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-600 font-semibold">Total Tagihan</span>
                    <span className="text-2xl font-extrabold text-rose-500">Rp {totalHarga.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckoutClick} 
                  disabled={selectedItems.length === 0}
                  className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                    selectedItems.length > 0 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-xl hover:shadow-rose-200 active:scale-[0.98]' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedItems.length > 0 ? (
                    <>
                      Checkout Sekarang
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  ) : "Pilih Item Dulu"}
                </button>
                
                <Link href="/" className="block text-center mt-4 text-sm font-medium text-gray-500 hover:text-rose-500 transition-colors">
                  + Tambah Produk Lain
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}