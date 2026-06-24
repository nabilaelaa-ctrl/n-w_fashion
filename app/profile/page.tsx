import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'
import Link from 'next/link'

// Pastikan path import ProfileClient Anda benar. 
// Jika file ProfileClient.tsx ada di dalam folder yang sama (app/profile/), gunakan:
import ProfileClient from '@/components/ProfileClient'

// Jika ada di folder components, gunakan: import ProfileClient from '@/components/ProfileClient'

export default async function ProfilePage() {
  // 1. Autentikasi
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) redirect('/login')

  let userId = ''
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia_super_kuat_123')
    const { payload } = await jwtVerify(token, secret)
    userId = payload.id as string
  } catch (error) {
    redirect('/login')
  }

  // 2. Ambil Data User
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) redirect('/login')

  // 3. Server Action untuk Update
  async function updateProfile(formData: FormData) {
    "use server"
    
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const savedAddresses = formData.get('savedAddresses') as string // <-- PENTING: Tangkap multi-alamat
    const newPassword = formData.get('password') as string
    const file = formData.get('image') as File | null

    let updateData: any = { name }

    // Simpan Alamat Biasa (Fallback)
    if (address) updateData.address = address

    // Handle Multi-Alamat (Format JSON)
    if (savedAddresses) {
      try {
        updateData.savedAddresses = JSON.parse(savedAddresses)
      } catch (e) {
        console.error("Gagal parse savedAddresses JSON")
      }
    }

    // Handle Upload Foto Baru
    if (file && file.size > 0) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const ext = file.name.split('.').pop()
        const filename = `user_${userId}_${Date.now()}.${ext}`
        
        const uploadDir = path.join(process.cwd(), 'public/uploads')
        await mkdir(uploadDir, { recursive: true }).catch(() => {})
        
        const filePath = path.join(uploadDir, filename)
        await writeFile(filePath, buffer)
        
        updateData.image = '/uploads/' + filename
      } catch (error) {
        console.error("Gagal upload foto:", error)
      }
    }

    // Handle Password Baru
    if (newPassword && newPassword.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      updateData.password = hashedPassword
    }

    // Simpan ke DB
    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    // Update Cookie Nama agar Navbar berubah
    const cookieStore = await cookies()
    cookieStore.set('name', name, { httpOnly: false, secure: true, maxAge: 86400 })

    revalidatePath('/profile')
    revalidatePath('/')
    revalidatePath('/checkout') // Refresh halaman checkout agar alamat baru muncul
    
    // PENTING: Redirect untuk menutup modal dan refresh data
    redirect('/profile')
  }

  return (
    <div className="min-h-screen bg-rose-50/30 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mb-6 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-rose-500 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Akun Saya</h1>
          <p className="text-sm text-gray-400">Kelola profil, daftar alamat, dan keamanan akun Anda.</p>
        </div>
      </div>
      
      {/* Render Komponen Klien */}
      <ProfileClient user={user} updateAction={updateProfile} />

    </div>
  )
}