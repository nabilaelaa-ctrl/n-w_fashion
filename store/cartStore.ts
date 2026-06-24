import { create } from 'zustand'

type CartItem = {
  cartItemId: string; // <-- Gabungan (id-warna-ukuran)
  id: string; 
  name: string; 
  price: number; 
  image: string; 
  qty: number; 
  stock: number;
  selected: boolean;
  color: string; // <-- Tambahan
  size: string;  // <-- Tambahan
}

type CartState = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  toggleSelect: (cartItemId: string) => void;
  toggleSelectAll: (status: boolean) => void;
  removeSelectedFromCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items:[],
  addToCart: (item) => set((state) => {
    const existing = state.items.find(i => i.cartItemId === item.cartItemId)
    if (existing) {
      if (existing.qty >= existing.stock) return state;
      return { items: state.items.map(i => i.cartItemId === item.cartItemId ? { ...i, qty: i.qty + 1 } : i) }
    }
    return { items: [...state.items, { ...item, qty: 1, selected: true }] }
  }),
  removeFromCart: (cartItemId) => set((state) => ({ items: state.items.filter(i => i.cartItemId !== cartItemId) })),
  updateQuantity: (cartItemId, qty) => set((state) => ({
    items: state.items.map(i => {
      if (i.cartItemId === cartItemId) {
        const newQty = Math.max(1, Math.min(qty, i.stock));
        return { ...i, qty: newQty };
      }
      return i;
    })
  })),
  toggleSelect: (cartItemId) => set((state) => ({
    items: state.items.map(i => i.cartItemId === cartItemId ? { ...i, selected: !i.selected } : i)
  })),
  toggleSelectAll: (status) => set((state) => ({
    items: state.items.map(i => ({ ...i, selected: status }))
  })),
  removeSelectedFromCart: () => set((state) => ({
    items: state.items.filter(i => !i.selected)
  })),
  clearCart: () => set({ items:[] })
}))