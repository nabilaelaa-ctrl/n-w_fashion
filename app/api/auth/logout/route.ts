import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" })
  
  response.cookies.set('token', '', { httpOnly: true, secure: true, maxAge: 0 })
  response.cookies.set('role', '', { httpOnly: false, secure: true, maxAge: 0 })
  
  // TAMBAHKAN INI: Hapus cookie name
  response.cookies.set('name', '', { httpOnly: false, secure: true, maxAge: 0 })

  return response
}