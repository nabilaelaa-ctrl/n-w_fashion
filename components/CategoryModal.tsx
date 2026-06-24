"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CategoryModal({ isOpen, onClose, category }: { isOpen: boolean, onClose: () => void, category: any }) {
  const router = useRouter()
  
  // State untuk form
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Sinkronkan data saat mode Edit aktif
  useEffect(() => {
    if (category) {
      setName(category.name || '')
      setSlug(category.slug || '')
      setDescription(category.description || '')
    } else {
      // Reset form saat mode Tambah
      setName('')
      setSlug('')
      setDescription('')
    }
  }, [category])

  // Auto-generate slug dari nama
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!category) { // Hanya auto slug saat tambah baru
      setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = category 
        ? `/api/categories/${category.id}` // Endpoint Update
        : '/api/categories' // Endpoint Create

      const method = category ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description })
      })

      if (res.ok) {
        onClose()
        router.refresh() // Refresh data di halaman utama
      } else {
        const data = await res.json()
        alert(data.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{category ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
            <input 
              required 
              value={name}
              onChange={handleNameChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-rose-200 outline-none" placeholder="Contoh: Kemeja" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input 
              required 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-rose-200 outline-none lowercase" placeholder="kemeja" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-rose-200 outline-none resize-none" rows={3} placeholder="Opsional" 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold">Batal</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 disabled:opacity-50">
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}