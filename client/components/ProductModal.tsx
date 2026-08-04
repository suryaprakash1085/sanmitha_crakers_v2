import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface Props { product: Product | null; onClose: () => void; }

export const ProductModal = ({ product, onClose }: Props) => {
  const { items, updateQty } = useCart();
  const qty = product ? items.find((i) => i.id === product.id)?.qty || 0 : 0;
  const setQty = (n: number) => product && updateQty(product.id, Math.max(0, n), product);

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] grid place-items-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative bg-background rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden pointer-events-auto"
            >
              <div className="absolute inset-0 opacity-60 pointer-events-none">
              </div>
              <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur grid place-items-center hover:bg-white z-10 shadow-soft">
                <X className="w-5 h-5" />
              </button>
              <div className="grid md:grid-cols-2 gap-6 p-8 relative z-[1]">
                <div className="relative h-72 md:h-80 grid place-items-center rounded-2xl bg-gradient-to-br from-secondary/40 to-primary/10 overflow-hidden">
                  {product.badge && <span className="glow-badge absolute top-4 left-4">{product.badge}</span>}
                  <motion.img
                    src={product.image} alt={product.name}
                    initial={{ scale: 0.7, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="h-64 object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{product.category}</span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{product.name}</h2>
                  <p className="text-muted-foreground mb-5">
                    Premium quality {product.category.toLowerCase()} crafted for a safe & spectacular Diwali. Light up the sky with vibrant colours and unforgettable bursts.
                  </p>
                  <div className="font-display font-bold text-4xl text-gradient-festive mb-6">₹{product.price}</div>
                  <div className="flex items-center gap-1 rounded-xl border border-primary/20 bg-primary/5 p-1 w-fit">
                    <button
                      type="button"
                      onClick={() => setQty(qty - 1)}
                      disabled={qty === 0}
                      className="w-10 h-10 rounded-lg grid place-items-center bg-white hover:bg-primary/10 disabled:opacity-30 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={qty}
                      onChange={(e) => setQty(+e.target.value || 0)}
                      className="w-16 h-10 text-center text-base font-semibold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 rounded-lg grid place-items-center bg-white hover:bg-primary/10 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
