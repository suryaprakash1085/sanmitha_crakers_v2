import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/context/CartContext";
import { Search, Minus, Plus, ShoppingCart, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const QuickOrder = () => {
  const { products, loading } = useProducts();
  const { categories: categoryList } = useCategories();
  const { updateQty, items: cartItems, setOpen, minOrderAmount, total: cartTotal } = useCart();
  const [search, setSearch] = useState("");
  // qty only holds quantities the user has actively changed in THIS table
  // (typed or +/-). Anything not touched falls back to the product's real
  // cart quantity via cartQtyMap below, so rows for products already in
  // the cart don't visually show "0".
  const [qty, setQty] = useState<Record<string, number>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  // Once the user scrolls past a small threshold, shrink the sticky top
  // summary bar (smaller padding/text, search placeholder shortened) so it
  // takes up less room while browsing the long product list, while staying
  // pinned under the navbar.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The summary bar is `fixed` (not `sticky`) so it can never get hidden
  // behind the navbar or scrolled out of view. Since `fixed` takes it out
  // of normal document flow, we measure its real rendered height and use
  // that to size a spacer div, so the product list below never jumps or
  // hides behind it — this stays correct even as the bar shrinks on scroll
  // or the min-order warning line shows/hides.
  const barRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => setBarHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The `76px` navbar offset was a hardcoded guess and doesn't match every
  // breakpoint (desktop nav is a different height than mobile nav), which
  // is why the bar/floating button ended up misaligned. Measure the real
  // fixed navbar's height from the DOM instead, so this always lines up
  // exactly no matter the screen size. Falls back to 76 if the navbar
  // element can't be found for some reason.
  const [navbarHeight, setNavbarHeight] = useState(76);
  useEffect(() => {
    const measureNavbar = () => {
      const nav = document.querySelector("header, nav") as HTMLElement | null;
      if (nav) setNavbarHeight(nav.getBoundingClientRect().height);
    };
    measureNavbar();
    window.addEventListener("resize", measureNavbar);
    const t = setTimeout(measureNavbar, 300); // in case fonts/logo shift layout after first paint
    return () => {
      window.removeEventListener("resize", measureNavbar);
      clearTimeout(t);
    };
  }, []);

  const cartQtyMap = useMemo(() => {
    const m: Record<string, number> = {};
    cartItems.forEach((i) => { m[i.id] = i.qty; });
    return m;
  }, [cartItems]);

  // The quantity actually shown/edited for a product: local edit if the
  // user touched it this session, else whatever's already in the cart.
  const displayQty = (id: string) => qty[id] ?? cartQtyMap[id] ?? 0;

  // Net (discounted) price — product.price is the MRP, discountPercent is
  // knocked off it, same math the invoice uses (gross - discAmt).
  const netPrice = (p: { price: number; discountPercent?: number }) =>
    p.discountPercent
      ? Math.round(p.price - (p.price * p.discountPercent) / 100)
      : p.price;

  // Same category ordering logic as the Products page — driven by the
  // admin-configured categories.sort_order, not filters.
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

  // Group every product by category — no sidebar filters, everything shows.
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

  const setQ = (id: string, v: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, v) }));

  const totalItems = products.reduce((s, p) => s + displayQty(p.id), 0);
  // Distinct product count — how many different products currently have a
  // quantity entered (whether already in the cart or freshly typed here).
  // This is what the "Items" summary and the floating cart badge show,
  // not the summed-up quantity (totalItems).
  const productsWithQty = products.filter((p) => displayQty(p.id) > 0).length;
  const totalAmount = products.reduce(
    (s, p) => s + displayQty(p.id) * netPrice(p),
    0,
  );
  // Whether the user has actually changed any quantity this session (vs
  // just viewing what's already in the cart) — used to enable/disable the
  // floating "Add All to Cart" button, since totalItems/productsWithQty
  // now include quantities already committed to the cart.
  const hasPendingChanges = Object.entries(qty).some(
    ([id, n]) => n !== (cartQtyMap[id] ?? 0),
  );
  // `totalAmount` already reflects what the cart total WOULD be after
  // adding all pending quantities (it sums displayQty, which falls back to
  // the real cart qty for untouched products), so we can check it directly
  // against the minimum order amount to decide if "Add All to Cart" should
  // be allowed yet.
  const meetsMinOrder = minOrderAmount === 0 || totalAmount >= minOrderAmount;

  const toggleCategory = (c: string) =>
    setCollapsed((prev) => ({ ...prev, [c]: !prev[c] }));

  // What the cart total is right now, including whatever's already in the
  // cart from other pages — same figure Products.tsx/Checkout.tsx use.
  const belowMinOrder = minOrderAmount > 0 && cartTotal < minOrderAmount;

  const addAllToCart = () => {
    const touched = Object.entries(qty).filter(
      ([id, n]) => n !== (cartQtyMap[id] ?? 0),
    );
    if (touched.length === 0) {
      return toast.error("Add quantity to at least one product");
    }
    if (!meetsMinOrder) {
      return toast.error(
        `Minimum order amount is ₹${minOrderAmount}. Add ₹${minOrderAmount - totalAmount} more.`,
      );
    }
    touched.forEach(([id, n]) => {
      const p = products.find((x) => x.id === id);
      if (p) updateQty(id, n, p);
    });
    const addedCount = touched.reduce((s, [, n]) => s + n, 0);
    toast.success(`Added ${addedCount} item${addedCount > 1 ? "s" : ""} to cart`);
    // Clear local overrides only — rows now fall back to the updated
    // cartQtyMap, so already-added products keep showing their real
    // quantity instead of resetting to 0.
    setQty({});
    setOpen(true);
  };

  let runningCode = 0;
  // Separate counter for the mobile card list so numbering stays in sync
  // with the desktop table even though they're two different render
  // passes over the same `sections` data.
  let runningCodeMobile = 0;

  // Small reusable qty stepper so the desktop table and the mobile card
  // list render an identical control without duplicating the JSX.
  const QtyStepper = ({ id, q }: { id: string; q: number }) => (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setQ(id, q - 1)}
        disabled={q === 0}
        className="w-8 h-8 shrink-0 rounded-full border border-slate-300 grid place-items-center hover:bg-slate-100 disabled:opacity-30 bg-white"
      >
        <Minus className="w-3 h-3" />
      </button>
      <input
        type="number"
        min={0}
        value={q === 0 ? "" : q}
        placeholder="0"
        onChange={(e) =>
          setQ(id, e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)
        }
        onFocus={(e) => e.target.select()}
        className="w-12 h-8 text-center rounded-lg border border-slate-300 bg-white text-sm"
      />
      <button
        onClick={() => setQ(id, q + 1)}
        className="w-8 h-8 shrink-0 rounded-full border border-slate-300 grid place-items-center hover:bg-slate-100 bg-white"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );

  return (
    <Layout>
      <section className="!pt-6 !pb-24">
        <div className="container-festive">
          {/* Sticky summary + minimum-order notice — stays visible while
              scrolling through the long product table below. Positioned
              just under the fixed navbar (76px tall, see Layout.tsx). */}
          <div
            ref={barRef}
            style={{ top: navbarHeight }}
            className={`fixed left-0 right-0 z-40 bg-white px-4 sm:px-6 lg:px-8 transition-all duration-200 ${
              scrolled ? "pt-1 pb-1" : "pt-2 pb-2"
            }`}
          >
            <div
              className={`max-w-screen-xl mx-auto rounded-2xl bg-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 transition-all duration-200 ${
                scrolled ? "px-3 py-2 mb-1" : "px-4 sm:px-6 py-4 mb-2"
              }`}
            >
              <p
                className={`font-semibold text-slate-800 whitespace-nowrap transition-all duration-200 ${
                  scrolled ? "text-xs" : "text-base"
                }`}
              >
                Total Products : {totalCount}
              </p>
              <div
                className={`relative w-full transition-all duration-200 ${
                  scrolled ? "sm:w-48" : "sm:w-72"
                }`}
              >
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 ${
                    scrolled ? "w-3.5 h-3.5" : "w-4 h-4"
                  }`}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={scrolled ? "Search…" : "Search products…"}
                  className={`w-full pl-9 pr-3 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 ${
                    scrolled ? "py-1 text-xs" : "py-2 text-sm"
                  }`}
                />
              </div>
              <p
                className={`font-semibold text-slate-800 whitespace-nowrap transition-all duration-200 ${
                  scrolled ? "text-xs" : "text-base"
                }`}
              >
                Overall Total: ₹{totalAmount}
              </p>
            </div>

            {/* Same minimum-order notice the Products page shows, driven by
                VITE_MIN_ORDER_AMOUNT. Informational only — it doesn't block
                adding to cart, just like the rest of the site. Hidden once
                shrunk so the compact bar stays a single tight strip. */}
            {belowMinOrder && (
              <p
                className={`text-destructive text-center max-w-screen-xl mx-auto transition-all duration-200 ${
                  scrolled ? "text-[10px] leading-tight" : "text-xs"
                }`}
              >
                Minimum order amount is ₹{minOrderAmount}. Your cart currently has ₹{cartTotal} — add ₹{minOrderAmount - cartTotal} more to be able to checkout.
              </p>
            )}
          </div>

          {/* Spacer — reserves exactly as much space as the fixed bar above
              actually takes up, so the product list starts right after it
              instead of being covered by it. */}
          <div style={{ height: barHeight }} />

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
            <>
              {/* ---------- DESKTOP / TABLET: table (md and up) ---------- */}
              <div className="hidden md:block rounded-b-2xl border border-slate-200 overflow-x-auto">
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-[70px_90px_1fr_120px_170px_110px] bg-slate-200 text-sm font-semibold text-slate-700">
                    <div className="px-4 py-3">Code</div>
                    <div className="px-4 py-3">Image</div>
                    <div className="px-4 py-3">Product Name</div>
                    <div className="px-4 py-3 text-center">Price</div>
                    <div className="px-4 py-3 text-center">Quantity</div>
                    <div className="px-4 py-3 text-right">Total</div>
                  </div>

                  {sections.map((section) => {
                    const isCollapsed = collapsed[section.category];
                    return (
                      <div key={section.category}>
                        <button
                          onClick={() => toggleCategory(section.category)}
                          className="w-full flex items-center justify-between bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold uppercase tracking-wide"
                        >
                          <span>
                            {section.category} ({section.items.length})
                          </span>
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </button>

                        {!isCollapsed &&
                          section.items.map((p, i) => {
                            runningCode += 1;
                            const q = displayQty(p.id);
                            const price = netPrice(p);
                            const rowBg = i % 2 === 0 ? "bg-slate-100" : "bg-white";
                            return (
                              <div
                                key={p.id}
                                className={`grid grid-cols-[70px_90px_1fr_120px_170px_110px] items-center border-t border-slate-200 ${rowBg}`}
                              >
                                <div className="px-4 py-3 text-sm text-slate-500">
                                  {runningCode}
                                </div>
                                <div className="px-4 py-3">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200"
                                  />
                                </div>
                                <div className="px-4 py-3">
                                  <p className="font-semibold text-slate-800">{p.name}</p>
                                  {p.badge && (
                                    <span className="text-[10px] text-primary font-semibold">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="px-4 py-3 text-center">
                                  {p.discountPercent ? (
                                    <>
                                      <p className="text-xs text-slate-400 line-through">
                                        ₹{p.price}
                                      </p>
                                      <p className="text-sm font-semibold text-primary">
                                        ₹{price}
                                      </p>
                                    </>
                                  ) : (
                                    <p className="text-sm font-semibold text-slate-800">
                                      ₹{price}
                                    </p>
                                  )}
                                </div>
                                <div className="px-4 py-3">
                                  <div className="flex items-center justify-center">
                                    <QtyStepper id={p.id} q={q} />
                                  </div>
                                </div>
                                <div className="px-4 py-3 text-right font-semibold text-slate-800">
                                  ₹{q * price}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ---------- MOBILE: stacked cards (below md), no side-scroll ---------- */}
              <div className="md:hidden rounded-2xl border border-slate-200 overflow-hidden">
                {sections.map((section) => {
                  const isCollapsed = collapsed[section.category];
                  return (
                    <div key={section.category}>
                      <button
                        onClick={() => toggleCategory(section.category)}
                        className="w-full flex items-center justify-between bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold uppercase tracking-wide"
                      >
                        <span>
                          {section.category} ({section.items.length})
                        </span>
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </button>

                      {!isCollapsed &&
                        section.items.map((p, i) => {
                          runningCodeMobile += 1;
                          const q = displayQty(p.id);
                          const price = netPrice(p);
                          const rowBg = i % 2 === 0 ? "bg-slate-100" : "bg-white";
                          return (
                            <div
                              key={p.id}
                              className={`relative border-t border-slate-200 pl-3 pr-2 py-3 ${rowBg}`}
                            >
                              {/* Number badge — small dark square chip, floats over the
                                  top-left corner of the image like in the reference. */}
                              <span className="absolute left-1 top-2 z-10 w-5 h-5 rounded bg-slate-700 text-white text-[11px] font-bold grid place-items-center">
                                {runningCodeMobile}
                              </span>

                              <p className="font-semibold text-slate-800 text-sm leading-tight break-words pl-5">
                                {p.name}
                              </p>

                              <div className="mt-1.5 flex items-center gap-2">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-14 h-14 shrink-0 object-contain rounded-lg bg-white border border-slate-200"
                                />

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-baseline gap-1.5">
                                    {p.discountPercent ? (
                                      <>
                                        <span className="text-xs text-slate-400 line-through">
                                          ₹{p.price}
                                        </span>
                                        <span className="text-[11px] text-emerald-600 font-medium">
                                          {p.discountPercent}% off
                                        </span>
                                      </>
                                    ) : null}
                                  </div>
                                  <span className="text-base font-bold text-rose-500">
                                    ₹{price}
                                  </span>
                                  <div className="mt-1.5">
                                    <QtyStepper id={p.id} q={q} />
                                  </div>
                                </div>

                                {/* Total — blue rounded pill pinned to the right edge,
                                    matching the reference image. */}
                                <span className="shrink-0 self-end mb-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5">
                                  ₹{q * price}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Add All to Cart — item/total summary strip under the table. */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Items</p>
                <p className="text-lg font-bold">{productsWithQty}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Total</p>
                <p className="text-lg font-bold text-primary">₹{totalAmount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating "Add All to Cart" — pinned top-right, below the navbar,
          instead of bottom-right (bottom-right is already taken by the
          site-wide cart icon + WhatsApp + scroll-to-top buttons). Smaller
          on mobile so it doesn't crowd/overlap the sticky summary bar or
          the WhatsApp/cart bubbles at the bottom. `top` is set inline from
          the measured bar height (76px navbar + real bar height + a small
          gap) so it always sits just below the bar — even when the
          minimum-order warning wraps to 2 lines and the bar grows taller —
          instead of overlapping it. */}
      <button
        onClick={addAllToCart}
        disabled={!hasPendingChanges || !meetsMinOrder}
        style={{ top: navbarHeight + barHeight + 12 }}
        className="fixed right-4 z-30 w-12 h-12 sm:right-6 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground shadow-lg grid place-items-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-[opacity,transform]"
      >
        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        {productsWithQty > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 grid place-items-center">
            {productsWithQty}
          </span>
        )}
      </button>
    </Layout>
  );
};

export default QuickOrder;