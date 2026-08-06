import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { type Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag } from "lucide-react";
import { Fireworks } from "@/components/Fireworks";

const slugify = (s: string) =>
  "cat-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Products = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { categories: categoryList } = useCategories();
  const { count, total, minOrderAmount, meetsMinOrder } = useCart();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Product | null>(null);

  // Category list is derived from the products present, but ordered using
  // the admin-configured display order (categories.sort_order) rather than
  // category_id, so admins can control the section order on the homepage.
  // Categories that exist on a product but aren't found in the categories
  // list (edge case) are pushed to the end, in the order encountered.
  const categories = useMemo(() => {
    const orderByName = new Map(categoryList.map((c) => [c.name, c.sortOrder]));
    const seen = new Set<string>();
    const names: string[] = [];
    products.forEach((p: any) => {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        names.push(p.category);
      }
    });
    return names.sort((a, b) => {
      const orderA = orderByName.has(a) ? orderByName.get(a)! : Number.MAX_SAFE_INTEGER;
      const orderB = orderByName.has(b) ? orderByName.get(b)! : Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [products, categoryList]);

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

  return (
    <Layout>
      <section className={`section-pad !pt-10 ${count > 0 ? "!pb-32" : ""}`}>
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

      {/* Fixed to the viewport bottom at all times — was `sticky bottom-4`,
          which only kicked in once you scrolled to the end of the page's
          normal flow. `fixed` pins it to the screen regardless of scroll
          position. */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
          <div className="container-festive">
            <div className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Items</p>
                  <p className="text-xl font-bold">{count}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Order Value</p>
                  <p className="text-xl font-bold text-primary">₹{total}</p>
                </div>
                {minOrderAmount > 0 && !meetsMinOrder && (
                  <p className="text-xs text-destructive">
                    Add ₹{minOrderAmount - total} more to reach the minimum order of ₹{minOrderAmount}
                  </p>
                )}
              </div>
              {/* Button only renders once the minimum order value is met —
                  hidden entirely rather than shown-but-disabled. */}
              {meetsMinOrder && (
                <button
                  onClick={() => navigate("/checkout")}
                  className="btn-festive flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ProductModal product={active} onClose={() => setActive(null)} />
    </Layout>
  );
};

export default Products;