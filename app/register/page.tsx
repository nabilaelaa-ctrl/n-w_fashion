"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

// --- Komponen Ikon ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

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

const LogoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // State untuk visibilitas password
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      if (res.ok) {
        toast.success("Akun berhasil dibuat!")
        router.push('/login')
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || "Gagal membuat akun.")
      }
    } catch (error) {
      toast.error("Server error.")
    } finally {
      setIsLoading(false)
    }
  }

  // Data Gambar
  const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  ]

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-rose-50 to-pink-100 overflow-hidden relative font-sans">
      
      {/* --- CSS ANIMATION --- */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .orbit-spin { animation: spin-slow 30s linear infinite; }
        .orbit-spin-reverse { animation: spin-reverse 25s linear infinite; }
        
        /* Counter-rotation untuk membuat gambar tetap tegak */
        .counter-rotate {
          animation: spin-reverse 30s linear infinite; 
        }
        .counter-rotate-reverse {
          animation: spin-slow 25s linear infinite;
        }
      `}</style>

      {/* --- ORBIT LUAR (Radius Besar - Tidak mengganggu form) --- */}
      <div className="absolute w-[800px] h-[800px] hidden lg:flex items-center justify-center z-0 pointer-events-none">
        
        {/* Ring Visual */}
        <div className="absolute w-full h-full border border-dashed border-rose-200/40 rounded-full orbit-spin"></div>
        
        {/* Container yang berputar */}
        <div className="absolute w-full h-full orbit-spin">
            {/* Item 1 (Posisi Atas) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="counter-rotate transform hover:scale-110 transition-transform">
                    <div className="w-16 h-16 rounded-full bg-white p-1 shadow-xl border-4 border-rose-100 overflow-hidden">
                        <img src={images[0]} className="w-full h-full object-cover rounded-full" alt="fashion" />
                    </div>
                </div>
            </div>
            
            {/* Item 2 (Posisi Kanan) */}
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                <div className="counter-rotate transform hover:scale-110 transition-transform">
                    <div className="w-14 h-14 rounded-full bg-white p-1 shadow-xl border-4 border-purple-100 overflow-hidden flex items-center justify-center text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </div>
                </div>
            </div>

            {/* Item 3 (Posisi Bawah) */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="counter-rotate transform hover:scale-110 transition-transform">
                    <div className="w-16 h-16 rounded-full bg-white p-1 shadow-xl border-4 border-blue-100 overflow-hidden">
                        <img src={images[1]} className="w-full h-full object-cover rounded-full" alt="fashion" />
                    </div>
                </div>
            </div>

            {/* Item 4 (Posisi Kiri) */}
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="counter-rotate transform hover:scale-110 transition-transform">
                    <div className="w-14 h-14 rounded-full bg-white p-1 shadow-xl border-4 border-green-100 overflow-hidden flex items-center justify-center text-green-500">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- ORBIT DALAM (Radius Sedang - Berlawanan Arah) --- */}
      <div className="absolute w-[500px] h-[500px] hidden lg:flex items-center justify-center z-0 pointer-events-none">
        
        {/* Ring Visual */}
        <div className="absolute w-full h-full border border-dashed border-purple-200/30 rounded-full orbit-spin-reverse"></div>
        
        {/* Container yang berputar */}
        <div className="absolute w-full h-full orbit-spin-reverse">
             {/* Item 1 */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="counter-rotate-reverse">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
                        <img src={images[2]} className="w-full h-full object-cover" alt="fashion" />
                    </div>
                </div>
             </div>
             {/* Item 2 */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="counter-rotate-reverse">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
                        <img src={images[3]} className="w-full h-full object-cover" alt="fashion" />
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* --- FORM REGISTER (Center Floating) --- */}
      <div className="relative z-50 w-full max-w-md px-6 py-10">
        
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
            
            {/* Logo Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-400 rounded-2xl shadow-lg shadow-rose-300/50 mb-4 transform hover:rotate-6 transition-transform">
                    <LogoIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900">N & W Fashion</h1>
                <p className="text-gray-400 text-xs mt-1 tracking-widest uppercase">Create Account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Input Nama */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-rose-500 transition-colors">
                    <UserIcon />
                  </div>
                  <input 
                    type="text" required placeholder="Nama Lengkap"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white transition-all text-sm text-gray-700"
                    onChange={e => setName(e.target.value)} 
                  />
                </div>
              </div>

              {/* Input Email */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-rose-500 transition-colors">
                    <MailIcon />
                  </div>
                  <input 
                    type="email" required placeholder="Alamat Email"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white transition-all text-sm text-gray-700"
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>
              </div>
              
              {/* Input Password */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-rose-500 transition-colors">
                    <LockIcon />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required placeholder="Password (Min 6 karakter)" minLength={6}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white transition-all text-sm text-gray-700"
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
                className="w-full bg-slate-900 text-white p-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60 transition-all duration-300 shadow-lg mt-2"
              >
                {isLoading ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-bold text-rose-600 hover:underline">
                  Login di sini
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  )
}