import prisma from '@/lib/prisma'
import Link from 'next/link'
import HomeSlider from '@/components/HomeSlider'
import Footer from "@/components/Footer"

// Helper untuk menentukan ikon berdasarkan slug kategori
const getCategoryIcon = (slug: string) => {
  const icons: { [key: string]: string } = {
    'pakaian': '👚',
    'jilbab': '🧕',
    'celana': '👖',
    'rok': '👗',
    'aksesoris': '👜',
    'setelan': '✨',
  }
  return icons[slug.toLowerCase()] || '🛍️' // Default icon
}

export default async function Home() {
  // 1. Ambil Banner
  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  });

  // 2. Ambil Kategori dari Database (Dinamis)
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  // 3. Ambil Produk Terbaru
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' }
  });

  // Fitur statis untuk side card
  const features = [
    { icon: '✨', title: 'Kualitas Premium', desc: 'Material terbaik pilihan', color: 'bg-rose-50 text-rose-600' },
    { icon: '💳', title: 'Pembayaran Aman', desc: 'Transparan & Terpercaya', color: 'bg-emerald-50 text-emerald-600' },
    { icon: '🚚', title: 'Pengiriman Cepat', desc: 'COD ke seluruh Indonesia', color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="bg-[#f8fafc] w-full overflow-x-hidden flex flex-col min-h-screen font-sans">
      
      <main className="flex-grow pb-16">
        
        {/* ======================================================== */}
        {/* 1. HERO SECTION */}
        {/* ======================================================== */}
        <section className="w-full max-w-7xl mx-auto pt-4 md:pt-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Slider Utama */}
            <div className="lg:col-span-2 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 relative bg-white border border-slate-100/50">
              {banners.length > 0 ? (
                <div className="h-[360px] md:h-[500px]">
                  <HomeSlider banners={banners} />
                </div>
              ) : (
                <div className="relative w-full h-[360px] md:h-[500px] bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center text-white overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  <div className="relative z-10 text-center px-6">
                    <div className="text-5xl mx-auto mb-4 drop-shadow-md animate-bounce">
                      ✨
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 drop-shadow-sm">N&W <span className="font-serif italic font-normal">Fashion</span></h1>
                    <p className="text-base md:text-lg text-rose-50 max-w-md mx-auto font-light drop-shadow-sm">Tampilkan versi terbaik dirimu setiap hari.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Side Info Card */}
            <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col justify-between relative overflow-hidden group min-h-[360px] lg:min-h-0 lg:h-auto">
              
              <div className="absolute top-0 right-0 w-40 h-40 bg-rose-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-150"></div>
              
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border border-rose-100/50 shadow-sm">
                  <span>✨</span> Tren Terbaru
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-[1.15]">
                  Gaya Sempurna <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 font-serif italic">Untuk Anda.</span>
                </h2>
                <p className="text-sm text-slate-500 mt-4 leading-relaxed font-normal">
                  Koleksi pilihan dengan bahan berkualitas tinggi dan desain kekinian yang dirancang khusus untuk gaya keseharianmu.
                </p>
              </div>

              <div className="mt-8 space-y-4 relative z-10">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                    <div className={`w-11 h-11 rounded-2xl ${f.color} flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:scale-110 shadow-sm text-xl`}>
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{f.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/category/pakaian" className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white text-center py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5">
                Mulai Belanja <span className="text-lg leading-none">→</span>
              </Link>

            </div>
          </div>
        </section>

        {/* ======================================= */}
        {/* 2. KATEGORI SECTION (DINAMIS)          */}
        {/* ======================================= */}
        <section id="kategori" className="w-full max-w-7xl mx-auto px-4 mt-20 md:mt-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Kategori Pilihan</h2>
            <p className="text-slate-500 mt-3 text-sm md:text-base font-normal">Temukan kebutuhan fashionmu dengan mudah</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Looping dari Database */}
            {categories.map((cat) => {
              // Tentukan warna random atau default
              const colors = [
                { bg: 'bg-sky-50', hover: 'group-hover:bg-sky-500', shadow: 'group-hover:shadow-sky-200' },
                { bg: 'bg-rose-50', hover: 'group-hover:bg-rose-500', shadow: 'group-hover:shadow-rose-200' },
                { bg: 'bg-indigo-50', hover: 'group-hover:bg-indigo-500', shadow: 'group-hover:shadow-indigo-200' },
                { bg: 'bg-amber-50', hover: 'group-hover:bg-amber-500', shadow: 'group-hover:shadow-amber-200' },
                { bg: 'bg-emerald-50', hover: 'group-hover:bg-emerald-500', shadow: 'group-hover:shadow-emerald-200' },
              ];
              // Ambil warna berdasarkan index atau random
              const color = colors[cat.slug.length % colors.length];

              return (
                // PERBAIKAN: Pastikan href menggunakan backtick dengan benar
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group">
                  <div className={`bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 hover:border-transparent hover:shadow-2xl ${color.shadow} transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col items-center text-center relative overflow-hidden h-full`}>
                    
                    <div className="relative z-10 flex flex-col items-center w-full">
                      <div className={`w-20 h-20 rounded-3xl ${color.bg} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${color.hover} group-hover:shadow-lg text-4xl`}>
                        {getCategoryIcon(cat.slug)}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">{cat.name}</h3>
                      <p className="text-sm text-slate-500 font-normal line-clamp-2 px-2">{cat.description || 'Lihat koleksi terbaik.'}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ======================================= */}
        {/* 3. PRODUK TERBARU                       */}
        {/* ======================================= */}
        <section className="w-full max-w-7xl mx-auto px-4 mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Koleksi Terbaru</h2>
              <p className="text-slate-500 mt-3 text-sm md:text-base font-normal">Tampil menawan dengan rilisan produk minggu ini</p>
            </div>
            <Link href="/category/pakaian" className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-rose-600 transition-colors bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-100 px-6 py-3 rounded-full mt-4 md:mt-0 shadow-sm">
              Lihat Semua Koleksi <span className="text-lg leading-none">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              // Parsing gambar utama
              let imageUrl = 'https://via.placeholder.com/400x500';
              try {
                if (product.images) {
                  const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                  if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
                } else if ((product as any).image) {
                  imageUrl = (product as any).image;
                }
              } catch(e) {}

              return (
                <Link href={`/product/${product.id}`} key={product.id} className="group">
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full relative">
                    
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-3xl">
                        <span className="bg-slate-900 text-white text-[11px] font-bold px-4 py-2 rounded-full tracking-widest uppercase shadow-xl">
                          Habis Terjual
                        </span>
                      </div>
                    )}

                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/95 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-slate-700 px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                        {product.category}
                      </span>
                    </div>

                    <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden w-full">
                      <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-semibold text-slate-700 text-sm md:text-base leading-snug mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                        <p className="text-base md:text-lg font-black text-slate-900">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                        <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-500 group-hover:border-rose-500 group-hover:text-white transition-all shadow-sm">
                           <span className="text-lg leading-none">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {products.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 mt-8 shadow-sm">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
                 🛍️
               </div>
               <h3 className="text-xl font-bold text-slate-700 mb-2">Katalog Masih Kosong</h3>
               <p className="text-slate-500 text-sm">Produk baru akan segera hadir. Pantau terus ya!</p>
            </div>
          )}
          
          <div className="mt-10 md:hidden text-center">
             <Link href="/category/pakaian" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 shadow-sm transition-colors px-8 py-3.5 rounded-full w-full">
                Lihat Semua Koleksi <span className="text-lg leading-none">→</span>
             </Link>
          </div>
        </section>
      </main>

      <Footer />

    </div>
  )
}