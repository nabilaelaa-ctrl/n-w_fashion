"use client"
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

// Komponen Tombol Submit
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Menyimpan...
        </>
      ) : "Simpan Perubahan Profil"}
    </button>
  )
}

export default function ProfileForm({ user, action }: { user: any, action: (formData: FormData) => void }) {
  const [preview, setPreview] = useState(user.image)
  const [removeImage, setRemoveImage] = useState(false) // State untuk tracking penghapusan

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setRemoveImage(false) // Jika ada file baru, batalkan flag hapus
      }
      reader.readAsDataURL(file)
    }
  }

  // Fungsi untuk menandai penghapusan foto
  const handleRemoveImage = () => {
    setPreview(null)
    setRemoveImage(true)
  }

  // Fungsi untuk membatalkan penghapusan (reset ke semula)
  const handleCancelRemove = () => {
    setPreview(user.image)
    setRemoveImage(false)
  }

  return (
    <form action={action} className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      
      {/* KOLOM KIRI: Foto Profil */}
      <div className="md:col-span-1 flex flex-col items-center text-center space-y-4">
        <div className="relative w-40 h-40 rounded-full bg-gray-50 border-4 border-white shadow-lg overflow-hidden group">
          {preview && !removeImage ? (
            <img src={preview} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-rose-100 text-rose-500 text-5xl font-bold uppercase">
              {user.name?.charAt(0) || 'U'}
            </div>
          )}
          
          {/* Overlay Hover - Hanya tampil jika tidak sedang mode hapus */}
          {!removeImage && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white text-xs font-bold">Ganti Foto</span>
            </div>
          )}
          
          {/* Input file tersembunyi - disabled jika removeImage true */}
          {!removeImage && (
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              title="Klik untuk ganti foto" 
            />
          )}
        </div>
        
        {/* Input Tersembunyi untuk mengirim sinyal hapus ke server */}
        {/* Jika removeImage true, kirim 'true'. Jika tidak, jangan kirim apa-apa. */}
        <input type="hidden" name="removeImage" value={removeImage ? "true" : ""} />

        {/* Kontrol Tombol Hapus/Batal */}
        <div className="flex flex-col gap-2 w-full px-4">
          {removeImage ? (
            <>
              <p className="text-xs text-red-500 font-medium">Foto akan dihapus saat disimpan.</p>
              <button 
                type="button" 
                onClick={handleCancelRemove}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Batalkan Hapus
              </button>
            </>
          ) : (
            // Tampilkan tombol hapus hanya jika ada foto awal
            user.image && (
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="text-xs text-red-500 hover:text-red-700 font-semibold hover:underline"
              >
                Hapus Foto Profil
              </button>
            )
          )}
        </div>

        <div className="pt-4">
          <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            Member {user.role}
          </span>
        </div>
      </div>

      {/* KOLOM KANAN: Form Input */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Bagian Data Diri */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Informasi Pribadi</h4>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Nama Lengkap</label>
            <input 
              required 
              type="text" 
              name="name" 
              defaultValue={user.name} 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50 focus:bg-white transition-all text-sm" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email (Tidak bisa diubah)</label>
            <input 
              type="email" 
              defaultValue={user.email} 
              disabled 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-gray-100 text-gray-400 cursor-not-allowed text-sm" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Alamat Pengiriman Default</label>
            <textarea 
              name="address" 
              defaultValue={user.address || ''} 
              placeholder="Masukkan alamat lengkap..." 
              rows={3} 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50 focus:bg-white transition-all text-sm resize-none" 
            />
          </div>
        </div>

        {/* Bagian Keamanan */}
        <div className="space-y-4 pt-4">
          <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Keamanan Akun</h4>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Password Baru</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              minLength={6} 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50 focus:bg-white transition-all text-sm" 
            />
            <p className="text-[11px] text-gray-400 mt-1.5">*Kosongkan jika tidak ingin mengganti password.</p>
          </div>
        </div>

        <div className="pt-6">
          <SubmitButton />
        </div>

      </div>
    </form>
  )
}