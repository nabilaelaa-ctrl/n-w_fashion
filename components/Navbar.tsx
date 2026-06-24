"use client"
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  const pathname = usePathname()
  
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartClicked, setIsCartClicked] = useState(false)

  const checkAuth = () => {
    if (typeof document === 'undefined') return;
    const cookies = document.cookie.split('; ')
    const roleCookie = cookies.find(row => row.startsWith('role='))
    const nameCookie = cookies.find(row => row.startsWith('name=')) 

    if (roleCookie) setRole(roleCookie.split('=')[1])
    else setRole(null)

    if (nameCookie) setUserName(decodeURIComponent(nameCookie.split('=')[1]))
    else setUserName(null)
  }

  useEffect(() => {
    setMounted(true)
    checkAuth()

    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  const handleLogout = async () => {
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    await fetch('/api/auth/logout', { method: 'POST' });
    
    clearCart();
    setRole(null);
    setUserName(null);
    
    router.push('/login');
    router.refresh();
  }

  const totalItems = items.reduce((acc, item) => acc + item.qty, 0)

  const handleCartClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsCartClicked(true);
    setTimeout(() => setIsCartClicked(false), 600);
  }

  if (!mounted) return <div className="h-[84px] bg-pink-50"></div>
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out animate-nav-slide-down ${
        isScrolled 
        ? 'bg-rose-50/90 backdrop-blur-xl shadow-lg shadow-pink-200/30 py-2 border-b border-pink-100' 
        : 'bg-gradient-to-r from-pink-50 via-rose-50 to-white border-b border-pink-100/50 py-3'
      }`}>
        
        {/* ANIMATED GRADIENT BORDER (Warna Pink Lebih Tua) */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-200 via-rose-500 to-pink-200 transition-opacity duration-500 ${isScrolled ? 'opacity-100 animate-border-slide' : 'opacity-0'}`}></div>

        {/* FLOATING PARTICLES CONTAINER (Partikel Pink) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 group">
            <div className="absolute w-2 h-2 bg-rose-300 rounded-full top-2 left-[10%] animate-float-1"></div>
            <div className="absolute w-1 h-1 bg-pink-300 rounded-full top-3 right-[20%] animate-float-2"></div>
            <div className="absolute w-1.5 h-1.5 bg-fuchsia-300 rounded-full bottom-2 left-[40%] animate-float-3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-16">
            
            {/* LOGO TOKO */}
            <Link href="/" className="flex items-center gap-3 group magnetic-area">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 text-white shadow-lg shadow-rose-300/50 group-hover:shadow-xl group-hover:shadow-rose-400/60 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                <span className="text-[22px] font-black text-gray-800 tracking-tight leading-none flex items-center">
                  N&W <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 font-serif italic font-bold ml-1.5">Fashion</span>
                </span>
                <span className="text-[10px] font-medium text-rose-400 -mt-0.5 tracking-wide opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Elegant & Modern
                </span>
              </div>
            </Link>

            {/* MENU NAVIGASI & ACTIONS */}
            <div className="flex items-center gap-3 sm:gap-5">
              
              {/* Menu Navigasi (Background Putih Transparan di atas Pink) */}
              <div className="hidden md:flex items-center p-1.5 bg-white/40 backdrop-blur-sm border border-pink-200/50 rounded-full transition-all duration-300 hover:bg-white/60">
                <Link href="/" className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden group/link ${
                  pathname === '/' ? 'text-white' : 'text-gray-600 hover:text-rose-600'
                }`}>
                  {pathname === '/' && <span className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pop-in shadow-md"></span>}
                  <span className={`relative z-10 ${pathname === '/' ? '' : 'group-hover/link:animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-gray-600 via-rose-600 to-gray-600'}`}>Home</span>
                </Link>
                
                {role && (
                  <>
                    <Link href="/orders" className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden group/link ${
                      pathname === '/orders' ? 'text-white' : 'text-gray-600 hover:text-rose-600'
                    }`}>
                      {pathname === '/orders' && <span className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pop-in shadow-md"></span>}
                      <span className={`relative z-10 ${pathname === '/orders' ? '' : 'group-hover/link:animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-gray-600 via-rose-600 to-gray-600'}`}>Pesanan</span>
                    </Link>
                    <Link href="/profile" className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden group/link ${
                      pathname === '/profile' ? 'text-white' : 'text-gray-600 hover:text-rose-600'
                    }`}>
                      {pathname === '/profile' && <span className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pop-in shadow-md"></span>}
                      <span className={`relative z-10 ${pathname === '/profile' ? '' : 'group-hover/link:animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-gray-600 via-rose-600 to-gray-600'}`}>Profil</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Tombol Keranjang */}
              <Link 
                href="/cart" 
                onClick={handleCartClick}
                className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-white/60 hover:bg-white border border-pink-100 hover:border-rose-300 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 rounded-full bg-rose-300 opacity-0 group-hover:animate-ping"></div>
                
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-[22px] w-[22px] text-rose-500 transition-all duration-500 ${isCartClicked ? 'scale-0 rotate-45' : 'scale-100 rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                
                <svg xmlns="http://www.w3.org/2000/svg" className={`absolute h-6 w-6 text-green-600 transition-all duration-500 ${isCartClicked ? 'scale-100 rotate-0' : 'scale-0 -rotate-45'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>

                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-black rounded-full shadow-md shadow-rose-300 ring-2 ring-white transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 animate-bounce-short">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-pink-300 to-transparent mx-1"></div>

              {/* AREA USER */}
              {role ? (
                <div className="flex items-center gap-3">
                  
                  {role === 'ADMIN' && (
                    <Link href="/admin" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:shadow-purple-300/30 transition-all duration-300 transform hover:-translate-y-0.5 group/admin">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-300 group-hover/admin:animate-spin-slow transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Panel Admin</span>
                    </Link>
                  )}

                  {/* User Profile */}
                  <div className="flex items-center p-1 bg-white/60 border border-pink-200/50 rounded-full shadow-sm hover:shadow-md transition-shadow">
                     <Link href="/profile" className="hidden sm:flex items-center gap-2.5 hover:bg-pink-50/50 pl-1.5 pr-4 py-1.5 rounded-full transition-colors cursor-pointer group/prof">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-[11px] group-hover/prof:scale-110 transition-transform duration-300 shadow-sm">
                          {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-xs font-bold text-gray-700 max-w-[90px] truncate group-hover/prof:text-rose-600 transition-colors">{userName}</span>
                     </Link>

                     <div className="hidden sm:block w-px h-5 bg-pink-200 mx-1"></div>

                     <button 
                      onClick={handleLogout} 
                      className="flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-white hover:bg-rose-500 transition-all group/logout"
                      title="Keluar / Logout"
                     >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] group-hover/logout:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                     </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link href="/login" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-rose-600 transition-colors relative group/log">
                    Masuk
                    <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-rose-500 group-hover/log:w-3/4 group-hover/log:left-1/4 transition-all duration-300"></span>
                  </Link>
                  <Link href="/register" className="relative overflow-hidden px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-full hover:shadow-xl hover:shadow-pink-300/30 active:scale-95 transition-all duration-300 group/reg transform hover:-translate-y-0.5">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 origin-left scale-x-0 group-hover/reg:scale-x-100 transition-transform duration-500 ease-out rounded-full"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      Daftar
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-0 -translate-x-2 group-hover/reg:opacity-100 group-hover/reg:translate-x-0 transition-all duration-300 delay-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="h-[84px]"></div>

      {/* --- INJEKSI CSS ANIMASI --- */}
      <style jsx global>{`
        @keyframes nav-slide-down {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-nav-slide-down {
          animation: nav-slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes border-slide {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-border-slide {
          background-size: 200% 200%;
          animation: border-slide 3s linear infinite;
        }

        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
        }

        @keyframes bounce-short {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10%) scale(1.15); }
        }
        .animate-bounce-short {
          animation: bounce-short 1.5s ease-in-out infinite;
        }

        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(10px) translateX(5px); opacity: 0.5; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(-5px) translateX(-5px); opacity: 0.5; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(5px); opacity: 0.5; }
        }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float-3 6s ease-in-out infinite 0.5s; }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}