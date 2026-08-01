import { motion } from "framer-motion";
import { ArrowRight, Rocket, Sparkles as SparklesIcon, Droplets, Bomb, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { FloatingSparks } from "@/components/FloatingSparks";
import { SparkButton } from "@/components/SparkButton";
import { Tilt3D } from "@/components/Tilt3D";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import heroImg from "@/assets/hero-crackers.png";
import giftbox from "@/assets/giftbox.png";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useHomeSettings } from "@/lib/appSettings";
import { Icon } from "@/lib/iconMap";

const CATEGORIES = [
  { name: "Rockets", icon: Rocket, hue: 6 },
  { name: "Sparklers", icon: SparklesIcon, hue: 42 },
  { name: "Fountains", icon: Droplets, hue: 200 },
  { name: "Bombs", icon: Bomb, hue: 340 },
] as const;

const Index = () => {
  const h = useHomeSettings();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollByCards = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <Layout>
      {/* HERO */}
      {h.hero.show && (
        <section className="relative min-h-[88vh] overflow-hidden">
          <div className="container-festive relative z-10 grid lg:grid-cols-2 gap-8 items-center pt-8 pb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              {h.hero.badge && (
                <span
                  className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs font-semibold mb-5"
                  style={{ color: h.hero.accentHex }}
                >
                  <Icon name="Flame" className="w-3.5 h-3.5" /> {h.hero.badge}
                </span>
              )}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] mb-5 break-words">
                {h.hero.title}
                <br />
                <span className="text-gradient-festive">{h.hero.titleHighlight}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mb-8">{h.hero.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                {h.hero.ctaPrimary && (
                  <Link to={h.hero.ctaPrimaryLink || "/products"}>
                    <SparkButton>{h.hero.ctaPrimary} <ArrowRight className="w-4 h-4" /></SparkButton>
                  </Link>
                )}
                {h.hero.ctaSecondary && (
                  <Link to={h.hero.ctaSecondaryLink || "/offers"}>
                    <SparkButton variant="outline">{h.hero.ctaSecondary}</SparkButton>
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 bg-festive blur-3xl opacity-20 -z-10 animate-pulse" />
              <Tilt3D max={8} lift={20} className="mx-auto max-w-xl">
                <img
                  src={h.hero.image || heroImg}
                  alt="Festive fire crackers display"
                  width={1280}
                  height={1024}
                  className="w-full drop-shadow-2xl"
                />
              </Tilt3D>
            </motion.div>
          </div>

          {/* feature strip */}
          {h.featureStrip.show && (
            <div className="container-festive relative z-10 -mt-6">
              <div className="glass-card rounded-3xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                {h.featureStrip.items.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl grid place-items-center text-white shadow-soft shrink-0"
                      style={{ background: ["hsl(330 82% 60%)", "hsl(20 92% 55%)", "hsl(265 70% 58%)", "hsl(330 82% 60%)"][i % 4] }}
                    >
                      <Icon name={f.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{f.title}</div>
                      <div className="text-xs text-muted-foreground">{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* BEST SELLERS */}
      {h.featured.show && (
        <section className="section-pad relative">
          <div className="container-festive">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 relative">
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                <Flame className="w-4 h-4 fill-current" /> {h.featured.eyebrow}
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
                {h.featured.title} <span className="text-gradient-festive">{h.featured.titleHighlight}</span>
              </h2>
              <div className="hidden sm:flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
                <button
                  onClick={() => scrollByCards(-1)}
                  aria-label="Previous"
                  className="w-9 h-9 rounded-full glass-card grid place-items-center text-foreground/60 hover:text-primary transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollByCards(1)}
                  aria-label="Next"
                  className="w-9 h-9 rounded-full bg-festive text-white grid place-items-center shadow-soft"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {products.slice(0, 8).map((p, i) => (
                <div key={p.id} className="min-w-[260px] sm:min-w-[270px] snap-start">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY STRIP */}
      <section className="pb-10 relative">
        <div className="container-festive">
          <div className="glass-card rounded-3xl px-6 py-6 flex flex-wrap justify-center sm:justify-between gap-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                to={`/products?category=${encodeURIComponent(c.name)}`}
                className="flex flex-col items-center gap-2 group w-20"
              >
                <div
                  className="w-12 h-12 rounded-full grid place-items-center group-hover:scale-110 transition-transform"
                  style={{ background: `hsl(${c.hue} 95% 92%)` }}
                >
                  <c.icon className="w-5 h-5" style={{ color: `hsl(${c.hue} 80% 45%)` }} />
                </div>
                <span className="text-xs font-semibold text-center">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER BANNER */}
      {h.offer.show && (
        <section className="section-pad !py-10">
          <div className="container-festive">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-pink-festive shadow-soft p-8 md:p-12 grid md:grid-cols-2 gap-6 items-center text-white"
            >
              <FloatingSparks count={12} />
              <div className="relative z-10">
                {h.offer.badge && (
                  <span className="glow-badge mb-4 !bg-white/15 !text-white backdrop-blur-sm">
                    {h.offer.badge}
                  </span>
                )}
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">
                  {h.offer.title} <span className="text-gradient-gold">{h.offer.titleHighlight}</span>
                </h2>
                <p className="text-white/80 mb-6 max-w-md">{h.offer.description}</p>
                {h.offer.cta && (
                  <Link to={h.offer.ctaLink || "/offers"}>
                    <SparkButton>{h.offer.cta} <Icon name="Gift" className="w-4 h-4" /></SparkButton>
                  </Link>
                )}
              </div>
              <div className="relative z-10 flex justify-center">
                <motion.img
                  src={h.offer.image || giftbox}
                  alt="Gift box of crackers"
                  width={768}
                  height={768}
                  loading="lazy"
                  className="w-64 md:w-80 drop-shadow-2xl"
                  animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* WHY */}
      {h.why.show && (
        <section className="section-pad">
          <div className="container-festive">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                {h.why.title} <span className="text-gradient-festive">{h.why.titleHighlight}</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {h.why.items.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-3xl p-6 text-center group hover:-translate-y-2 transition-transform"
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl grid place-items-center mb-4 group-hover:animate-wiggle"
                    style={{
                      background: `hsl(${w.colorHue} 95% 92%)`,
                      boxShadow: `0 0 30px hsl(${w.colorHue} 90% 70% / 0.4)`,
                    }}
                  >
                    <Icon name={w.icon} className="w-7 h-7" style={{ color: `hsl(${w.colorHue} 80% 45%)` }} />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">{w.title}</h3>
                  <p className="text-sm text-muted-foreground">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
