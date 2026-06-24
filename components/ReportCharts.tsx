"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ChartData {
  name: string;
  total: number;
}

interface ProductData {
  name: string;
  totalSold: number;
}

interface ReportChartsProps {
  chartData: ChartData[];
  topProducts: ProductData[];
  lowProducts: ProductData[];
}

// Ikon SVG untuk Tooltip
const RupiahIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Komponen Custom Tooltip yang Lebih Menarik
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100 min-w-[150px] transform transition-all duration-300 scale-95 hover:scale-100">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-center text-rose-500 font-extrabold text-lg">
          <RupiahIcon />
          <span>{payload[0].value.toLocaleString('id-ID')}</span>
        </div>
        <p className="text-[10px] text-gray-300 mt-1">*Total Omzet Bulanan</p>
      </div>
    );
  }
  return null;
};

const Icons = {
  trendingUp: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
  ),
  trendingDown: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
  )
}

export default function ReportCharts({ chartData, topProducts, lowProducts }: ReportChartsProps) {
  // Hitung penjualan tertinggi untuk kalkulasi bar persentase
  const maxTopSales = topProducts.length > 0 ? topProducts[0].totalSold : 1;
  const maxLowSales = lowProducts.length > 0 ? lowProducts[0].totalSold : 1;

  return (
    <div className="grid grid-cols-1 gap-8">
      
      {/* GRAFIIK PENJUALAN - DENGAN STYLE BARU */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-50 to-transparent rounded-full blur-3xl -z-0 -mr-32 -mt-32 opacity-70"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Performa Omzet</h3>
              <p className="text-sm text-gray-400">Analisis pendapatan 6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              Live Data
            </div>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0.4}/>
                  </linearGradient>
                  <filter id="shadow" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  tickFormatter={(value) => `${value/1000}K`} 
                  axisLine={false} 
                  tickLine={false} 
                />
                
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }} // Warna highlight saat hover
                />
                
                <Bar 
                  dataKey="total" 
                  fill="url(#colorUv)" 
                  radius={[8, 8, 0, 0]} 
                  filter="url(#shadow)"
                  // Animasi bar muncul
                  animationBegin={0} 
                  animationDuration={800} 
                  animationEasing="ease-out"
                >
                  {/* Efek hover individual jika diperlukan */}
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PRODUK TERLARIS & KURANG LAKU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Produk Terlaris */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-200">
              {Icons.trendingUp}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Produk Terlaris</h3>
              <p className="text-xs text-gray-400">Top performing items</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={idx} className="group relative">
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-green-100 hover:bg-green-50/30 transition-all duration-300 z-10 relative">
                   <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-gray-700 text-sm truncate max-w-[120px] sm:max-w-none">{product.name}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600 bg-green-100/80 px-2.5 py-1 rounded-lg border border-green-100 group-hover:bg-green-100 transition-colors">
                    {product.totalSold} pcs
                  </span>
                </div>
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-0 h-full bg-green-100/40 rounded-xl transition-all duration-500" style={{ width: `${(product.totalSold / maxTopSales) * 100}%`, zIndex: 0 }}></div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">Belum ada data penjualan.</div>
            )}
          </div>
        </div>

        {/* Produk Kurang Lakik */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl text-white shadow-lg shadow-rose-200">
              {Icons.trendingDown}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Perlu Perhatian</h3>
              <p className="text-xs text-gray-400">Low performing items</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {lowProducts.map((product, idx) => (
              <div key={idx} className="group relative">
                 <div className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-red-100 hover:bg-red-50/30 transition-all duration-300 z-10 relative">
                   <div className="flex items-center gap-3">
                    <span className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    <span className="font-medium text-gray-700 text-sm truncate max-w-[120px] sm:max-w-none">{product.name}</span>
                  </div>
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 group-hover:bg-red-100 transition-colors">
                    {product.totalSold} pcs
                  </span>
                </div>
                 {/* Progress Bar Background (Sangat Pendek) */}
                 <div className="absolute left-0 top-0 h-full bg-red-100/40 rounded-xl transition-all duration-500" style={{ width: `${(product.totalSold / maxLowSales) * 100}%`, zIndex: 0 }}></div>
              </div>
            ))}
             {lowProducts.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">Belum ada data penjualan.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}