// app/api/admin/settings/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { bankName, bankAccount, bankHolder, ewalletName, ewalletNumber } = body

    // Simpan atau Update data di database
    const config = await prisma.siteConfig.upsert({
      where: { id: 'config' },
      update: {
        bankName,
        bankAccount,
        bankHolder,
        ewalletName,
        ewalletNumber
      },
      create: {
        id: 'config',
        bankName,
        bankAccount,
        bankHolder,
        ewalletName,
        ewalletNumber
      }
    })

    // Bersihkan cache halaman pembayaran agar data baru langsung update
    revalidatePath('/payment/[id]', 'page')
    revalidatePath('/admin/settings')

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error("Gagal menyimpan pengaturan:", error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}