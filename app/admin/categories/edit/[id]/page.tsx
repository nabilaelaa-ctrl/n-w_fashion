import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const categoryId = resolvedParams.id

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })

  if (!category) return redirect('/admin/categories')

  async function updateCategory(formData: FormData) {
    "use server"
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const desc = formData.get('desc') as string
    const icon = formData.get('icon') as string

    await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug, desc, icon }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    redirect('/admin/categories')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Kategori</h1>
        <Link href="/admin/categories" className="text-sm bg-gray-100 px-4 py-2 rounded-lg font-bold hover:bg-gray-200">Batal</Link>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <form action={updateCategory} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Kategori</label>
            <input required type="text" name="name" defaultValue={category.name} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug URL</label>
            <input required type="text" name="slug" defaultValue={category.slug} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kode SVG Ikon</label>
            <textarea name="icon" defaultValue={category.icon || ''} rows={4} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-mono text-[10px]"></textarea>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi</label>
            <textarea name="desc" defaultValue={category.desc || ''} rows={3} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200"></textarea>
          </div>
          <button type="submit" className="w-full bg-rose-500 text-white font-bold py-3.5 rounded-xl hover:bg-rose-600 transition-all">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  )
}