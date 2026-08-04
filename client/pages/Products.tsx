import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { type Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { Search } from "lucide-react";
import { Fireworks } from "@/components/Fireworks";

// Rotating set of colors for the category chips so each one stands out.
const chipColors = [
  "bg-rose-500/15 text-rose-600 border-rose-500/30 hover:bg-rose-500/25",
  "bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/25",
  "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25",
  "bg-sky-500/15 text-sky-600 border-sky-500/30 hover:bg-sky-500/25",
  "bg-violet-500/15 text-violet-600 border-violet-500/30 hover:bg-violet-500/25",
  "bg-pink-500/15 text-pink-600 border-pink-500/30 hover:bg-pink-500/25",
  "bg-orange-500/15 text-orange-600 border-orange-500/30 hover:bg-orange-500/25",
  "bg-teal-500/15 text-teal-600 border-teal-500/30 hover:bg-teal-500/25",
];

const slugify = (s: string) =>
  "cat-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Products = () => {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Product | null>(null);

  // Category list is derived straight from the API data (ordered by
  // category_id) so every category the backend returns shows up.
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p: any) => {
      if (!map.has(p.category)) {
        map.set(p.category, p.category_id ?? 0);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([name]) => name);
  }, [products]);

  // Group every product by category — no filter sidebar, everything shows.
  const sections = useMemo(() => {
    return categories
      .map((c) => ({
        category: c,
        items: products.filter(
          (p: any) =>
            p.category === c &&
            p.name.toLowerCase().includes(search.toLowerCase()),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [categories, products, search]);

  const totalCount = sections.reduce((sum, s) => sum + s.items.length, 0);

  const scrollToCategory = (c: string) => {
    const el = document.getElementById(slugify(c));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Layout>
      <section className="section-pad !pt-10">
        <div className="container-festive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="text-primary font-semibold text-sm">Shop</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">
              Our <span className="text-gradient-festive">Products</span>
            </h1>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-xl mx-auto">
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
              {totalCount} products
            </div>
          </div>

          {categories.length > 0 && (
            <div className="sticky top-20 z-20 glass-card rounded-2xl px-3 py-3 mb-8 overflow-x-auto">
              <div className="flex gap-2 w-max">
                {categories.map((c, i) => (
                  <button
                    key={c}
                    onClick={() => scrollToCategory(c)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${
                      chipColors[i % chipColors.length]
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground">
              Loading products…
            </div>
          ) : sections.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground">
              <p className="mb-4">No products found.</p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {sections.map((section) => (
                <div
                  key={section.category}
                  id={slugify(section.category)}
                  className="scroll-mt-40"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-primary/20">
                    <h2 className="font-display text-2xl md:text-3xl font-bold">
                      {section.category}
                    </h2>
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                      {section.items.length}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {section.items.map((p, i) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        index={i}
                        onImageClick={setActive}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <ProductModal product={active} onClose={() => setActive(null)} />
    </Layout>
  );
};

export default Products;