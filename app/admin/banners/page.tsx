import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import Link from 'next/link'

// --- KOMPONEN IKON ---
const Icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
  ),
  arrowUp: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
  ),
  arrowDown: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
  ),
  image: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  )
}

// Kategori yang tersedia di N&W Fashion
const CATEGORIES =[
  { name: 'Pakaian', slug: '/category/pakaian' },
  { name: 'Jilbab', slug: '/category/jilbab' },
  { name: 'Celana', slug: '/category/celana' },
  { name: 'Aksesoris', slug: '/category/aksesoris' },
]

// --- SERVER ACTIONS ---

// Tambah Banner Baru
async function addBanner(formData: FormData) {
  'use server'
  
  const file = formData.get('image') as File
  const title = formData.get('title') as string
  const link = formData.get('link') as string // Sekarang ini berisi path dari dropdown

  if (!file || file.size === 0) return

  try {
    // Buat path upload dengan error handling yang lebih baik
    const buffer = Buffer.from(await file.arrayBuffer())
    const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.\-]/g, '_') : 'banner.jpg'
    const filename = `banner-${Date.now()}-${safeName}`
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    
    // Gunakan try-catch khusus untuk folder creation
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {}
    
    await writeFile(path.join(uploadDir, filename), buffer)

    // Hitung urutan maksimal
    const lastBanner = await prisma.banner.findFirst({ orderBy: { order: 'desc' } })
    const newOrder = lastBanner ? lastBanner.order + 1 : 1

    // Simpan ke DB
    await prisma.banner.create({
      data: {
        title: title || null,
        imageUrl: `/uploads/${filename}`,
        link: link || null, // Link tersimpan sebagai path kategori (misal: /category/jilbab)
        order: newOrder
      }
    })
  } catch (error) {
    console.error("Gagal menambah banner:", error)
  }

  // Refresh semua cache karena Banner tampil di halaman Home Utama
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

// Hapus Banner
async function deleteBanner(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  
  try {
    await prisma.banner.delete({ where: { id } })
  } catch (error) {
    console.error("Gagal hapus banner:", error)
  }
  
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

// Ubah Urutan (Move Up)
async function moveUp(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  
  const current = await prisma.banner.findUnique({ where: { id } })
  if (!current) return

  const previous = await prisma.banner.findFirst({
    where: { order: { lt: current.order } },
    orderBy: { order: 'desc' }
  })

  if (previous) {
    await prisma.$transaction([
      prisma.banner.update({ where: { id: current.id }, data: { order: previous.order } }),
      prisma.banner.update({ where: { id: previous.id }, data: { order: current.order } })
    ])
  }
  
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

// Ubah Urutan (Move Down)
async function moveDown(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  
  const current = await prisma.banner.findUnique({ where: { id } })
  if (!current) return

  const next = await prisma.banner.findFirst({
    where: { order: { gt: current.order } },
    orderBy: { order: 'asc' }
  })

  if (next) {
    await prisma.$transaction([
      prisma.banner.update({ where: { id: current.id }, data: { order: next.order } }),
      prisma.banner.update({ where: { id: next.id }, data: { order: current.order } })
    ])
  }
  
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

// --- HALAMAN UTAMA ---
export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-lg bg-white border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
            {Icons.back}
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Manajemen Banner</h1>
            <p className="text-gray-400 mt-1">Atur slider promo di halaman utama toko.</p>
          </div>
        </div>
      </div>

      {/* FORM TAMBAH BANNER */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          {Icons.plus} Upload Banner Baru
        </h3>
        <form action={addBanner} className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Judul (Opsional)</label>
            <input type="text" name="title" placeholder="Misal: Promo Lebaran" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 outline-none" />
          </div>

          {/* PERUBAHAN: DARI INPUT TEXT KE DROPDOWN SELECT */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Arahkan Banner Ke</label>
            <select name="link" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 outline-none bg-white cursor-pointer appearance-none">
              <option value="">Jangan Arahkan Kemana-mana</option>
              <optgroup label="Halaman Kategori">
                {CATEGORIES.map(cat => (
                  <option key={cat.slug} value={cat.slug}>Kategori {cat.name}</option>
                ))}
              </optgroup>
              <option value="/#kategori">Semua Kategori</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Gambar Banner</label>
            <input type="file" name="image" accept="image/*" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 cursor-pointer border border-gray-200 rounded-xl" />
          </div>

          <div className="md:col-span-1">
            <button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {Icons.plus} Simpan Banner
            </button>
          </div>
        </form>
      </div>

      {/* DAFTAR BANNER */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Daftar Slider Aktif</h3>
        
        {banners.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <div className="flex justify-center text-gray-300 mb-3">{Icons.image}</div>
            <p className="text-gray-400 font-medium">Belum ada banner yang diupload.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div key={banner.id} className="flex flex-col md:flex-row gap-5 p-4 border border-gray-100 rounded-2xl hover:shadow-md hover:border-rose-100 transition-all group bg-gray-50/30 items-center">
                
                {/* Preview Gambar */}
                <div className="w-full md:w-64 h-32 rounded-xl overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200">
                  <img src={banner.imageUrl} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    SLIDE #{index + 1}
                  </span>
                </div>

                {/* Info & Aksi */}
                <div className="flex-grow flex flex-col justify-between w-full h-full py-1">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{banner.title || 'Banner Tanpa Judul'}</h4>
                    
                    {/* Menampilkan status link dengan lebih rapi */}
                    {banner.link ? (
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide">
                        🔗 Mengarah ke: {banner.link.replace('/category/', 'Kategori ').replace('/#kategori', 'Semua Kategori')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide">
                        🚫 Tidak ada link tujuan
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
                    {/* Tombol Urutan */}
                    <div className="flex gap-1.5 mr-auto">
                      <form action={moveUp}>
                        <input type="hidden" name="id" value={banner.id} />
                        <button type="submit" disabled={index === 0} title="Geser ke Kiri (Maju)" className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors shadow-sm">
                          {Icons.arrowUp}
                        </button>
                      </form>
                      <form action={moveDown}>
                        <input type="hidden" name="id" value={banner.id} />
                        <button type="submit" disabled={index === banners.length - 1} title="Geser ke Kanan (Mundur)" className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors shadow-sm">
                          {Icons.arrowDown}
                        </button>
                      </form>
                    </div>

                    {/* Hapus */}
                    <form action={deleteBanner}>
                      <input type="hidden" name="id" value={banner.id} />
                      <button type="submit" title="Hapus Banner" className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold text-sm transition-colors flex items-center gap-2">
                        {Icons.trash} Hapus
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}