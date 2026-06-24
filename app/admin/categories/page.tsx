import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation' // <--- Import redirect
import Link from 'next/link'
import CategoryClient from './CategoryClient'

// Ikon Header
const Icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
  )
}

// SERVER ACTION: Simpan / Update
async function saveCategory(formData: FormData) {
  "use server"
  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  if (!name || !slug) return

  if (id) {
    await prisma.category.update({ where: { id }, data: { name, slug, description } })
  } else {
    await prisma.category.create({ data: { name, slug, description } })
  }

  revalidatePath('/admin/categories')
  
  // TAMBAHKAN INI: Arahkan kembali ke halaman kategori setelah simpan
  redirect('/admin/categories') 
}

// SERVER ACTION: Hapus
async function deleteCategory(formData: FormData) {
  "use server"
  const id = formData.get('id') as string
  try {
    await prisma.category.delete({ where: { id } })
  } catch (error) {
    console.error("Gagal hapus:", error)
  }
  revalidatePath('/admin/categories')
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors">
            {Icons.back}
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Kategori Produk</h1>
            <p className="text-gray-400 text-sm">Kelola klasifikasi produk toko Anda.</p>
          </div>
        </div>
      </div>

      {/* Render Client Component */}
      <CategoryClient 
        initialCategories={categories} 
        saveAction={saveCategory} 
        deleteAction={deleteCategory} 
      />

    </div>
  )
}