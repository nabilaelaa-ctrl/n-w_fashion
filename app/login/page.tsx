"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

// --- Komponen Ikon ---
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

// Ikon Mata (Lihat Password)
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// Ikon Mata Silang (Sembunyikan Password)
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

// Ikon tambahan untuk hiasan background
const HangerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2ZM12 6V7M3 14L12 9L21 14H3ZM12 14V20" />
  </svg>
);

const ScissorsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // State untuk visibilitas password
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (res.ok) {
        const data = await res.json()
        toast.success("Login berhasil!")
        router.refresh()
        if(data.role === 'ADMIN') router.push('/admin')
        else router.push('/')
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || "Email atau password salah")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server.")
    } finally {
      setIsLoading(false)
    }
  }

  // Gambar Fashion (Lanscape/Horizontal)
  const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans relative overflow-hidden">
      
      {/* --- CSS ANIMATION --- */}
      <style jsx global>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes floatRandom {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          50% { transform: translateY(0) translateX(20px) rotate(-5deg); }
          75% { transform: translateY(-10px) translateX(5px) rotate(3deg); }
        }
        .animate-marquee-left { animation: marqueeLeft 30s linear infinite; }
        .animate-marquee-right { animation: marqueeRight 30s linear infinite; }
        .animate-float-1 { animation: floatRandom 6s ease-in-out infinite; }
        .animate-float-2 { animation: floatRandom 8s ease-in-out infinite 2s; }
        .animate-float-3 { animation: floatRandom 7s ease-in-out infinite 4s; }
      `}</style>

      {/* --- MARQUEE ATAS ( Bergerak Ke Kiri ) --- */}
      <div className="w-full h-[20vh] lg:h-[25vh] flex overflow-hidden border-b border-gray-200 bg-white">
        <div className="flex animate-marquee-left hover:pause whitespace-nowrap">
          {images.map((src, i) => (
            <div key={`top1-${i}`} className="h-[20vh] lg:h-[25vh] w-[250px] lg:w-[300px] flex-shrink-0 relative group overflow-hidden">
              <img src={src} alt="fashion" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
            </div>
          ))}
          {images.map((src, i) => (
            <div key={`top2-${i}`} className="h-[20vh] lg:h-[25vh] w-[250px] lg:w-[300px] flex-shrink-0 relative group overflow-hidden">
              <img src={src} alt="fashion" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>

      {/* --- AREA TENGAH ( LOGIN FORM ) --- */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 my-4">
        
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <HangerIcon className="absolute top-10 left-10 w-10 h-10 text-rose-200 animate-float-1" />
            <HangerIcon className="absolute bottom-10 right-10 w-12 h-12 text-pink-200 animate-float-2 opacity-50" />
            <ScissorsIcon className="absolute top-1/4 right-1/4 w-8 h-8 text-gray-200 animate-float-3" />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-rose-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
        </div>

        {/* Card Login */}
        <div className="w-full max-w-md relative z-10">
          
          {/* Header Card */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-3 bg-white rounded-2xl shadow-lg p-3 border border-rose-50 transform hover:rotate-6 transition-transform duration-300">
              <LogoIcon />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">N & W Fashion</h1>
            <p className="text-gray-400 mt-1 text-xs tracking-widest uppercase">Member Login Area</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-rose-500 transition-colors">
                    <MailIcon />
                  </div>
                  <input 
                    type="email" required placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white transition-all text-sm shadow-sm"
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors">
                    Lupa?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-rose-500 transition-colors">
                    <LockIcon />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} required placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white transition-all text-sm shadow-sm"
                    onChange={e => setPassword(e.target.value)} 
                  />
                  {/* Tombol Toggle Password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="relative w-full bg-gradient-to-r from-rose-600 to-pink-500 text-white p-3 rounded-xl font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-rose-300 active:scale-[0.99] disabled:opacity-60 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : "Masuk Sekarang"}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </button>
            </form>

            <div className="pt-4 text-center border-t border-gray-100 mt-4">
              <p className="text-sm text-gray-500">
                Belum punya akun?{' '}
                <Link href="/register" className="font-bold text-rose-600 hover:text-rose-700 hover:underline transition-colors">
                  Daftar Gratis
                </Link>
              </p>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-gray-400 mt-6 tracking-wide">
            © 2024 N & W Fashion. All rights reserved.
          </p>
        </div>
      </div>

      {/* --- MARQUEE BAWAH ( Bergerak Ke Kanan ) --- */}
      <div className="w-full h-[20vh] lg:h-[25vh] flex overflow-hidden border-t border-gray-200 bg-white">
        <div className="flex animate-marquee-right hover:pause whitespace-nowrap">
          {images.map((src, i) => (
            <div key={`bot1-${i}`} className="h-[20vh] lg:h-[25vh] w-[250px] lg:w-[300px] flex-shrink-0 relative group overflow-hidden">
              <img src={src} alt="fashion" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          ))}
          {images.map((src, i) => (
            <div key={`bot2-${i}`} className="h-[20vh] lg:h-[25vh] w-[250px] lg:w-[300px] flex-shrink-0 relative group overflow-hidden">
              <img src={src} alt="fashion" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}