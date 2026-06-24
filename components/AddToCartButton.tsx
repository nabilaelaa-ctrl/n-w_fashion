"use client"
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation' // Import useRouter untuk redirect
import toast from 'react-hot-toast'

export default function AddToCartButton({ product, fullWidth = false }: { product: any, fullWidth?: boolean }) {
  const router = useRouter() // Inisialisasi router
  const addToCart = useCartStore((state) => state.addToCart)
  
  // State untuk Pop-out Modal
  const[isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  // Pecah string "Hitam,Putih" menjadi array ['Hitam', 'Putih']
  // Tambahkan filter untuk menghapus string kosong yang bisa memicu error
  const colorList = product.colors 
    ? product.colors.split(',').map((c: string) => c.trim()).filter((c: string) => c !== '') 
    :[]
  const sizeList = product.sizes 
    ? product.sizes.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '') 
    :[]

  // Fungsi untuk membuka modal
  const handleOpenPopup = () => {
    if (product.stock <= 0) {
      toast.error("Stok habis!")
      return;
    }
    setIsOpen(true)
  }

  // Fungsi validasi & ambil gambar utama
  const processItem = () => {
    if (colorList.length > 0 && !selectedColor) {
      toast.error("Pilih warna terlebih dahulu!")
      return null;
    }
    if (sizeList.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu!")
      return null;
    }

    // Ambil gambar utama dengan aman
    let mainImage = null;
    try {
      if (product.images) {
        const imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        if (Array.isArray(imgs) && imgs.length > 0) mainImage = imgs[0];
      }
      if (!mainImage && product.image) mainImage = product.image;
    } catch(e) {}

    return {
      cartItemId: `${product.id}-${selectedColor}-${selectedSize}`,
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage || '',
      stock: product.stock,
      qty: 1,
      selected: true,
      color: selectedColor,
      size: selectedSize
    }
  }

  // Aksi 1: Tambah ke Keranjang (Saja)
  const handleAddToCart = () => {
    const item = processItem()
    if (!item) return

    addToCart(item)
    setIsOpen(false)
    setSelectedColor('')
    setSelectedSize('')
    toast.success(`${product.name} ditambahkan ke keranjang!`)
  }

  // Aksi 2: Beli Sekarang (Tambah + Redirect)
  const handleBuyNow = () => {
    const item = processItem()
    if (!item) return

    addToCart(item) // Simpan ke keranjang dulu
    setIsOpen(false)
    toast.success("Mengalihkan ke pembayaran...")
    router.push('/checkout') // Langsung ke checkout
  }

  return (
    <>
      {/* Tombol Pemicu Utama */}
      <button 
        onClick={handleOpenPopup}
        disabled={product.stock <= 0}
        className={`${fullWidth ? 'w-full py-3.5' : 'px-5 py-2.5'} rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          product.stock > 0 
            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg hover:shadow-rose-200/50 active:scale-95' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-dashed border-gray-200'
        }`}
      >
        {product.stock > 0 ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Beli
          </>
        ) : 'Habis'}
      </button>

      {/* POP-OUT MODAL DENGAN 2 TOMBOL */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)} 
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl p-6 sm:p-8 shadow-2xl transform transition-all duration-300"
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl bg-rose-50 border border-rose-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {/* Preview Gambar di Modal */}
                  {product.images ? (
                     <img src={typeof product.images === 'string' ? JSON.parse(product.images)[0] : product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : product.image ? (
                     <img src={product.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                     <svg className="w-8 h-8 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
                  <p className="text-rose-500 font-extrabold text-lg mt-1">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 rounded-full p-1.5 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Pilihan Warna */}
            {colorList.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Pilih Warna</p>
                <div className="flex flex-wrap gap-2">
                  {colorList.map((c: string, idx: number) => (
                    // PERBAIKAN: Menggunakan key unik berdasarkan index dan nilai string
                    <button key={`color-${idx}-${c}`} onClick={() => setSelectedColor(c.trim())}
                      className={`px-4 py-2 border-2 rounded-xl font-medium text-sm transition-all ${
                        selectedColor === c.trim() 
                          ? 'border-rose-500 bg-rose-50 text-rose-600' 
                          : 'border-gray-200 text-gray-600 hover:border-rose-200'
                      }`}
                    >
                      {c.trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pilihan Ukuran */}
            {sizeList.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">Pilih Ukuran</p>
                <div className="flex flex-wrap gap-2">
                  {sizeList.map((s: string, idx: number) => (
                    // PERBAIKAN: Menggunakan key unik berdasarkan index dan nilai string
                    <button key={`size-${idx}-${s}`} onClick={() => setSelectedSize(s.trim())}
                      className={`px-4 py-2 border-2 rounded-xl font-medium text-sm transition-all ${
                        selectedSize === s.trim() 
                          ? 'border-rose-500 bg-rose-50 text-rose-600' 
                          : 'border-gray-200 text-gray-600 hover:border-rose-200'
                      }`}
                    >
                      {s.trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BAGIAN TOMBOL Aksi (Dua Tombol) */}
            <div className="space-y-3">
              {/* Tombol Utama: Beli Sekarang */}
              <button 
                  onClick={handleBuyNow} 
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-rose-200 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Beli Sekarang
              </button>

              {/* Tombol Sekunder: Tambah Keranjang */}
              <button 
                  onClick={handleAddToCart} 
                  className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Tambah ke Keranjang
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}