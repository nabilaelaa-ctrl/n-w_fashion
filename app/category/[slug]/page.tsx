import prisma from '@/lib/prisma'
import AddToCartButton from '@/components/AddToCartButton'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Ikon SVG
const EmptyBoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-rose-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // --- PERBAIKAN: Cari Kategori dulu berdasarkan slug ---
  const category = await prisma.category.findUnique({
    where: { slug: slug }
  });

  // Jika kategori tidak ditemukan di database
  if (!category) {
    // Coba cek hardcoded untuk data lama (opsional, jika ada data sisa migrasi)
    // Jika tidak, langsung notFound()
    return notFound();
  }

  // Ambil produk berdasarkan NAMA KATEGORI dari tabel Category
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { category: category.name }, // Cocokkan dengan field string 'category'
        { categoryId: category.id }  // Atau cocokkan dengan relasi baru (jika sudah pakai relasi)
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  // Gunakan nama dari database untuk judul (misal slug: "pakaian-wanita", name: "Pakaian Wanita")
  const title = category.name;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 min-h-screen">
      
      {/* Navigasi / Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-rose-500 transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-rose-500">{title}</span>
      </nav>

      {/* Header Halaman */}
      <div className="flex justify-between items-end mb-10 border-b border-rose-100 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Koleksi <span className="text-rose-500">{title}</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Menampilkan <span className="font-semibold text-rose-400">{products.length}</span> produk pilihan terbaik.
          </p>
        </div>
      </div>
      
      {products.length === 0 ? (
        // Tampilan Kosong
        <div className="text-center py-24 bg-gradient-to-b from-white to-rose-50 rounded-3xl border border-rose-100 shadow-sm">
          <EmptyBoxIcon />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Produk Belum Tersedia</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Maaf, saat ini admin belum menambahkan produk untuk kategori {title}. Coba lihat kategori lain ya!
          </p>
          <Link href="/#kategori" className="inline-block bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
            Jelajahi Kategori Lain
          </Link>
        </div>
      ) : (
        // Grid Produk
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            // --- LOGIKA PARSING GAMBAR ---
            let mainImage = null;
            try {
              const imgs = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [];
              if (Array.isArray(imgs) && imgs.length > 0) {
                mainImage = imgs[0];
              }
            } catch (e) { console.error(e); }
            // -----------------------------

            return (
              <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-rose-50 overflow-hidden hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 flex flex-col group relative">
                
                {/* Badge Kategori */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-rose-500 shadow-sm border border-rose-100">
                    {title}
                  </span>
                </div>

                <Link href={`/product/${product.id}`} className="block relative overflow-hidden">
                  <div className="aspect-[3/4] bg-rose-50/50 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                    {mainImage ? (
                      <img 
                        src={mainImage} 
                        alt={product.name} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-rose-200 h-full">
                        <ImageIcon />
                        <span className="text-xs mt-2 font-medium">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay Gradient saat Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/product/${product.id}`} className="flex-grow">
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-rose-500 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h2>
                  </Link>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400">Harga</span>
                      <p className="text-xl font-extrabold text-rose-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <AddToCartButton product={product} />
                  </div>
                  
                  {/* Indikator Stok Mini */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      {product.stock > 0 ? `Sisa ${product.stock}` : 'Habis'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}