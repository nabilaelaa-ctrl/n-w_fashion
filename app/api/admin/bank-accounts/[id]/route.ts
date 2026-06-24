import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// PUT: Edit Rekening
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = await prisma.bankAccount.update({
      where: { id },
      data: body
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 })
  }
}

// DELETE: Hapus Rekening
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.bankAccount.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 })
  }
}