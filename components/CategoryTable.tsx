"use client"
import { useState } from 'react'
import CategoryModal from '@/components/CategoryModal'

export default function CategoryTable({ initialCategories }: { initialCategories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Yakin ingin menghapus kategori ini?")) return
    
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      window.location.reload() // Refresh halaman
    } catch (err) {
      alert("Gagal menghapus")
    }
  }

  return (
    <>
      {/* Tombol Tambah & Table */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Daftar Kategori</h3>
          <button onClick={handleAdd} className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors">
            + Tambah Baru
          </button>
        </div>

        {initialCategories.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            Belum ada kategori.
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-5">Nama</th>
                <th className="p-5">Slug</th>
                <th className="p-5">Deskripsi</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 group">
                  <td className="p-5 font-semibold text-gray-800">{cat.name}</td>
                  <td className="p-5 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="p-5 text-gray-500 text-xs">{cat.description || '-'}</td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Tombol Edit */}
                      <button 
                        onClick={() => handleEdit(cat)} 
                        className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>

                      {/* Tombol Hapus */}
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={selectedCategory} 
      />
    </>
  )
}