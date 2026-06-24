import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { name, slug, description } = body

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name, slug, description }
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update kategori' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus kategori' }, { status: 500 })
  }
}