import prisma from '@/lib/prisma'
import Link from 'next/link'
import ReportCharts from '@/components/ReportCharts' // Import komponen baru

// --- KOMPONEN IKON (Hanya yang dipakai di page) ---
const Icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
  ),
  money: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  chart: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  ),
  box: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  )
}

export default async function AdminReportsPage() {
  // 1. Ambil data pesanan yang sudah selesai (SELESAI)
  const completedOrders = await prisma.order.findMany({
    where: { status: 'SELESAI' },
    include: {
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  // 2. Hitung Total Omzet
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0)

  // 3. Proses Data untuk Grafik (6 Bulan Terakhir)
  const monthlyData: Record<string, { name: string; total: number }> = {}
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthName = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' })
    monthlyData[monthName] = { name: monthName, total: 0 }
  }

  completedOrders.forEach(order => {
    const monthName = new Date(order.createdAt).toLocaleString('id-ID', { month: 'short', year: '2-digit' })
    if (monthlyData[monthName]) {
      monthlyData[monthName].total += order.total
    }
  })

  const chartData = Object.values(monthlyData)

  // 4. Hitung Produk Terlaris & Paling Sedikit
  const productSales: Record<string, { name: string; totalSold: number }> = {}

  completedOrders.forEach(order => {
    order.orderItems.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { 
          name: item.product.name, 
          totalSold: 0 
        }
      }
      productSales[item.productId].totalSold += item.quantity
    })
  })

  const sortedProducts = Object.values(productSales).sort((a, b) => b.totalSold - a.totalSold)
  const topProducts = sortedProducts.slice(0, 5)
  const lowProducts = sortedProducts.slice(-5).reverse()
  const totalSold = sortedProducts.reduce((a, b) => a + b.totalSold, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-lg bg-white border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors">
            {Icons.back}
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Laporan Penjualan</h1>
            <p className="text-gray-400 mt-1">Analisis performa penjualan toko.</p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Total Omzet (Selesai)</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">Rp {totalRevenue.toLocaleString('id-ID')}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
              {Icons.money}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Total Transaksi Selesai</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{completedOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              {Icons.chart}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Produk Terjual</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalSold}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              {Icons.box}
            </div>
          </div>
        </div>
      </div>

      {/* RENDER GRAFIK (Komponen Client) */}
      <ReportCharts 
        chartData={chartData} 
        topProducts={topProducts} 
        lowProducts={lowProducts} 
      />
      
    </div>
  )
}