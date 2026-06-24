import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    return NextResponse.json({ message: "User created" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
  }
}