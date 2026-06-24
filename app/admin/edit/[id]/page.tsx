import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import Link from 'next/link'

// Ikon SVG
const Icons = {
  arrowLeft: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  save: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  ),
  image: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

// Server Action untuk Update Data
async function updateProduct(formData: FormData) {
  "use server"
  
  const id = formData.get('id') as string
  const categoryName = formData.get('category') as string

  // 1. Cari kategori yang dipilih
  const selectedCategory = await prisma.category.findFirst({
    where: { name: categoryName }
  })

  // 2. Ambil data produk yang ada
  const existingProduct = await prisma.product.findUnique({ where: { id } })
  if (!existingProduct) return redirect('/admin/products')

  // 3. Proses Gambar
  let currentImages: string[] = []
  try {
    const imgs = existingProduct.images
    if (imgs) currentImages = typeof imgs === 'string' ? JSON.parse(imgs) : imgs
  } catch (e) { console.error(e) }

  const files = formData.getAll('images') as File[]
  const newImages: string[] = []

  if (files && files.length > 0) {
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    try { await mkdir(uploadDir, { recursive: true }) } catch (e) {}
    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const ext = file.name.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        await writeFile(path.join(uploadDir, filename), buffer)
        newImages.push('/uploads/' + filename)
      }
    }
  }

  const finalImages = [...currentImages, ...newImages]

  // 4. Parsing Harga
  const price = parseInt(formData.get('price') as string) || 0
  const originalPriceInput = formData.get('originalPrice') as string
  const originalPrice = originalPriceInput ? parseInt(originalPriceInput) : null

  // 5. Simpan ke Database
  const dataToUpdate: any = {
    name: formData.get('name') as string,
    category: categoryName,
    categoryId: selectedCategory?.id || null,
    price: price,
    originalPrice: originalPrice, // Simpan harga coret
    stock: parseInt(formData.get('stock') as string) || 0,
    description: formData.get('description') as string,
    colors: formData.get('colors') as string,
    sizes: formData.get('sizes') as string,
    images: finalImages
  }

  try {
    await prisma.product.update({
      where: { id },
      data: dataToUpdate
    })
  } catch (error) {
    console.error("Gagal update produk:", error)
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/edit/${id}`)
  redirect('/admin/products')
}

// HALAMAN UTAMA
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Ambil Produk & Kategori
  const product = await prisma.product.findUnique({ where: { id } })
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-800">Produk Tidak Ditemukan</h1>
        <Link href="/admin/products" className="text-rose-500 hover:underline mt-4 inline-block">
          Kembali ke Daftar Produk
        </Link>
      </div>
    )
  }

  // Parsing gambar
  let productImages: string[] = []
  try {
    const imgs = product.images
    if (imgs) productImages = typeof imgs === 'string' ? JSON.parse(imgs) : imgs
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto py-10">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Edit Produk</h1>
          <p className="text-gray-400 mt-1">Perbarui detail produk: <span className="font-semibold text-gray-600">{product.name}</span></p>
        </div>
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
        >
          {Icons.arrowLeft}
          Kembali
        </Link>
      </div>

      {/* Form Edit */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <form action={updateProduct} className="space-y-6">
          
          <input type="hidden" name="id" value={product.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nama Produk */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Nama Produk</label>
              <input 
                required 
                type="text" 
                name="name" 
                defaultValue={product.name} 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" 
              />
            </div>

            {/* Kategori & Harga */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Kategori</label>
              <select 
                required 
                name="category" 
                defaultValue={product.category}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Harga Jual (Rp) *</label>
              <input 
                required 
                type="number" 
                name="price" 
                defaultValue={product.price} 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" 
              />
            </div>

            {/* INPUT HARGA CORET (DISKON) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Harga Coret / Asli (Opsional)</label>
              <input 
                type="number" 
                name="originalPrice" 
                defaultValue={product.originalPrice || ''} 
                placeholder="Contoh: 150000 (Kosongkan jika tidak ada diskon)" 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" 
              />
              <p className="text-[10px] text-gray-400 mt-1">*Isi jika ingin menampilkan harga asli yang dicoret. Harus lebih besar dari Harga Jual.</p>
            </div>

            {/* Stok & Ukuran */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Total Stok</label>
              <input 
                required 
                type="number" 
                name="stock" 
                defaultValue={product.stock} 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Ukuran (Pisah koma)</label>
              <input 
                type="text" 
                name="sizes" 
                defaultValue={product.sizes} 
                placeholder="S,M,L" 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" 
              />
            </div>

            {/* Warna */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Warna Tersedia</label>
              <input 
                type="text" 
                name="colors" 
                defaultValue={product.colors} 
                placeholder="Hitam, Putih" 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" 
              />
            </div>

            {/* GAMBAR: Galeri Saat Ini + Upload Baru */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Galeri Gambar Saat Ini</label>
              
              {productImages.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  {productImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border relative group">
                      <img src={img} alt={`Product ${idx+1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 mb-4">
                  <div className="text-center text-gray-400">
                    {Icons.image}
                    <p className="text-xs mt-1">Belum ada gambar</p>
                  </div>
                </div>
              )}
              
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Tambah Gambar Baru (Bisa Lebih dari 1)</label>
              <input 
                type="file" 
                name="images" 
                multiple 
                accept="image/*" 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition-colors cursor-pointer border border-gray-200 rounded-xl bg-gray-50/50" 
              />
              <p className="text-[10px] text-gray-400 mt-1 italic">*Gambar baru akan ditambahkan ke galeri yang sudah ada.</p>
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Deskripsi</label>
              <textarea 
                required 
                name="description" 
                defaultValue={product.description}
                rows={4} 
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm resize-none" 
              />
            </div>
            
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link 
              href="/admin/products" 
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-200 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {Icons.save}
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}