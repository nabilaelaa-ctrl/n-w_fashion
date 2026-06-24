"use client"
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// Ikon Komponen
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>

export default function CategoryClient({ 
  initialCategories = [], 
  saveAction, 
  deleteAction 
}: { 
  initialCategories?: any[], 
  saveAction: (formData: FormData) => void, 
  deleteAction: (formData: FormData) => void 
}) {
  const [editId, setEditId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Ambil data yang diedit
  const editingCategory = initialCategories.find(c => c.id === editId)

  // Fungsi buka modal
  const handleEdit = (id: string) => {
    setEditId(id)
    setIsModalOpen(true)
  }

  // Fungsi tutup modal
  const handleClose = () => {
    setIsModalOpen(false)
    // Delay reset ID agar animasi selesai
    setTimeout(() => setEditId(null), 300)
  }

  return (
    <>
      {/* Form Tambah (Tetap di atas) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Tambah Kategori Baru</h3>
        <form action={saveAction} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Nama</label>
            <input required name="name" placeholder="Contoh: Kemeja" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Slug</label>
            <input required name="slug" placeholder="kemeja" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 outline-none lowercase" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Deskripsi</label>
            <input name="description" placeholder="Opsional" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 outline-none" />
          </div>
          <button type="submit" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2">
            <AddIcon /> Simpan
          </button>
        </form>
      </div>

      {/* Daftar Kategori */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Daftar Kategori</h3>
        </div>
        
        {initialCategories.length === 0 ? (
          <div className="p-16 text-center text-gray-400">Belum ada kategori.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-5">Nama Kategori</th>
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
                  <td className="p-5 text-gray-500 text-xs max-w-xs truncate">{cat.description || '-'}</td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(cat.id)} 
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>

                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={cat.id} />
                        <button type="submit" className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm" title="Hapus">
                          <DeleteIcon />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL POP-UP EDIT --- */}
      {isModalOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={handleClose} 
          />

          {/* Modal Content */}
          <div 
            className={`relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isModalOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
          >
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Edit Kategori</h2>
                <p className="text-xs text-gray-500 mt-0.5">Perbarui detail kategori di bawah ini.</p>
              </div>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-white text-gray-400 hover:text-gray-800 transition-colors">
                <CloseIcon />
              </button>
            </div>

            {/* Form Edit */}
            {/* Gunakan key untuk memaksa reset form saat data berubah */}
            <form action={saveAction} key={editId || 'new'} className="p-6 space-y-5">
              <input type="hidden" name="id" value={editingCategory?.id} />
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Kategori</label>
                <input 
                  required 
                  name="name" 
                  defaultValue={editingCategory?.name} 
                  className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all"
                  placeholder="Nama tampilan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Slug (URL)</label>
                <input 
                  required 
                  name="slug" 
                  defaultValue={editingCategory?.slug} 
                  className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all lowercase"
                  placeholder="url-unik"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Deskripsi</label>
                <textarea 
                  name="description" 
                  rows={3} 
                  defaultValue={editingCategory?.description || ''} 
                  className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all resize-none"
                  placeholder="Deskripsi singkat (opsional)"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={handleClose}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <SaveIcon />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}