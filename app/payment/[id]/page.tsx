import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const orderId = resolvedParams.id

  // 1. Ambil data Order dan Semua Rekening Aktif
  const [order, accounts] = await Promise.all([
    prisma.order.findUnique({ where: { id: orderId } }),
    prisma.bankAccount.findMany({ orderBy: { createdAt: 'desc' } }) // Mengambil dari tabel BankAccount
  ])

  if (!order) return notFound()

  // Jika sudah bayar atau COD, langsung lempar ke success
  if (order.paymentProof || order.paymentMethod === 'COD') {
    redirect('/success')
  }

  // Filter rekening berdasarkan metode pembayaran order
  const filteredAccounts = accounts.filter(acc => {
    if (order.paymentMethod === 'TRANSFER_BANK' && acc.type === 'BANK') return true
    if (order.paymentMethod === 'E_WALLET' && acc.type === 'EWALLET') return true
    return false
  })

  // SERVER ACTION: Upload Bukti Bayar
  async function uploadProof(formData: FormData) {
    "use server"
    const file = formData.get('proof') as File

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split('.').pop()
      const filename = `proof_${orderId}_${Date.now()}.${ext}`
      
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      await mkdir(uploadDir, { recursive: true }).catch(() => {})
      
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)
      
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentProof: `/uploads/${filename}` }
      })

      revalidatePath('/admin/orders')
      redirect('/success')
    }
  }

  return (
    <div className="min-h-[80vh] bg-slate-50/50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-center text-white">
          <h1 className="text-2xl font-bold mb-1">Selesaikan Pembayaran</h1>
          <p className="text-rose-100 text-sm">Order ID: {order.id.split('-')[0].toUpperCase()}</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-2">Total Tagihan Anda:</p>
            <p className="text-4xl font-black text-rose-600">Rp {order.total.toLocaleString('id-ID')}</p>
          </div>

          {/* Detail Rekening Dinamis */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-lg">{order.paymentMethod === 'TRANSFER_BANK' ? '🏦' : '📱'}</span>
              Kirim ke Salah Satu Rekening Berikut:
            </h3>
            
            {filteredAccounts.length === 0 ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-red-500 text-sm font-medium">
                   Maaf, Admin belum menambahkan rekening untuk metode pembayaran ini.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAccounts.map((acc) => (
                  <div 
                    key={acc.id} 
                    className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-rose-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{acc.bankName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${acc.type === 'BANK' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {acc.type === 'BANK' ? 'Transfer Bank' : 'E-Wallet'}
                      </span>
                    </div>
                    <p className="font-mono text-lg font-bold text-gray-900 tracking-wide">
                      {acc.accountNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      a.n. <span className="font-medium">{acc.accountName || '-'}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Upload Bukti */}
          <form action={uploadProof} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Bukti Transfer</label>
              <div className="border-2 border-dashed border-rose-300 rounded-2xl p-4 bg-rose-50/30 text-center hover:bg-rose-50 transition-colors cursor-pointer relative">
                <input required type="file" name="proof" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span className="text-sm font-semibold text-rose-600">Klik untuk pilih gambar</span>
                  <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG (Maks 5MB)</p>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95">
              Kirim Bukti Pembayaran
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}