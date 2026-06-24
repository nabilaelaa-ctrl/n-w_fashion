import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Buat Akun Admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@toko.com' },
    update: {},
    create: {
      name: 'Admin Toko',
      email: 'admin@toko.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // 2. Hapus produk lama (jika ada) agar tidak dobel
  await prisma.product.deleteMany()

  // 3. Masukkan Produk Baju Dummy beserta URL gambarnya
  await prisma.product.createMany({
    data:[
      { 
        name: 'Kemeja Flannel Pria', category: 'Pria', price: 150000, stock: 50,
        description: 'Kemeja kotak-kotak bahan halus dan nyaman dipakai seharian.', 
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80' 
      },
      { 
        name: 'Dress Floral Wanita', category: 'Wanita', price: 210000, stock: 30,
        description: 'Dress cantik dengan motif bunga, cocok untuk jalan-jalan atau pesta santai.', 
        image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&q=80' 
      },
      { 
        name: 'Kaos Polos Oversize', category: 'Unisex', price: 95000, stock: 100,
        description: 'Kaos oversize gaya Korea bahan katun bambu yang sangat sejuk.', 
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' 
      },
      { 
        name: 'Jaket Denim Klasik', category: 'Unisex', price: 350000, stock: 15,
        description: 'Jaket bahan denim tebal berkualitas tinggi dengan potongan klasik.', 
        image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80' 
      }
    ]
  })
  console.log("✅ Data Dummy Berhasil Ditambahkan!")
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })