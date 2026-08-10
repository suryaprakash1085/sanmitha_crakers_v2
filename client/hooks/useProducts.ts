import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/data/products";

// API rows look like:
// { id: number, name, price, discount_percent, image, badge, category, category_id }
// The rest of the app (ProductCard, CartContext, etc.) expects `Product.id`
// as a string and `image` as an absolute/relative URL it can drop into <img>.
function normalize(row: any): Product {
  return {
    id: String(row.id),
    name: row.name,
    price: Number(row.price),
    category: (row.category || "Rockets") as Product["category"],
    image: row.image || "",
    badge: row.badge || undefined,
    discountPercent: Number(row.discount_percent) || 0,
  };
}

// Sorts product names the way a person would expect: names starting with
// numbers are ordered numerically (2, 10, 100 — not "10" before "2" like a
// plain string sort would do), and come before names starting with letters,
// which are then ordered alphabetically.
const naturalCompare = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<{ data: any[] }>("/products");
        if (!cancelled) {
          const list = (res.data || []).map(normalize);
          list.sort((a, b) => naturalCompare(a.name, b.name));
          setProducts(list);
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}