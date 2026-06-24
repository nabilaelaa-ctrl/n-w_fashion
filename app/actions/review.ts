"use server"

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

// ========================================================
// 1. ACTIONS UNTUK PEMBELI (USER)
// ========================================================

// Fungsi Pembeli: Mengirim Ulasan Baru dari halaman Pesanan Saya
export async function submitReviewAction(orderItemId: string, productId: string, rating: number, comment: string) {
  try {
    // Verifikasi identitas pembeli via Token
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return { error: "Silakan login terlebih dahulu." }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia_super_kuat_123')
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.id as string

    // Simpan ulasan ke database
    await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId,
        orderItemId
      }
    })

    // Refresh halaman agar ulasan langsung muncul di UI pembeli
    revalidatePath('/orders')
    revalidatePath(`/product/${productId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Gagal menyimpan ulasan:", error)
    return { error: "Gagal menyimpan ulasan. Mungkin Anda sudah mengulas produk ini." }
  }
}

// ========================================================
// 2. ACTIONS UNTUK ADMIN
// ========================================================

// Fungsi Admin: Menghapus Ulasan Pembeli
export async function deleteReview(formData: FormData) {
  const id = formData.get('reviewId') as string
  if (!id) return
  
  try {
    const deletedReview = await prisma.review.delete({ where: { id } })
    
    revalidatePath(`/product/${deletedReview.productId}`)
    revalidatePath('/admin/reviews')
  } catch (e) { 
    console.error(e) 
  }
}

// Fungsi Admin: Membalas Ulasan Pembeli
export async function replyToReview(formData: FormData) {
  const reviewId = formData.get('reviewId') as string
  const replyText = formData.get('replyText') as string
  if (!reviewId) return

  try {
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        adminReply: replyText || null,
        adminRepliedAt: replyText ? new Date() : null
      }
    })
    
    revalidatePath(`/product/${updatedReview.productId}`)
    revalidatePath('/admin/reviews')
  } catch (e) { 
    console.error(e) 
  }
}

// Fungsi Admin: Menghapus Balasan Ulasan
export async function deleteReply(formData: FormData) {
  const reviewId = formData.get('reviewId') as string
  if (!reviewId) return
  
  try {
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { adminReply: null, adminRepliedAt: null }
    })
    
    revalidatePath(`/product/${updatedReview.productId}`)
    revalidatePath('/admin/reviews')
  } catch (e) { 
    console.error(e) 
  }
}