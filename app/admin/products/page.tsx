import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import DeleteButton from '@/components/DeleteButton'
import Link from 'next/link'
import { writeFile, mkdir } from 'fs/promises' 
import path from 'path'

// Ikon SVG
const Icons = {
  box: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  ),
  dress: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  hijab: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  alert: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
  )
}

export default async function AdminProductsPage() {
  // 1. Ambil Data
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  // Statistik
  const stats =[
    { label: 'Total Produk', value: products.length, icon: Icons.box, color: 'text-rose-500', bg: 'bg-rose-50', ring: 'ring-rose-100' },
    { label: 'Pakaian', value: products.filter(p => p.category === 'pakaian').length, icon: Icons.dress, color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-100' },
    { label: 'Jilbab', value: products.filter(p => p.category === 'jilbab').length, icon: Icons.hijab, color: 'text-pink-500', bg: 'bg-pink-50', ring: 'ring-pink-100' },
    { label: 'Stok Habis', value: products.filter(p => p.stock === 0).length, icon: Icons.alert, color: 'text-red-500', bg: 'bg-red-50', ring: 'ring-red-100' },
  ]

  // SERVER ACTION: Tambah Produk
  async function addProduct(formData: FormData) {
    "use server"
    
    try {
      // Handle Upload Gambar
      const files = formData.getAll('images') as File[]
      const imagesArray: string[] = []

      if (files && files.length > 0) {
        const uploadDir = path.join(process.cwd(), 'public/uploads')
        try { await mkdir(uploadDir, { recursive: true }) } catch (e) {}

        for (const file of files) {
          if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer())
            const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.\-]/g, '_') : 'image.jpg'
            const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${safeName}`
            
            const filePath = path.join(uploadDir, filename)
            await writeFile(filePath, buffer)
            imagesArray.push('/uploads/' + filename)
          }
        }
      }

      // Parsing Harga
      const price = parseInt(formData.get('price') as string) || 0
      const originalPriceInput = formData.get('originalPrice') as string
      const originalPrice = originalPriceInput ? parseInt(originalPriceInput) : null

      await prisma.product.create({
        data: {
          name: formData.get('name') as string,
          category: formData.get('category') as string,
          price: price,
          originalPrice: originalPrice, // Simpan harga coret
          stock: parseInt(formData.get('stock') as string) || 0,
          description: formData.get('description') as string,
          images: imagesArray, 
          colors: formData.get('colors') as string || 'Hitam,Putih',
          sizes: formData.get('sizes') as string || 'S,M,L',
        }
      })
    } catch (error) {
      console.error("❌ ERROR SAAT MENAMBAHKAN PRODUK:", error)
    }

    revalidatePath('/admin/products')
    revalidatePath('/') 
  }

  // SERVER ACTION: Hapus Produk
  async function deleteProduct(formData: FormData) {
    "use server"
    const id = formData.get('productId') as string
    try {
      await prisma.product.delete({ where: { id } })
    } catch (error: any) {
      if (error.code === 'P2003') console.error("❌ Error: Produk terkait data transaksi.")
      else console.error("❌ Error Hapus:", error.message)
    }
    revalidatePath('/admin/products')
    revalidatePath('/')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* HEADER & STATISTIK */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Manajemen Produk</h1>
            <p className="text-gray-400 mt-1">Kelola ketersediaan stok dan detail produk toko.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ring-1 ${stat.ring}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* FORM TAMBAH PRODUK */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 border border-rose-100">
                {Icons.plus}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Tambah Produk</h3>
                <p className="text-xs text-gray-400">Isi detail produk baru</p>
              </div>
            </div>
            
            <form action={addProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Nama Produk</label>
                <input required type="text" name="name" placeholder="Masukkan nama produk" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Kategori</label>
                  <select required name="category" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm appearance-none cursor-pointer">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Harga Jual (Rp) *</label>
                  <input required type="number" name="price" placeholder="100000" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" />
                </div>
              </div>

              {/* INPUT HARGA CORET (DISKON) */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Harga Coret / Asli (Opsional)</label>
                <input type="number" name="originalPrice" placeholder="150000 (kosongkan jika tidak ada diskon)" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" />
                <p className="text-[10px] text-gray-400 mt-1">*Isi jika ingin menampilkan harga asli yang dicoret.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Total Stok</label>
                  <input required type="number" name="stock" placeholder="100" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Ukuran</label>
                  <input type="text" name="sizes" placeholder="S,M,L" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Warna Tersedia</label>
                <input type="text" name="colors" placeholder="Hitam, Putih, Merah" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Upload Gambar</label>
                <input required type="file" name="images" multiple accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition-colors cursor-pointer border border-gray-200 rounded-xl bg-gray-50/50" />
                <p className="text-[10px] text-gray-400 mt-1">Tahan Ctrl/Cmd untuk memilih beberapa file.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Deskripsi</label>
                <textarea required name="description" placeholder="Jelaskan detail produk..." rows={3} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-gray-50/50 focus:bg-white transition-all text-sm resize-none" />
              </div>
              
              <button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                {Icons.plus}
                Simpan Produk
              </button>
            </form>
          </div>
        </div>

        {/* DAFTAR PRODUK */}
        <div className="xl:col-span-2">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              Katalog Produk
              <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{products.length}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {products.map(product => {
                let mainImage = 'https://via.placeholder.com/300';
                try {
                  const imgs = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [];
                  if (Array.isArray(imgs) && imgs.length > 0) mainImage = imgs[0];
                } catch(e) {}

                return (
                <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-rose-100 transition-all duration-300 group flex flex-col">
                  
                  <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                    <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm backdrop-blur-md ${product.category === 'pakaian' ? 'bg-purple-50 text-purple-600' : product.category === 'jilbab' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                      {product.category}
                    </span>
                    {product.stock === 0 && (
                      <span className="absolute top-3 right-3 z-10 bg-red-500/90 backdrop-blur-md text-[10px] font-bold uppercase px-3 py-1 rounded-full text-white shadow-sm animate-pulse">
                        Habis
                      </span>
                    )}
                    <img src={mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="font-bold text-gray-800 line-clamp-1 mb-2">{product.name}</h4>
                    
                    {/* LOGIKA HARGA CORET */}
                    <div className="mb-4">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <div className="flex items-end gap-2 flex-wrap">
                          <span className="text-sm text-gray-400 line-through decoration-1">
                            Rp {product.originalPrice.toLocaleString('id-ID')}
                          </span>
                          <span className="text-xl font-extrabold text-rose-500">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                          {/* Badge Diskon */}
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                            DISKON
                          </span>
                        </div>
                      ) : (
                        <p className="text-xl font-extrabold text-gray-800">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-5 mt-auto text-[11px]">
                      <span className="bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span> {product.colors}
                      </span>
                      <span className="bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span> {product.sizes}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                       <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'} px-3 py-1 rounded-full`}>
                         Stok: {product.stock}
                       </span>
                       <div className="flex gap-2">
                          <Link href={`/admin/edit/${product.id}`} className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            {Icons.edit}
                          </Link>
                          <form action={deleteProduct}>
                            <input type="hidden" name="productId" value={product.id} />
                            <DeleteButton className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center justify-center cursor-pointer border-none" />
                          </form>
                       </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">Katalog Masih Kosong</h3>
                <p className="text-sm text-gray-400">Gunakan form di samping untuk menambah produk pertama.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}