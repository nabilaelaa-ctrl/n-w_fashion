import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET: Ambil semua rekening
export async function GET() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(accounts)
  } catch (e) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// POST: Tambah rekening baru
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bankName, accountName, accountNumber, type } = body

    if (!bankName || !accountNumber) {
      return NextResponse.json({ error: "Nama Bank dan Nomor Rekening wajib diisi" }, { status: 400 })
    }

    const newAccount = await prisma.bankAccount.create({
      data: { bankName, accountName, accountNumber, type: type || 'BANK' }
    })

    return NextResponse.json(newAccount)
  } catch (e) {
    return NextResponse.json({ error: "Gagal menambah data" }, { status: 500 })
  }
}