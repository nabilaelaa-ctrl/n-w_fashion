import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return NextResponse.json({ error: "Password salah" }, { status: 401 })

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  )

  const response = NextResponse.json({ message: "Login success", role: user.role })
  
  // Set Cookies
  response.cookies.set('token', token, { httpOnly: true, secure: true, maxAge: 86400 })
  response.cookies.set('role', user.role, { httpOnly: false, secure: true, maxAge: 86400 })
  
  // TAMBAHKAN INI: Simpan nama ke cookie agar bisa dibaca oleh Navbar
  response.cookies.set('name', user.name, { httpOnly: false, secure: true, maxAge: 86400 })

  return response
}