import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

// --- KOMPONEN IKON ---
const Icons = {
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  ban: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  ),
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
  )
}

// --- SERVER ACTIONS ---

// Action untuk Mengubah Role (Admin <-> User)
async function toggleRole(formData: FormData) {
  'use server'
  const userId = formData.get('userId') as string
  const currentRole = formData.get('currentRole') as string

  if (!userId) return

  const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })
  } catch (error) {
    console.error("Gagal mengubah role:", error)
  }

  revalidatePath('/admin/users')
}

// Action untuk Suspend/Unsuspend User
async function toggleSuspend(formData: FormData) {
  'use server'
  const userId = formData.get('userId') as string
  const isSuspended = formData.get('isSuspended') === 'true'

  if (!userId) return

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: !isSuspended }
    })
  } catch (error) {
    console.error("Gagal mengubah status suspend:", error)
  }

  revalidatePath('/admin/users')
}

// --- HALAMAN UTAMA ---
export default async function AdminUsersPage() {
  // Ambil semua user, urutkan dari terbaru
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Statistik
  const totalUsers = users.length
  const adminCount = users.filter(u => u.role === 'ADMIN').length
  const suspendedCount = users.filter(u => u.isSuspended).length

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-lg bg-white border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors">
            {Icons.back}
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Manajemen Pengguna</h1>
            <p className="text-gray-400 mt-1">Kelola peran dan status akun pengguna.</p>
          </div>
        </div>
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Total Pengguna</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              {Icons.users}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Administrator</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{adminCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              {Icons.shield}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Akun Disuspend</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{suspendedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              {Icons.ban}
            </div>
          </div>
        </div>
      </div>

      {/* TABEL PENGGUNA */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Daftar Pengguna</h3>
          <p className="text-sm text-gray-400">Daftar semua pengguna yang terdaftar di sistem.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-5">Pengguna</th>
                <th className="p-5">Role</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-center">Terdaftar</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors align-middle">
                  
                  {/* Info User */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden border">
                        <span>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name || 'Tanpa Nama'}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-5 text-center">
                    {user.isSuspended ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Suspended</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Aktif</span>
                    )}
                  </td>

                  {/* Tanggal Daftar */}
                  <td className="p-5 text-center text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Tombol Aksi */}
                  <td className="p-5 text-right space-x-2">
                    
                    {/* Tombol Ganti Role */}
                    <form action={toggleRole} className="inline-block">
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="currentRole" value={user.role} />
                      <button 
                        type="submit"
                        title={user.role === 'ADMIN' ? 'Turunkan jadi User' : 'Jadikan Admin'}
                        className={`p-2 rounded-lg transition-colors ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-500 hover:bg-purple-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                      >
                        {Icons.shield}
                      </button>
                    </form>

                    {/* Tombol Suspend */}
                    <form action={toggleSuspend} className="inline-block">
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="isSuspended" value={String(user.isSuspended)} />
                      <button 
                        type="submit"
                        title={user.isSuspended ? 'Aktifkan Kembali' : 'Suspend Akun'}
                        className={`p-2 rounded-lg transition-colors ${user.isSuspended ? 'bg-green-50 text-green-500 hover:bg-green-100' : 'bg-red-50 text-red-400 hover:bg-red-100'}`}
                      >
                        {user.isSuspended ? Icons.check : Icons.ban}
                      </button>
                    </form>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-16 bg-gray-50/50">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              {Icons.users}
            </div>
            <h3 className="text-lg font-bold text-gray-700">Belum Ada Pengguna</h3>
            <p className="text-sm text-gray-400">Pengguna akan muncul di sini setelah mendaftar.</p>
          </div>
        )}
      </div>
    </div>
  )
}