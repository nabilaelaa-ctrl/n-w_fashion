'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type BankAccount = {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  type: string
}

export default function BankAccountManager() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  
  const [form, setForm] = useState({ 
    id: '', 
    bankName: '', 
    accountName: '', 
    accountNumber: '', 
    type: 'BANK' // Default diubah menjadi 'BANK' secara permanen
  })
  
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsFetching(true)
    try {
      const res = await fetch('/api/admin/bank-accounts')
      const data = await res.json()
      // Filter data agar hanya menampilkan tipe BANK (menyembunyikan E-Wallet yang sudah ada)
      const bankOnly = data.filter((acc: BankAccount) => acc.type === 'BANK')
      setAccounts(bankOnly)
    } catch (err) {
      toast.error("Gagal memuat data rekening")
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({ id: '', bankName: '', accountName: '', accountNumber: '', type: 'BANK' })
    setIsEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = isEditing 
        ? `/api/admin/bank-accounts/${form.id}` 
        : '/api/admin/bank-accounts'
      
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(isEditing ? "Berhasil diupdate! ✅" : "Berhasil ditambahkan! ✅")
        resetForm()
        fetchData()
        router.refresh()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      toast.error("Terjadi kesalahan ❌")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (acc: BankAccount) => {
    setForm(acc)
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus rekening ini?")) return

    try {
      const res = await fetch(`/api/admin/bank-accounts/${id}`, { method: 'DELETE' })
      if(res.ok) {
        toast.success("Berhasil dihapus! 🗑️")
        fetchData()
        router.refresh()
      } else {
        throw new Error('Gagal hapus')
      }
    } catch (err) {
      toast.error("Gagal menghapus")
    }
  }

  return (
    <div className="space-y-8">
        
      {/* FORM INPUT - Pinky Soft Theme */}
      <div className="relative">
        {/* Decorative Blurs */}
        <div className="absolute -top-4 -right-4 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50 z-0"></div>
        <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-50 z-0"></div>
        
        <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-rose-100 shadow-xl shadow-rose-100/50">
          <div className="flex items-center gap-3 mb-6 border-b border-rose-50 pb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${isEditing ? 'bg-yellow-50 text-yellow-500' : 'bg-green-50 text-green-500'}`}>
              {isEditing ? '✏️' : '➕'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Rekening' : 'Tambah Rekening Baru'}
              </h2>
              <p className="text-sm text-gray-400">
                {isEditing ? 'Perbarui detail di bawah ini' : 'Masukkan informasi rekening bank aktif'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nama Bank - Input Tipe dihapus manual karena sudah fix 'BANK' */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Nama Bank</label>
                <input 
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="Contoh: BCA, Mandiri, BRI"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-rose-300 text-gray-700 placeholder-gray-300 focus:ring-4 focus:ring-rose-100 outline-none transition-all" 
                  required
                />
              </div>

              {/* Nomor Rekening */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Nomor Rekening</label>
                <input 
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="Contoh: 123456789"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-rose-300 text-gray-700 placeholder-gray-300 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-mono tracking-wider" 
                  required
                />
              </div>
            </div>

            {/* Nama Pemilik */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Nama Pemilik</label>
              <input 
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
                placeholder="Contoh: PT N&W Fashion"
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-rose-300 text-gray-700 placeholder-gray-300 focus:ring-4 focus:ring-rose-100 outline-none transition-all" 
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3.5 rounded-xl hover:shadow-xl hover:shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                   <span className="flex items-center gap-2">
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Menyimpan...
                   </span>
                ) : (isEditing ? "Update Data" : "Simpan Baru")}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-6 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 font-bold transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* DAFTAR REKENING - Modern Card List */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-rose-50 bg-gradient-to-r from-white to-rose-50/50 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold text-gray-800">Rekening Bank Aktif</h2>
             <p className="text-xs text-gray-400">Daftar rekening bank yang ditampilkan di halaman pembayaran.</p>
          </div>
          <span className="bg-rose-100 text-rose-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm">{accounts.length} Data</span>
        </div>

        {isFetching ? (
           <div className="p-10 text-center text-gray-400 animate-pulse">Memuat data...</div>
        ) : accounts.length === 0 ? (
          <div className="p-10 text-center text-gray-400 bg-rose-50/30">
            <span className="text-5xl mb-3 block">📭</span>
            <p className="font-medium">Belum ada rekening bank tersimpan.</p>
            <p className="text-xs mt-1">Tambahkan rekening baru menggunakan form di atas.</p>
          </div>
        ) : (
          <div className="divide-y divide-rose-50 bg-white">
            {accounts.map((acc) => (
              // Data E-Wallet sudah di-filter di fetchData, jadi ini hanya render Bank
              <div key={acc.id} className="p-6 flex items-center justify-between hover:bg-rose-50/30 transition-colors group relative overflow-hidden">
                
                {/* Hover Indicator Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>

                <div className="flex items-center gap-5 pl-2">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border bg-blue-50 border-blue-100 text-blue-500`}>
                    🏦
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800 text-lg">{acc.bankName}</span>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-50 text-blue-600`}>
                        BANK
                      </span>
                    </div>
                    <p className="text-xl font-mono font-bold text-gray-900 tracking-wide">{acc.accountNumber}</p>
                    <p className="text-xs text-gray-400 mt-1">a.n <span className="text-gray-600 font-medium">{acc.accountName || '-'}</span></p>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <button onClick={() => handleEdit(acc)} className="p-3 rounded-xl bg-white border border-gray-100 hover:bg-rose-50 hover:text-rose-500 text-gray-400 transition-colors shadow-sm" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(acc.id)} className="p-3 rounded-xl bg-white border border-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors shadow-sm" title="Hapus">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}