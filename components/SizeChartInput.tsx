"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { createPortal } from "react-dom";

// ==========================================
// 1. KOMPONEN BARIS TABEL (TERPISAH)
// Menggunakan 'memo' agar tidak re-render semua baris saat salah satu diubah
// ==========================================
const TableRow = memo(({ 
  row, 
  rowIndex, 
  headers, 
  onUpdateLabel, 
  onUpdateValue, 
  onRemoveRow 
}: { 
  row: { label: string; values: string[] };
  rowIndex: number;
  headers: string[];
  onUpdateLabel: (i: number, v: string) => void;
  onUpdateValue: (r: number, c: number, v: string) => void;
  onRemoveRow: (i: number) => void;
}) => {
  return (
    <tr className="group hover:bg-rose-50/30 transition-colors">
      {/* Kolom Label */}
      <td className="border-r border-gray-100 p-0 bg-white">
        <input
          type="text"
          className="w-full p-4 bg-transparent outline-none focus:bg-rose-50 font-semibold text-gray-700 placeholder:text-gray-300"
          placeholder="cth: S / M / L"
          value={row.label}
          onChange={(e) => onUpdateLabel(rowIndex, e.target.value)}
        />
      </td>

      {/* Kolom Nilai Dinamis */}
      {row.values.map((val, cIdx) => (
        <td key={cIdx} className="border-r border-gray-100 p-0 bg-white">
          <input
            type="text"
            className="w-full p-4 bg-transparent outline-none focus:bg-rose-50 text-center font-mono text-gray-600 placeholder:text-gray-300"
            placeholder="-"
            value={val}
            onChange={(e) => onUpdateValue(rowIndex, cIdx, e.target.value)}
          />
        </td>
      ))}

      {/* Kolom Aksi */}
      <td className="text-center p-2 bg-white w-16 sticky right-0 group-hover:bg-rose-50/30">
        <button
          type="button"
          onClick={() => onRemoveRow(rowIndex)}
          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          title="Hapus Baris"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
});

TableRow.displayName = 'TableRow'; // Untuk keperluan debugging React

// ==========================================
// 2. KOMPONEN UTAMA
// ==========================================
export default function SizeChartInput({ initialData }: { initialData?: string | object | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  // Parsing data awal (hanya sekali)
  const initialParsed = useMemo(() => {
    try {
      if (!initialData) return { headers: [], rows: [] };
      if (typeof initialData === 'object') return initialData;
      return JSON.parse(initialData);
    } catch (e) {
      return { headers: [], rows: [] };
    }
  }, [initialData]);

  const [headers, setHeaders] = useState<string[]>(initialParsed.headers || []);
  const [rows, setRows] = useState<{ label: string; values: string[] }[]>(initialParsed.rows || []);

  useEffect(() => { setMounted(true); }, []);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  // --- LOGIKA DATA ---

  const addRow = useCallback(() => {
    setRows(prev => [...prev, { label: "", values: Array(headers.length).fill("") }]);
  }, [headers.length]);

  const removeRow = useCallback((index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddColumn = useCallback(() => {
    const name = newColumnName.trim();
    if (name === "") return;
    setHeaders(prev => [...prev, name]);
    setRows(prev => prev.map(r => ({ ...r, values: [...r.values, ""] })));
    setNewColumnName("");
  }, [newColumnName]);

  const removeColumn = useCallback((index: number) => {
    setHeaders(prev => prev.filter((_, i) => i !== index));
    setRows(prev => prev.map(r => ({
      ...r,
      values: r.values.filter((_, i) => i !== index)
    })));
  }, []);

  // Fungsi Update yang stabil
  const updateLabel = useCallback((index: number, value: string) => {
    setRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], label: value };
      return next;
    });
  }, []);

  const updateValue = useCallback((rowIndex: number, colIndex: number, value: string) => {
    setRows(prev => {
      const next = [...prev];
      const row = { ...next[rowIndex] };
      const values = [...row.values];
      values[colIndex] = value;
      row.values = values;
      next[rowIndex] = row;
      return next;
    });
  }, []);

  const totalData = rows.filter(r => r.label || r.values.some(v => v)).length;

  // --- RENDER MODAL ---
  const Modal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-100 overflow-hidden relative">
        
        {/* Decorative Blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-40 z-0"></div>
        
        {/* HEADER */}
        <div className="relative z-10 p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              📐 Pengaturan Size Chart
            </h3>
            <p className="text-sm text-gray-400 mt-1">Tambahkan detail ukuran produk.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div className="relative z-10 p-6 overflow-auto flex-grow bg-white">
          
          {/* Input Kolom Baru */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Nama kolom baru (cth: Panjang Lengan)"
              className="flex-grow w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all bg-white"
              onKeyDown={(e) => e.key === '' && (e.preventDefault(), handleAddColumn())}
            />
            <button
              type="button"
              onClick={handleAddColumn}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Kolom
            </button>
          </div>

          {/* TABEL */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[500px]">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-3 border-b border-r border-gray-200 w-44 text-left font-bold">Label Ukuran</th>
                    
                    {headers.map((h, i) => (
                      <th key={i} className="p-3 border-b border-r border-gray-200 relative group text-center font-bold">
                        <span className="block truncate pr-4">{h}</span>
                        <button 
                          type="button"
                          onClick={() => removeColumn(i)} 
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus Kolom"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </th>
                    ))}
                    
                    <th className="p-3 border-b border-gray-200 w-16 bg-gray-50">
                      <span className="text-gray-300">Aksi</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Gunakan Komponen TableRow di sini */}
                  {rows.map((row, rIdx) => (
                    <TableRow
                      key={rIdx}
                      row={row}
                      rowIndex={rIdx}
                      headers={headers}
                      onUpdateLabel={updateLabel}
                      onUpdateValue={updateValue}
                      onRemoveRow={removeRow}
                    />
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={headers.length + 2} className="text-center py-12 text-gray-400 bg-gray-50/50">
                        <div className="flex flex-col items-center gap-2">
                          <span>Belum ada data ukuran.</span>
                          <span className="text-xs">Klik tombol di bawah untuk menambah baris.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50/50 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Baris Ukuran
          </button>
        </div>

        {/* FOOTER */}
        <div className="relative z-10 p-5 border-t border-gray-100 bg-gray-50 rounded-b-3xl shrink-0 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            {headers.length > 0 ? `${headers.length} Kolom, ${rows.length} Baris` : 'Tabel kosong'}
          </p>
          <input type="hidden" name="sizeChart" value={JSON.stringify({ headers, rows })} />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-8 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-rose-200 transition-all font-semibold text-sm active:scale-95"
          >
            Selesai & Simpan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* TOMBOL TRIGGER */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 w-full p-3 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50/50 transition-all flex items-center justify-center gap-2 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        {totalData > 0 ? `Edit Tabel Ukuran (${totalData})` : "Tambah Tabel Ukuran"}
      </button>

      {/* RENDER MODAL VIA PORTAL */}
      {mounted && isOpen && createPortal(<Modal />, document.body)}
    </>
  );
}