import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia_super_kuat_123');
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: { name: true, savedAddresses: true, address: true }
    });

    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    // Pastikan savedAddresses selalu dikirim dalam bentuk ARRAY (bukan string)
    let parsedAddresses =[];
    
    if (user.savedAddresses) {
      if (typeof user.savedAddresses === 'string') {
        try { parsedAddresses = JSON.parse(user.savedAddresses); } catch (e) {}
      } else if (Array.isArray(user.savedAddresses)) {
        // Jika dari Prisma sudah berupa Array, langsung gunakan
        parsedAddresses = user.savedAddresses;
      }
    }

    return NextResponse.json({
      name: user.name,
      address: user.address, // Alamat fallback
      savedAddresses: parsedAddresses // Ini pasti Array sekarang
    });

  } catch (error) {
    console.error("Error User API:", error);
    return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 });
  }
}