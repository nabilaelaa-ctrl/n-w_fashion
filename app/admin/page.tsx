import prisma from '@/lib/prisma'
import Link from 'next/link'

// --- PERBAIKAN: Ikon sebagai Functional Components ---
const Icons = {
  wallet: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  ),
  bag: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  tag: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  ),
  users: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  arrowRight: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
};

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count()
  const totalOrders = await prisma.order.count()
  const totalUsers = await prisma.user.count({ where: { role: 'USER' } })

  const completedOrders = await prisma.order.findMany({ 
    where: { status: 'SELESAI' },
    select: { total: true } 
  })
  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.total, 0)

  const stats = [
    { 
      title: "Total Pendapatan", 
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, 
      icon: Icons.wallet, 
      gradient: "from-rose-500 to-pink-600",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600",
      link: "/admin/orders"
    },
    { 
      title: "Total Pesanan", 
      value: totalOrders, 
      icon: Icons.bag, 
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/admin/orders"
    },
    { 
      title: "Katalog Produk", 
      value: totalProducts, 
      icon: Icons.tag, 
      gradient: "from-purple-500 to-violet-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/admin/products"
    },
    { 
      title: "Pengguna Aktif", 
      value: totalUsers, 
      icon: Icons.users, 
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      link: "/admin/users"
    },
  ]

  return (
    // Hapus min-h-screen karena layout utama sudah mengatur scroll
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Pantau performa toko Anda secara real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-sm text-slate-600">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Sistem Online
        </div>
      </div>
      
      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          // Simpan komponen ikon ke variabel
          const IconComponent = stat.icon;
          
          return (
            <Link 
              href={stat.link} 
              key={idx} 
              className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${stat.gradient}`}></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                  {/* Ikon dengan Gradien - Panggil sebagai Komponen <IconComponent /> */}
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${stat.textColor} bg-opacity-10 px-2 py-1 rounded-full ${stat.bgLight}`}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    Active
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-sm font-medium text-slate-400 group-hover:text-slate-700 transition-colors">
                  <span>Lihat Detail</span>
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                    <Icons.arrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bagian Bawah */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions Card */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Aksi Cepat</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Tambah Produk", href: "/admin/products", emoji: "➕", color: "bg-rose-50 hover:bg-rose-100 text-rose-600" },
                { label: "Kelola Pesanan", href: "/admin/orders", emoji: "📦", color: "bg-blue-50 hover:bg-blue-100 text-blue-600" },
                { label: "Lihat Laporan", href: "/admin/reports", emoji: "📊", color: "bg-purple-50 hover:bg-purple-100 text-purple-600" },
                { label: "Pengaturan", href: "/admin/settings", emoji: "⚙️", color: "bg-slate-50 hover:bg-slate-100 text-slate-600" },
              ].map((action, i) => (
                <Link key={i} href={action.href} className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-200 group ${action.color}`}>
                  <span className="text-2xl mb-2 transition-transform group-hover:scale-110">{action.emoji}</span>
                  <span className="text-xs font-semibold text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* System Info Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-between min-h-[250px]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 border border-white/10">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Panel Admin</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Kelola toko Anda dengan mudah. Pastikan data selalu diperbarui untuk pengalaman belanja terbaik pelanggan.
            </p>
          </div>
          
          <div className="relative z-10 mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center font-bold text-sm">A</div>
            <div>
              <p className="font-semibold text-sm">Admin</p>
              <p className="text-xs text-slate-400">Toko Baju Fashion</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}