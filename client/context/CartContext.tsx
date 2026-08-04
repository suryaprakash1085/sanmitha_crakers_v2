import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem extends Product { qty: number; }

// Minimum order amount, configured via .env (VITE_MIN_ORDER_AMOUNT).
// Falls back to 0 (no minimum) if not set or invalid.
export const MIN_ORDER_AMOUNT = (() => {
  const raw = import.meta.env.VITE_MIN_ORDER_AMOUNT;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
})();

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Product) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number, product?: Product) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  minOrderAmount: number;
  meetsMinOrder: boolean;
}

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("fc_cart") || "[]"); } catch { return []; }
  });
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("fc_cart", JSON.stringify(items));
  }, [items]);

  const add = (p: Product) => {
    setItems(prev => {
      const f = prev.find(i => i.id === p.id);
      if (f) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: string, qty: number, product?: Product) =>
    setItems(prev => {
      if (qty <= 0) return prev.filter(i => i.id !== id);
      const exists = prev.some(i => i.id === id);
      if (exists) return prev.map(i => i.id === id ? { ...i, qty } : i);
      // Not in cart yet — insert it directly at the given qty (e.g. typed into
      // the qty input on the product card, without going through add()).
      if (product) return [...prev, { ...product, qty }];
      return prev;
    });
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const meetsMinOrder = total >= MIN_ORDER_AMOUNT;

  return (
    <Ctx.Provider value={{ items, count, total, add, remove, updateQty, clear, isOpen, setOpen, minOrderAmount: MIN_ORDER_AMOUNT, meetsMinOrder }}>
      {children}
    </Ctx.Provider>
  );
};

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
};
