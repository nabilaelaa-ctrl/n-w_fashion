"use client"
import { useState } from 'react' // Tambahkan useState
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// --- KOMPONEN IKON ---
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ProductIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BannerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  // State untuk toggle sidebar di mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { name: 'Pesanan Masuk', path: '/admin/orders', icon: <OrderIcon /> },
    { name: 'Kelola Produk', path: '/admin/products', icon: <ProductIcon /> },
    { name: 'Kategori', path: '/admin/categories', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
    { name: 'Pengguna', path: '/admin/users', icon: <UserIcon /> },
    { name: 'Laporan', path: '/admin/reports', icon: <ReportIcon /> },
    { name: 'Banner', path: '/admin/banners', icon: <BannerIcon /> },
    { name: 'Ulasan Pelanggan', path: '/admin/reviews', icon: '💬' },
    { name: 'Pengaturan', path: '/admin/settings', icon: <SettingsIcon /> },
  ]

  return (
    <div className="flex h-screen bg-rose-50/30 font-sans">
      
      {/* --- OVERLAY (BACKDROP) UNTUK MOBILE --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-rose-100 flex flex-col shadow-xl shadow-rose-100/20 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none`}
      >
        
        {/* Logo Branding */}
        <div className="h-20 flex items-center justify-center border-b border-rose-50 px-6">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-rose-500 to-pink-400 p-2 rounded-xl shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-gray-800 tracking-tight leading-none">N & W Fashion</span>
              <span className="text-[10px] font-bold text-rose-400 tracking-widest uppercase">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-4">Menu Utama</p>
          {menuItems.map(item => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setIsSidebarOpen(false)} // Tutup sidebar saat link diklik (mobile)
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-200' 
                    : 'text-gray-500 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                {isActive && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full opacity-80"></div>
                )}
                <span className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-rose-400'}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-rose-50 bg-rose-50/30">
          <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-300 flex items-center justify-center text-white font-bold shadow-sm">
                  A
                </div>
                <div className="flex-1">
                   <p className="font-bold text-gray-800 text-sm">Administrator</p>
                   <p className="text-xs text-gray-400">Online</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* DECORATIVE BACKGROUND */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>

        {/* TOP NAVBAR ADMIN */}
        <header className="h-20 bg-white/80 backdrop-blur-lg border-b border-rose-100 flex items-center justify-between px-4 md:px-8 z-10 shadow-sm">
          
          {/* Left Side: Hamburger (Mobile) & Breadcrumb */}
          <div className="flex items-center gap-3">
            
            {/* Tombol Hamburger (Hanya muncul di Mobile) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-white border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 border border-rose-100 hidden md:flex">
              {menuItems.find(m => m.path === pathname)?.icon || <DashboardIcon />}
            </div>
            
            <div className="hidden md:block">
              <h2 className="text-lg font-bold text-gray-800 leading-tight">
                {menuItems.find(m => m.path === pathname)?.name || 'Administrator'}
              </h2>
              <p className="text-xs text-gray-400">
                /admin{pathname === '/admin' ? '' : pathname.replace('/admin', '')}
              </p>
            </div>
            
            {/* Judul Mobile (Opsional, menggantikan breadcrumb di HP) */}
            <h2 className="text-lg font-bold text-gray-800 md:hidden">
               {menuItems.find(m => m.path === pathname)?.name || 'Menu'}
            </h2>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Back to Store Button */}
            <Link href="/" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 px-4 py-2.5 rounded-xl border border-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">Lihat Toko</span>
            </Link>

            <div className="w-px h-8 bg-gray-100 hidden md:block"></div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-50 px-3 md:px-5 py-2.5 rounded-xl transition-all shadow-sm border border-rose-100 hover:shadow-lg hover:shadow-rose-200 active:scale-95">
              <LogoutIcon />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* HALAMAN DINAMIS */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 relative bg-transparent">
          {children}
        </main>

      </div>
    </div>
  )
}