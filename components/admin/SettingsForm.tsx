'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type ConfigData = {
  bankName: string | null
  bankAccount: string | null
  bankHolder: string | null
  // Properti E-Wallet dihapus dari tipe data
}

export default function SettingsForm({ initialData }: { initialData: ConfigData }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // State untuk menyimpan nilai input sementara (controlled input)
  const [form, setForm] = useState({
    bankName: initialData.bankName || '',
    bankAccount: initialData.bankAccount || '',
    bankHolder: initialData.bankHolder || '',
    // State E-Wallet dihapus
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Pengaturan berhasil disimpan! ✅', {
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px'
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          }
        })
        // Refresh data di server
        router.refresh()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan! ❌', {
        style: {
          background: '#FF4B4B',
          color: '#fff',
          borderRadius: '12px'
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        
      {/* Kartu Pengaturan Bank */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl">🏦</div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Rekening Bank Transfer</h2>
            <p className="text-xs text-gray-400">Untuk metode pembayaran Transfer Bank</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Nama Bank</label>
            <input 
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Contoh: BCA" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all bg-gray-50 focus:bg-white" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Nama Pemilik</label>
            <input 
              name="bankHolder"
              value={form.bankHolder}
              onChange={handleChange}
              placeholder="Contoh: PT N&W Fashion" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all bg-gray-50 focus:bg-white" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Nomor Rekening</label>
            <input 
              name="bankAccount"
              value={form.bankAccount}
              onChange={handleChange}
              placeholder="Contoh: 1234567890" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all bg-gray-50 focus:bg-white tracking-widest font-mono" 
            />
          </div>
        </div>
      </div>

      {/* Kartu E-Wallet telah dihapus sepenuhnya */}

      {/* Tombol Simpan */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-300/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
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
            <span>💾</span>
            <span>Simpan Perubahan</span>
          </>
        )}
      </button>

    </form>
  )
}