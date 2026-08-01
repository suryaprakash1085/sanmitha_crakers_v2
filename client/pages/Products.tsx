import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { type Category, type Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { Search, SlidersHorizontal } from "lucide-react";
import { Fireworks } from "@/components/Fireworks";
import { useSearchParams } from "react-router-dom";
const categories: ("All" | Category)[] = [
  "All",
  "Rockets",
  "Sparklers",
  "Fountains",
  "Bombs",
];
const sorts = [
  "Popularity",
  "Price: Low to High",
  "Price: High to Low",
  "Name",
] as const;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const initialCat: "All" | Category =
    urlCategory && (categories as string[]).includes(urlCategory)
      ? (urlCategory as Category)
      : "All";

  const [cat, setCat] = useState<"All" | Category>(initialCat);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Popularity");
  const [active, setActive] = useState<Product | null>(null);
  const { products, loading } = useProducts();

  // Keep the filter in sync if the URL's ?category= changes (e.g. clicking a
  // different category link while already on this page).
  useEffect(() => {
    const c = searchParams.get("category");
    if (c && (categories as string[]).includes(c)) {
      setCat(c as Category);
    } else if (!c) {
      setCat("All");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleCatChange = (c: "All" | Category) => {
    setCat(c);
    if (c === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: c }, { replace: true });
    }
  };

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

          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar filters */}
            <aside className="glass-card rounded-3xl p-6 h-fit lg:sticky lg:top-28">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold">Filter Products</h3>
              </div>

              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Category
              </h4>
              <div className="flex flex-col gap-1 mb-6">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCatChange(c)}
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
                Price Range
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
                className="input-glow text-sm py-2"
              >
                {sorts.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </aside>

            {/* Products */}
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
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      index={i}
                      onImageClick={setActive}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <ProductModal product={active} onClose={() => setActive(null)} />
    </Layout>
  );
};

export default Products;
