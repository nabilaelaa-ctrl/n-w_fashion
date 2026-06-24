import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Sesi habis, silakan login ulang." }, { status: 401 });
    }

    // Gunakan fallback secret jika di .env lupa belum diatur
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia_super_kuat_123');
    const { payload } = await jwtVerify(token, secret);

    const body = await req.json();
    const { receiverName, address, phone, items, total, paymentMethod } = body;

    // Validasi pencegahan data kosong
    if (!receiverName || !address || !phone || items.length === 0) {
      return NextResponse.json({ error: "Harap isi semua form dengan lengkap!" }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: payload.id as string,
          receiverName,
          address,
          phone,
          total,
          paymentMethod,
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.qty,
              price: item.price,
              color: item.color || "-", // <-- Tambahan
              size: item.size || "-"    // <-- Tambahan
            }))
          }
        }
      });

      // Kurangi stok
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.qty } }
        });
      }

      return newOrder;
    });

    return NextResponse.json({ message: "Checkout berhasil", orderId: order.id }, { status: 201 });
    
  } catch (error: any) {
    // Tampilkan log merah spesifik di terminal VS Code Anda
    console.error("❌ BACA ERROR INI >>>", error);
    
    // Kirimkan pesan error aslinya ke layar komputer (Toast merah)
    return NextResponse.json({ error: error.message || "Terjadi kesalahan koneksi Database." }, { status: 500 });
  }
}