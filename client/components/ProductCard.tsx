import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Tilt3D } from "@/components/Tilt3D";

interface Props {
  product: Product;
  index?: number;
  onImageClick?: (p: Product) => void;
}

export const ProductCard = ({ product, index = 0, onImageClick }: Props) => {
  const { items, updateQty } = useCart();
  const qty = items.find((i) => i.id === product.id)?.qty || 0;

  const setQty = (n: number) => updateQty(product.id, Math.max(0, n), product);

  return (
    <Tilt3D max={9} lift={16} className="h-full">
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
        className="product-card group h-full"
      >
        {product.badge && (
          <span className="glow-badge absolute top-4 left-4 z-10">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => onImageClick?.(product)}
          className="relative h-44 mb-4 grid place-items-center overflow-hidden rounded-xl bg-[radial-gradient(circle,rgba(236,72,153,0.12),transparent_60%),rgba(255,255,255,0.95)] w-full cursor-zoom-in border border-primary/10"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-40 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-lg"
          />
        </button>

        <h3 className="font-display font-semibold text-lg mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">{product.category}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-xl text-primary">
            ₹{product.price}
          </span>
          <div className="flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 p-1">
            <button
              type="button"
              onClick={() => setQty(qty - 1)}
              disabled={qty === 0}
              className="w-7 h-7 rounded-md grid place-items-center bg-white hover:bg-primary/10 disabled:opacity-30 transition"
            >
              <Minus className="w-3 h-3" />
            </button>
           <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={qty}
  onFocus={(e) => e.target.select()}
  onChange={(e) => {
    // Keep digits only, then drop any leading zeros ("05" -> "5").
    // Empty field counts as 0.
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const num =
      digitsOnly === "" ? 0 : Number(digitsOnly.replace(/^0+(?=\d)/, ""));
    setQty(num); // or updateQty(product.id, num, product) — use whatever function this file already calls
  }}
  className="w-10 text-center text-sm font-semibold outline-none" // keep your existing classes, just add onFocus/onChange logic
/>
            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded-md grid place-items-center bg-white hover:bg-primary/10 transition"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.article>
    </Tilt3D>
  );
};