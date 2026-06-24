import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Protected Routes
  const isProtected = pathname.startsWith('/cart') || pathname.startsWith('/checkout') || pathname.startsWith('/admin')

  if (isProtected) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url))

    try {
      // Decode JWT menggunakan jose (karena Next.js Middleware = Edge Runtime)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)

      // Cek Role Admin
      if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      // Token invalid / expired
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher:['/cart', '/checkout', '/admin/:path*'],
}