import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, slug, description } = body

  try {
    const created = await prisma.category.create({
      data: { name, slug, description }
    })
    return NextResponse.json(created)
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah kategori' }, { status: 500 })
  }
}