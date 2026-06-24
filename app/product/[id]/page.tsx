import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'
import ProductAccordions from '@/components/ProductAccordions'
import ProductGallery from '@/components/ProductGallery'
import Link from 'next/link'

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // AMBIL DATA PRODUK BESERTA RELASI KATEGORI & ULASAN
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categoryRel: true, // <--- AMBIL DATA KATEGORI DINAMIS
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!product) return notFound()

  // --- LOGIKA KATEGORI ---
  // Gunakan relasi jika ada, jika tidak fallback ke field string lama
  const categoryName = product.categoryRel?.name || product.category
  const categorySlug = product.categoryRel?.slug || product.category
  // -----------------------

  // --- PARSING DATA GAMBAR ---
  let productImages: string[] = [];
  try {
    const imgs = product.images;
    if (imgs) {
      productImages = typeof imgs === 'string' ? JSON.parse(imgs) : imgs;
    }
  } catch (e) {
    console.error("Gagal parse gambar", e);
  }
  
  if (productImages.length === 0 && (product as any).image) {
     productImages.push((product as any).image);
  }
  // ----------------------------

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 min-h-[80vh]">
      
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
        <span>/</span>
        {/* Gunakan slug dinamis */}
        <Link href={`/category/${categorySlug}`} className="hover:text-rose-500 transition-colors capitalize">
          {categoryName}
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-800 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* BAGIAN ATAS: GRID GAMBAR & INFO PRODUK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* KOLOM KIRI: Galeri Gambar */}
          <div className="bg-gray-50/50 h-full flex items-center justify-center p-4 md:p-8 relative">
             <div className="w-full">
               <ProductGallery images={productImages} />
             </div>
            
            <span className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-sm text-xs font-bold px-4 py-1.5 rounded-full text-rose-500 shadow-sm border border-rose-100 uppercase tracking-widest">
              {categoryName}
            </span>
          </div>

          {/* KOLOM KANAN: Detail Produk & Tombol Beli */}
          <div className="p-8 md:p-12 flex flex-col h-full bg-white">
            
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* --- LOGIKA HARGA CORET (DISKON) --- */}
              <div className="flex items-end gap-3 mb-6 flex-wrap">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <>
                    <span className="text-lg text-gray-400 line-through decoration-1">
                      Rp {product.originalPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-3xl font-black text-rose-600">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span className="px-2 py-1 text-[10px] font-bold text-white bg-red-500 rounded-full uppercase tracking-wide">Diskon</span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-gray-800">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock > 0 ? `Tersedia ${product.stock} Pcs` : 'Stok Habis'}
                </div>
              </div>
            </div>

            {/* Tombol Add To Cart */}
            <div className="mt-auto pt-8 border-t border-gray-100">
              <AddToCartButton product={product} fullWidth={true} />
              
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                  Produk Original
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> 
                  Bayar di Tempat (COD)
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* BAGIAN BAWAH: DESKRIPSI & ULASAN */}
        <div className="border-t border-gray-100 p-6 md:p-12 bg-gray-50/30">
          <ProductAccordions 
            description={product.description} 
            reviews={product.reviews} 
          />
        </div>

      </div>
    </div>
  )
}