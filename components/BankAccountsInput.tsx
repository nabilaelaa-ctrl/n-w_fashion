"use client";
import { useState, useEffect } from "react";

type BankAccount = {
  bank: string;
  number: string;
  name: string;
};

export default function BankAccountsInput({ initialData }: { initialData?: any }) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  // Parse initial data
  useEffect(() => {
    try {
      if (initialData) {
        const parsed = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
        if (Array.isArray(parsed)) setAccounts(parsed);
      }
    } catch (e) {
      console.error("Failed to parse bank accounts", e);
    }
  }, [initialData]);

  const addAccount = () => {
    setAccounts([...accounts, { bank: "", number: "", name: "" }]);
  };

  const removeAccount = (index: number) => {
    setAccounts(accounts.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof BankAccount, value: string) => {
    const newAccounts = [...accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setAccounts(newAccounts);
  };

  return (
    <div className="space-y-4">
      {accounts.map((acc, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3 relative group">
          
          <button
            type="button"
            onClick={() => removeAccount(index)}
            className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Hapus
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Nama Bank</label>
              <input
                type="text"
                placeholder="BCA / Mandiri / BNI"
                value={acc.bank}
                onChange={(e) => handleChange(index, 'bank', e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">No. Rekening</label>
              <input
                type="text"
                placeholder="1234567890"
                value={acc.number}
                onChange={(e) => handleChange(index, 'number', e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Atas Nama</label>
              <input
                type="text"
                placeholder="John Doe"
                value={acc.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-white"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAccount}
        className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-rose-300 hover:text-rose-500 transition-all text-sm font-semibold"
      >
        + Tambah Rekening Baru
      </button>

      {/* Hidden input to send JSON string to Server Action */}
      <input type="hidden" name="bankAccounts" value={JSON.stringify(accounts)} />
    </div>
  );
}