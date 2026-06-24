"use client"
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// Tipe data alamat (sesuai yang dibuat di Profil)
type Address = { id: string; title: string; fullAddress: string; isDefault: boolean }

// Ikon SVG untuk UI
const Icons = {
  user: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  phone: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  map: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  bank: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  // Icon wallet dihapus karena tidak digunakan lagi
  cod: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  bag: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  card: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
}

export default function CheckoutPage() {
  const { items, removeSelectedFromCart } = useCartStore()
  const router = useRouter()
  
  const [receiverName, setReceiverName] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER_BANK')
  const[isSubmitting, setIsSubmitting] = useState(false)

  // STATE UNTUK ALAMAT
  const[savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  const selectedItems = items.filter(item => item.selected)
  const total = selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0)

  // MENGAMBIL DATA PROFIL & ALAMAT DARI DATABASE SAAT HALAMAN DIMUAT
  useEffect(() => {
    if (selectedItems.length === 0) {
      toast.error("Tidak ada produk yang dipilih.")
      router.replace('/cart')
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me')
        if (res.ok) {
          const user = await res.json()
          setReceiverName(user.name || '')
          // Set nomor telepon dari DB (jika Anda punya field phone, jika tidak biarkan kosong)
          setPhone(user.phone || '') 
          
          if (user.savedAddresses) {
            const parsed = typeof user.savedAddresses === 'string' ? JSON.parse(user.savedAddresses) : user.savedAddresses;
            setSavedAddresses(parsed)
            
            // Coba cari yang "Utama", jika tidak ada pilih yang urutan pertama
            const defaultAddr = parsed.find((a: Address) => a.isDefault)
            if (defaultAddr) setSelectedAddress(defaultAddr.fullAddress)
            else if (parsed.length > 0) setSelectedAddress(parsed[0].fullAddress)
          } else if (user.address) {
            // Fallback jika masih pakai format alamat teks lama
            setSelectedAddress(user.address)
            setSavedAddresses([{ id: '1', title: 'Utama', fullAddress: user.address, isDefault: true }])
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchUser()
  },[])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAddress) return toast.error("Silakan isi atau pilih alamat pengiriman!")
    
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Kirim 'selectedAddress' ke server
        body: JSON.stringify({ receiverName, address: selectedAddress, phone, items: selectedItems, total, paymentMethod })
      })

      if (res.ok) {
        const data = await res.json()
        toast.success("Pesanan berhasil dibuat!")
        removeSelectedFromCart()
        
        // LOGIKA BARU: Arahkan berdasarkan metode pembayaran
        if (paymentMethod === 'COD') {
          router.push('/success') 
        } else {
          router.push(`/payment/${data.orderId}`) // Arahkan ke halaman upload bukti
        }
      } else {
        const data = await res.json()
        toast.error(data.error || "Gagal melakukan checkout")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (selectedItems.length === 0) return null

  // Pilihan E-Wallet telah dihapus
  const paymentOptions =[
    { id: 'TRANSFER_BANK', label: 'Transfer Bank', desc: 'BCA, Mandiri, BNI', icon: Icons.bank },
    { id: 'COD', label: 'Bayar di Tempat', desc: 'Cash on Delivery', icon: Icons.cod },
  ]

  return (
    <div className="min-h-screen bg-rose-50/30 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Checkout</h1>
          <p className="text-gray-400 mt-2">Lengkapi data di bawah untuk melanjutkan pesanan</p>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* KOLOM KIRI: Form Pengiriman & Pembayaran */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card Informasi Penerima */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 border border-rose-100">
                  {Icons.user}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Informasi Penerima</h2>
                  <p className="text-xs text-gray-400">Pastikan data aktif & benar</p>
                </div>
              </div>

              <div className="space-y-5">
                
                {/* PILIH ALAMAT PENGIRIMAN */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Alamat Pengiriman</label>
                  <div className="relative border border-rose-200 bg-rose-50/30 p-4 rounded-2xl overflow-hidden transition-all hover:border-rose-300">
                    <span className="absolute left-4 top-4 text-rose-400">{Icons.map}</span>
                    <div className="pl-10 pr-20 min-h-[48px] flex items-center">
                      {selectedAddress ? (
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">{selectedAddress}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Silakan ketik atau pilih alamat Anda...</p>
                      )}
                    </div>
                    
                    {/* TOMBOL UBAH / PILIH ALAMAT */}
                    <button 
                      type="button" 
                      onClick={() => setIsAddressModalOpen(true)} 
                      className="absolute top-1/2 -translate-y-1/2 right-4 bg-white border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm"
                    >
                      Pilih
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2">{Icons.user}</span>
                    <input 
                      required type="text" placeholder="Masukkan nama lengkap" 
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none bg-gray-50/50 focus:bg-white transition-all text-sm font-semibold text-gray-700"
                      value={receiverName}
                      onChange={e => setReceiverName(e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Nomor HP / WhatsApp</label>
                   <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2">{Icons.phone}</span>
                    <input 
                      required type="text" placeholder="081234567890" 
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none bg-gray-50/50 focus:bg-white transition-all text-sm font-semibold text-gray-700"
                      value={phone}
                      onChange={e => setPhone(e.target.value)} 
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Card Metode Pembayaran */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 border border-purple-100">
                  {Icons.card}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Metode Pembayaran</h2>
                  <p className="text-xs text-gray-400">Pilih salah satu metode</p>
                </div>
              </div>

              <div className="space-y-3">
                {paymentOptions.map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-300 group ${
                      paymentMethod === method.id 
                        ? 'border-rose-500 bg-rose-50/80 shadow-sm' 
                        : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                      paymentMethod === method.id ? 'border-rose-500 bg-rose-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                       paymentMethod === method.id ? 'bg-rose-100 text-rose-500' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }`}>
                      {method.icon}
                    </div>

                    <div className="flex-1">
                      <span className="block text-sm font-bold text-gray-800">{method.label}</span>
                      <span className="block text-xs text-gray-400">{method.desc}</span>
                    </div>
                    
                    {paymentMethod === method.id && (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: Ringkasan Pesanan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-28">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 border border-blue-100">
                  {Icons.bag}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Ringkasan Pesanan</h2>
                  <p className="text-xs text-gray-400">{selectedItems.length} Produk dipilih</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {selectedItems.map(item => (
                  <div key={item.cartItemId} className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3 group hover:bg-gray-100 transition-colors border border-gray-50">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.image || ''} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                        {item.color} {item.size && `• ${item.size}`}
                      </p>
                      <p className="text-xs font-medium text-gray-600 mt-1">{item.qty}x Barang</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-600">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-6 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal Produk</span>
                  <span className="text-gray-800">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Ongkos Kirim</span>
                  <span className="text-green-600 font-bold uppercase">Gratis</span>
                </div>
                <div className="flex justify-between font-black text-xl border-t border-gray-100 pt-5 mt-2">
                  <span className="text-gray-800">Total Tagihan</span>
                  <span className="text-rose-500">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full mt-8 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-rose-300 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Memproses...
                  </>
                ) : (
                  <>{Icons.lock} Bayar Sekarang</>
                )}
              </button>
              
              <p className="text-center text-[10px] font-semibold text-gray-400 mt-4 tracking-widest uppercase">
                🔒 Data dilindungi enkripsi
              </p>

            </div>
          </div>

        </form>
      </div>

      {/* ======================================================== */}
      {/* MODAL POP-UP PILIH ALAMAT                                */}
      {/* ======================================================== */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Pilih Alamat Pengiriman</h2>
                <p className="text-sm text-gray-500">Pilih dari buku alamat Anda atau ketik manual.</p>
              </div>
              <button type="button" onClick={() => setIsAddressModalOpen(false)} className="w-10 h-10 bg-gray-100 hover:bg-rose-100 hover:text-rose-600 rounded-full flex items-center justify-center text-gray-500 font-bold transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              
              {/* DAFTAR BUKU ALAMAT */}
              <div className="space-y-3">
                {savedAddresses.map(addr => (
                  <div 
                    key={addr.id} 
                    onClick={() => { setSelectedAddress(addr.fullAddress); setIsAddressModalOpen(false); }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddress === addr.fullAddress 
                      ? 'border-rose-400 bg-rose-50/50 shadow-sm' 
                      : 'border-gray-100 hover:border-rose-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex gap-2 items-center">
                        <span className={`font-bold text-sm ${selectedAddress === addr.fullAddress ? 'text-rose-700' : 'text-gray-800'}`}>
                          {addr.title}
                        </span>
                        {addr.isDefault && <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Utama</span>}
                      </div>
                      
                      {/* Check Icon */}
                      {selectedAddress === addr.fullAddress && (
                        <div className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed pr-6">{addr.fullAddress}</p>
                  </div>
                ))}

                {savedAddresses.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 italic mb-2">Buku alamat Anda masih kosong.</p>
                    <button onClick={() => router.push('/profile')} className="text-xs font-bold text-rose-500 hover:underline">
                      Pergi ke Profil untuk menambah alamat
                    </button>
                  </div>
                )}
              </div>

              {/* ATAU KETIK MANUAL */}
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Atau ketik alamat 1x pakai:</p>
                <textarea 
                  rows={3} 
                  className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all resize-none" 
                  placeholder="Ketik alamat lengkap (Jalan, RT/RW, Kecamatan, Kota)..." 
                  onChange={(e) => setSelectedAddress(e.target.value)}
                ></textarea>
                <button 
                  onClick={() => setIsAddressModalOpen(false)} 
                  className="mt-3 w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-colors"
                >
                  Gunakan Alamat Ini Saja
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}