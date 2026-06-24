"use client"
import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

// Tipe Data Alamat
type Address = { id: string; title: string; fullAddress: string; isDefault: boolean }

// Ikon SVG
const Icons = {
  edit: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>,
  mapPin: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
  shield: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
  mail: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
  save: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
  plus: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  trash: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
}

function SubmitButton({ label, icon }: { label: string, icon?: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group overflow-hidden relative"
    >
      <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
      <span className="relative z-10 flex items-center gap-2">
        {pending ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : icon}
        {pending ? "Memproses..." : label}
      </span>
    </button>
  )
}

export default function ProfileClient({ user, updateAction }: { user: any, updateAction: (formData: FormData) => Promise<void> }) {
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  
  // State untuk gambar
  const [preview, setPreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false) // State baru untuk hapus foto
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAddressText, setEditAddressText] = useState('')

  useEffect(() => {
    if (user?.savedAddresses) {
      try {
        setAddresses(typeof user.savedAddresses === 'string' ? JSON.parse(user.savedAddresses) : user.savedAddresses)
      } catch (e) {}
    } else if (user?.address) {
      setAddresses([{ id: '1', title: 'Utama', fullAddress: user.address, isDefault: true }])
    }
  }, [user])

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium animate-pulse">Menyiapkan profil Anda...</p>
    </div>
  )

  const initials = user.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'NA'

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setRemoveImage(false) // Jika upload baru, batalkan flag hapus
      }
      reader.readAsDataURL(file)
    }
  }

  // Fungsi baru: Handler tombol hapus
  const handleRemoveImage = () => {
    setPreview(null)
    setRemoveImage(true)
  }

  // Fungsi baru: Handler batalkan hapus
  const handleCancelRemove = () => {
    setPreview(user.image)
    setRemoveImage(false)
  }

  const addAddress = () => {
    if(!newTitle.trim() || !newAddress.trim()) return;
    const newAddr: Address = {
      id: Date.now().toString(),
      title: newTitle,
      fullAddress: newAddress,
      isDefault: addresses.length === 0 
    }
    setAddresses([newAddr, ...addresses]) 
    setNewTitle('')
    setNewAddress('')
  }

  const removeAddress = (id: string) => setAddresses(addresses.filter(a => a.id !== id))
  const setAsDefault = (id: string) => setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })))
  
  const startEditing = (addr: Address) => {
    setEditingAddressId(addr.id)
    setEditTitle(addr.title)
    setEditAddressText(addr.fullAddress)
  }

  const saveEditedAddress = () => {
    if(!editTitle.trim() || !editAddressText.trim()) return;
    setAddresses(addresses.map(a => a.id === editingAddressId ? { ...a, title: editTitle, fullAddress: editAddressText } : a))
    setEditingAddressId(null)
  }

  const handleProfileSubmit = async (formData: FormData) => {
    await updateAction(formData) 
    setIsProfileModalOpen(false) 
  }

  const handleAddressSubmit = async (formData: FormData) => {
    formData.append('name', user.name)
    formData.append('savedAddresses', JSON.stringify(addresses))
    await updateAction(formData) 
    setIsAddressModalOpen(false) 
  }

  const sortedAddresses = [...addresses].sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* HERO PROFIL */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100">
        <div className="absolute inset-0 h-48 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 opacity-90"></div>

        <div className="relative pt-32 pb-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
          
          <div className="relative group">
            <div className="w-36 h-36 rounded-full p-1.5 bg-white/30 backdrop-blur-sm shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-rose-50 flex items-center justify-center">
                 {user.image ? (
                   <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-5xl font-black text-rose-300 tracking-tighter">{initials}</span>
                 )}
              </div>
            </div>
            <button onClick={() => { setPreview(null); setRemoveImage(false); setIsProfileModalOpen(true); }} className="absolute bottom-2 right-2 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:scale-110 transition-all duration-300">
              {Icons.edit}
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-3 border border-white/30 shadow-sm">
              {Icons.shield} Member {user.role}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">{user.name}</h1>
            <p className="text-gray-500 font-medium mt-1 flex items-center justify-center sm:justify-start gap-2">
              {Icons.mail} {user.email}
            </p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
             <button onClick={() => { setPreview(null); setRemoveImage(false); setIsProfileModalOpen(true); }} className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:border-rose-300 hover:text-rose-600 transition-all shadow-sm flex items-center justify-center gap-2">
               Pengaturan Akun
             </button>
          </div>

        </div>
      </div>

      {/* BUKU ALAMAT */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              <span className="p-2 bg-rose-100 text-rose-600 rounded-xl">{Icons.mapPin}</span>
              Buku Alamat
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Kelola lokasi pengiriman paket Anda. Alamat <span className="font-bold text-rose-500">UTAMA</span> akan otomatis terpilih saat checkout.</p>
          </div>
          <button onClick={() => setIsAddressModalOpen(true)} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-rose-500 transition-all shadow-lg hover:shadow-rose-500/30 flex items-center justify-center gap-2 group">
            <span className="group-hover:rotate-90 transition-transform duration-300">{Icons.plus}</span> Kelola Alamat
          </button>
        </div>

        {sortedAddresses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {sortedAddresses.map((addr) => (
              <div key={addr.id} className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col h-full ${addr.isDefault ? 'border-rose-400 bg-gradient-to-br from-rose-50/50 to-white shadow-md shadow-rose-100/50 scale-[1.02]' : 'border-gray-100 bg-gray-50/30 hover:border-gray-300 hover:bg-white'}`}>
                {addr.isDefault && (
                  <div className="absolute -top-3.5 -right-3.5 bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white transform rotate-3">
                    ALAMAT UTAMA
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${addr.isDefault ? 'bg-rose-100 text-rose-500' : 'bg-gray-200 text-gray-500'}`}>
                    {Icons.mapPin}
                  </div>
                  <h3 className={`font-bold text-lg ${addr.isDefault ? 'text-rose-900' : 'text-gray-700'}`}>{addr.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                  {addr.fullAddress}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm mb-4">
              {Icons.mapPin}
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">Belum Ada Alamat</h3>
            <p className="text-gray-500 text-center max-w-md text-sm mb-6">Anda belum mendaftarkan alamat satupun.</p>
            <button onClick={() => setIsAddressModalOpen(true)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-800 rounded-xl font-bold shadow-sm hover:border-gray-300 transition-all">
              Tambah Alamat Sekarang
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: PENGATURAN AKUN (DENGAN HAPUS FOTO) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsProfileModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-24 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-start p-6">
               <h2 className="text-xl font-extrabold text-white">Pengaturan Akun</h2>
               <button type="button" onClick={() => setIsProfileModalOpen(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors">✕</button>
            </div>
            <form action={handleProfileSubmit} className="px-8 pb-8 pt-4 -mt-6">
              
              {/* Input Hidden untuk sinyal hapus */}
              <input type="hidden" name="removeImage" value={removeImage ? "true" : ""} />

              <div className="flex flex-col justify-center items-center mb-8 relative z-10">
                <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden group cursor-pointer">
                  {/* Logika Preview: Jika removeImage true, tampilkan inisial. Jika tidak, cek preview atau gambar lama */}
                  {removeImage ? (
                     <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-400">{initials}</div>
                  ) : preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : user.image ? (
                    <img src={user.image} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-400">{initials}</div>
                  )}
                  
                  {/* Overlay Edit (Hanya muncul jika tidak sedang mode hapus) */}
                  {!removeImage && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {Icons.edit}
                      <span className="text-white text-[10px] font-bold mt-1 uppercase tracking-wider">Ubah</span>
                    </div>
                  )}
                  
                  {/* Input file (disable jika mode hapus) */}
                  {!removeImage && (
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  )}
                </div>

                {/* Tombol Kontrol Hapus/Batal */}
                <div className="mt-4 flex flex-col items-center gap-2">
                  {removeImage ? (
                    <>
                      <p className="text-xs text-red-500 font-semibold text-center">Foto akan dihapus saat disimpan.</p>
                      <button type="button" onClick={handleCancelRemove} className="text-xs text-blue-600 hover:underline font-bold">
                        Batalkan Hapus
                      </button>
                    </>
                  ) : (
                    // Tampilkan tombol hapus jika ada gambar lama ATAU ada preview baru
                    (user.image || preview) && (
                      <button type="button" onClick={handleRemoveImage} className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline">
                        {Icons.trash} Hapus Foto Profil
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Nama Lengkap</label>
                  <input required name="name" defaultValue={user.name} className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm font-semibold text-gray-800 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 outline-none transition-all bg-gray-50/50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Ubah Password <span className="font-normal text-gray-400">(Opsional)</span></label>
                  <input type="password" name="password" placeholder="Ketik sandi baru..." className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm font-semibold text-gray-800 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 outline-none transition-all bg-gray-50/50 focus:bg-white placeholder-gray-300" />
                </div>
              </div>
              <div className="mt-8">
                <SubmitButton label="Simpan Profil" icon={Icons.save} />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: KELOLA BUKU ALAMAT */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsAddressModalOpen(false)}>
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Kelola Alamat</h2>
                <p className="text-gray-500 text-sm mt-1">Tambah, edit, atau hapus lokasi pengiriman.</p>
              </div>
              <button type="button" onClick={() => setIsAddressModalOpen(false)} className="w-10 h-10 bg-gray-100 hover:bg-rose-100 hover:text-rose-600 rounded-full flex items-center justify-center text-gray-500 font-bold transition-colors">✕</button>
            </div>

            <form action={handleAddressSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-slate-50/50 flex-grow">
                <div className="space-y-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`p-5 rounded-2xl border-2 transition-all ${addr.isDefault ? 'border-rose-400 bg-white shadow-sm' : 'border-gray-200 bg-white'}`}>
                      {editingAddressId === addr.id ? (
                        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                          <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-4 py-3 border-2 border-rose-300 rounded-xl text-sm font-bold outline-none focus:border-rose-500 bg-rose-50/30" placeholder="Label (Rumah, dll)" />
                          <textarea value={editAddressText} onChange={e => setEditAddressText(e.target.value)} rows={2} className="w-full px-4 py-3 border-2 border-rose-300 rounded-xl text-sm outline-none focus:border-rose-500 bg-rose-50/30 resize-none" placeholder="Alamat lengkap..." />
                          <div className="flex gap-2 justify-end pt-2">
                            <button type="button" onClick={() => setEditingAddressId(null)} className="px-5 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
                            <button type="button" onClick={saveEditedAddress} className="px-5 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-xl transition-colors shadow-md">Simpan Perubahan</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`font-bold text-sm ${addr.isDefault ? 'text-rose-600' : 'text-gray-800'}`}>{addr.title}</span>
                              {addr.isDefault && <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest">Utama</span>}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed pr-4">{addr.fullAddress}</p>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4 justify-center sm:justify-start">
                            {!addr.isDefault && (
                              <button type="button" onClick={() => setAsDefault(addr.id)} className="flex-1 sm:flex-none text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">Jadikan Utama</button>
                            )}
                            <div className="flex gap-2 w-full">
                              <button type="button" onClick={() => startEditing(addr)} className="flex-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex justify-center items-center gap-1">{Icons.edit} Edit</button>
                              <button type="button" onClick={() => removeAddress(addr.id)} className="flex-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex justify-center items-center">{Icons.trash}</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    {Icons.plus} Tambah Alamat Baru
                  </h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Beri Nama Label (Contoh: Kosan Bandung)" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm font-semibold outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all placeholder-gray-400" />
                    <textarea placeholder="Ketik alamat lengkap (Jalan, RT/RW, Patokan)..." value={newAddress} onChange={e => setNewAddress(e.target.value)} rows={3} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all resize-none placeholder-gray-400" />
                    <button type="button" onClick={addAddress} disabled={!newTitle.trim() || !newAddress.trim()} className="w-full bg-rose-100 text-rose-600 text-sm font-bold py-3.5 rounded-xl hover:bg-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Tambah ke Daftar Alamat
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 shrink-0">
                <SubmitButton label="Terapkan Semua Perubahan" icon={Icons.save} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}