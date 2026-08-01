import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Tilt3D } from "@/components/Tilt3D";

interface Props {
  product: Product;
  index?: number;
  onImageClick?: (p: Product) => void;
}

export const ProductCard = ({ product, index = 0, onImageClick }: Props) => {
  const [bursting, setBursting] = useState(false);
  const [hover, setHover] = useState(false);
  const { add } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBursting(true);
    setTimeout(() => setBursting(false), 900);
    add(product);
    toast.success(`${product.name} added to your cart`);
  };

  return (
    <Tilt3D max={9} lift={16} className="h-full">
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="product-card group h-full"
      >
        {hover && (
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  background: `hsl(${[6, 42, 340, 200][i % 4]} 90% 65%)`,
                  boxShadow: `0 0 10px hsl(${[6, 42, 340, 200][i % 4]} 90% 65%)`,
                  animation: `spark-pop 1.2s ease-out ${i * 0.12}s infinite`,
                }}
              />
            ))}
          </div>
        )}

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
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-xl text-primary">
            ₹{product.price}
          </span>
          <button
            onClick={handleAdd}
            style={{
              background: [
                "hsl(330 82% 60%)",
                "hsl(20 92% 55%)",
                "hsl(265 70% 58%)",
              ][index % 3],
            }}
            className="relative inline-flex items-center gap-1.5 rounded-lg text-white text-sm font-semibold px-4 py-2 hover:brightness-95 transition-all overflow-visible"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
            {bursting && (
              <span className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 14 }).map((_, i) => {
                  const a = (Math.PI * 2 * i) / 14;
                  const d = 35;
                  return (
                    <span
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: `hsl(${[6, 42, 340, 200, 12][i % 5]} 90% 65%)`,
                        boxShadow: `0 0 8px hsl(${[6, 42, 340, 200, 12][i % 5]} 90% 65%)`,
                        animation: `mini-burst 0.9s ease-out forwards`,
                        ["--tx" as any]: `${Math.cos(a) * d}px`,
                        ["--ty" as any]: `${Math.sin(a) * d}px`,
                      }}
                    />
                  );
                })}
                <style>{`@keyframes mini-burst{0%{transform:translate(-50%,-50%) scale(1)}100%{transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(0);opacity:0}}`}</style>
              </span>
            )}
          </button>
        </div>
      </motion.article>
    </Tilt3D>
  );
};
