import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { type Category, type Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import {
  Search,
  SlidersHorizontal,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const categories: ("All" | Category)[] = [
  "All",
  "Rockets",
  "Sparklers",
  "Fountains",
  "Bombs",
];
const sorts = ["Name", "Price: Low to High", "Price: High to Low"] as const;

const QuickOrder = () => {
  const [cat, setCat] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Name");
  const [qty, setQty] = useState<Record<string, number>>({});
  const { add, setOpen } = useCart();
  const { products, loading } = useProducts();

  const filtered = useMemo(() => {
    let r = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        p.price <= maxPrice,
    );
    if (sort === "Price: Low to High")
      r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low")
      r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "Name")
      r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [cat, search, maxPrice, sort, products]);

  const setQ = (id: string, v: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, v) }));

  const totalItems = Object.values(qty).reduce((s, n) => s + n, 0);
  const totalAmount =
    filtered.reduce((s, p) => s + (qty[p.id] || 0) * p.price, 0) +
    products
      .filter((p) => !filtered.find((f) => f.id === p.id))
      .reduce((s, p) => s + (qty[p.id] || 0) * p.price, 0);

  const addAllToCart = () => {
    let added = 0;
    Object.entries(qty).forEach(([id, n]) => {
      const p = products.find((x) => x.id === id);
      if (p && n > 0) {
        for (let i = 0; i < n; i++) add(p);
        added += n;
      }
    });
    if (added === 0) return toast.error("Add quantity to at least one product");
    toast.success(`Added ${added} item${added > 1 ? "s" : ""} to cart`);
    setQty({});
    setOpen(true);
  };

  const resetAll = () => setQty({});

  return (
    <Layout>
      <section className="section-pad !pt-10">
        <div className="container-festive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="text-primary font-semibold text-sm flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Bulk Order
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">
              Quick <span className="text-gradient-festive">Order</span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Enter quantities for multiple products at once and add them all to
              your cart in one go.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar filters */}
            <aside className="glass-card rounded-3xl p-6 h-fit lg:sticky lg:top-28">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold">Filters</h3>
              </div>

              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Category
              </h4>
              <div className="flex flex-col gap-1 mb-6">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`text-left px-3 py-2 rounded-xl text-sm transition border ${
                      cat === c
                        ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                        : "border-transparent hover:bg-primary/5"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Max Price
              </h4>
              <input
                type="range"
                min={50}
                max={2000}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mb-6">
                <span>₹0</span>
                <span>₹{maxPrice}</span>
              </div>

              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Sort By
              </h4>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="input-glow text-sm py-2 mb-6"
              >
                {sorts.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={resetAll}
                className="w-full text-sm py-2 rounded-xl border hover:bg-primary/5 transition"
              >
                Reset Quantities
              </button>
            </aside>

            {/* Quick order table */}
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="input-glow !pl-11"
                  />
                </div>
                <div className="glass-card rounded-xl px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {filtered.length} products
                </div>
              </div>

              {loading ? (
                <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground">
                  Loading products…
                </div>
              ) : filtered.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground">
                  No products match your filters.
                </div>
              ) : (
                <div className="glass-card rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-primary/5 text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="text-left px-4 py-3">Product</th>
                          <th className="text-left px-4 py-3 hidden sm:table-cell">
                            Category
                          </th>
                          <th className="text-right px-4 py-3">Price</th>
                          <th className="text-center px-4 py-3 w-40">Qty</th>
                          <th className="text-right px-4 py-3">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((p) => {
                          const q = qty[p.id] || 0;
                          return (
                            <tr
                              key={p.id}
                              className="border-t border-border/50 hover:bg-primary/5 transition"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-12 h-12 object-contain rounded-lg bg-white/60"
                                  />
                                  <div>
                                    <p className="font-medium">{p.name}</p>
                                    {p.badge && (
                                      <span className="text-[10px] text-primary font-semibold">
                                        {p.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                                {p.category}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                ₹{p.price}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setQ(p.id, q - 1)}
                                    className="w-8 h-8 rounded-full grid place-items-center hover:bg-primary/10 disabled:opacity-30"
                                    disabled={q === 0}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    value={q}
                                    onChange={(e) =>
                                      setQ(p.id, +e.target.value || 0)
                                    }
                                    className="w-14 h-8 text-center rounded-lg border bg-background text-sm"
                                  />
                                  <button
                                    onClick={() => setQ(p.id, q + 1)}
                                    className="w-8 h-8 rounded-full grid place-items-center hover:bg-primary/10"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-primary">
                                {q > 0 ? `₹${q * p.price}` : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sticky summary bar */}
              <div className="mt-6 glass-card rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-soft">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      Items
                    </p>
                    <p className="text-xl font-bold">{totalItems}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      Total
                    </p>
                    <p className="text-xl font-bold text-primary">
                      ₹{totalAmount}
                    </p>
                  </div>
                </div>
                <button
                  onClick={addAllToCart}
                  disabled={totalItems === 0}
                  className="btn-festive flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add All to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default QuickOrder;
