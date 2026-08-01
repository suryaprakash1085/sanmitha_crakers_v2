import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { SparkButton } from "./SparkButton";

export const CartDrawer = () => {
  const { items, isOpen, setOpen, updateQty, remove, total } = useCart();
  const navigate = useNavigate();

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-background z-[101] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl">Your Cart</h2>
              </div>
              <button onClick={() => setOpen(false)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-primary/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  Your cart is empty
                </div>
              ) : items.map(i => (
                <div key={i.id} className="glass-card rounded-2xl p-3 flex gap-3 items-center">
                  <img src={i.image} alt={i.name} className="w-16 h-16 object-contain rounded-xl bg-secondary/30" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{i.name}</div>
                    <div className="text-xs text-muted-foreground">₹{i.price}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(i.id, i.qty - 1)} className="w-6 h-6 rounded-full bg-primary/10 grid place-items-center hover:bg-primary/20"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-semibold w-5 text-center">{i.qty}</span>
                      <button onClick={() => updateQty(i.id, i.qty + 1)} className="w-6 h-6 rounded-full bg-primary/10 grid place-items-center hover:bg-primary/20"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-gradient-festive font-display text-xl">₹{total}</span>
                </div>
                <SparkButton className="w-full justify-center" onClick={() => { setOpen(false); navigate("/checkout"); }}>
                  Checkout
                </SparkButton>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  );
};
