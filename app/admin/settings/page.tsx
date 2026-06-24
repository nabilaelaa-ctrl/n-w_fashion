import BankAccountManager from '@/components/admin/BankAccountManager'
import { Toaster } from 'react-hot-toast'

export default async function AdminSettingsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-100 rounded-full blur-[120px] opacity-40 -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100 rounded-full blur-[100px] opacity-40 -z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 py-8 px-4">
        <Toaster position="top-center" />
        
        <div className="text-center md:text-left mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center md:justify-start gap-3">
            Pengaturan Keuangan 
            <span className="text-3xl">💳</span>
          </h1>
          <p className="text-gray-400 mt-2">Kelola rekening bank dan e-wallet toko Anda.</p>
        </div>

        <BankAccountManager />
        
      </div>
    </div>
  )
}