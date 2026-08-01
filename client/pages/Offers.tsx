import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Fireworks } from "@/components/Fireworks";
import { FloatingSparks } from "@/components/FloatingSparks";
import { SparkButton } from "@/components/SparkButton";
import { Tag, Gift, Zap } from "lucide-react";
import giftbox from "@/assets/giftbox.png";

const useCountdown = (target: Date) => {
  const [t, setT] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const i = setInterval(() => setT(target.getTime() - Date.now()), 1000);
    return () => clearInterval(i);
  }, [target]);
  const s = Math.max(0, Math.floor(t / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
};

const offers = [
  { tag: "Mega Diwali Sale", off: "Up to 50% Off", color: "6", grad: "from-primary/20 to-accent/20" },
  { tag: "Dhamaka Combo", off: "Up to 40% Off", color: "340", grad: "from-accent/20 to-secondary/30" },
  { tag: "Special Gift Packs", off: "Up to 30% Off", color: "42", grad: "from-secondary/30 to-primary/20" },
];

const Offers = () => {
  const target = new Date(Date.now() + 5 * 86400000 + 12 * 3600000); // 5d12h
  const c = useCountdown(target);

  return (
    <Layout>
      <section className="relative section-pad !pt-10 overflow-hidden">

        <FloatingSparks count={20} />
        <div className="container-festive relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-10">
            <span className="glow-badge mb-3 inline-flex">
              <Zap className="w-3 h-3" /> Limited Time Only
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-2 mb-3">
              Festival <span className="text-gradient-pink">Offers</span>
            </h1>
            <p className="text-muted-foreground">Grab the best deals before the offer ends!</p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-6 md:p-8 max-w-3xl mx-auto mb-12">
            <div className="grid grid-cols-4 gap-3 md:gap-5">
              {[{l:"Days",v:c.d},{l:"Hours",v:c.h},{l:"Minutes",v:c.m},{l:"Seconds",v:c.s}].map((u) => (
                <div key={u.l} className="text-center">
                  <div className="rounded-2xl bg-festive text-white font-display text-3xl md:text-5xl font-bold py-4 shadow-soft">
                    {String(u.v).padStart(2, "0")}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2 font-medium">{u.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured big offer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/30 border border-white/60 shadow-soft p-8 md:p-12 grid md:grid-cols-2 gap-6 items-center mb-10">
            <FloatingSparks count={10} />
            <div className="relative z-10">
              <span className="glow-badge mb-4 inline-flex">UP TO 50% OFF</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
                Diwali Mega <span className="text-gradient-festive">Bonanza</span>
              </h2>
              <p className="text-muted-foreground mb-6">All categories. All products. One mega sale you don't want to miss.</p>
              <SparkButton>Shop Now <Tag className="w-4 h-4" /></SparkButton>
            </div>
            <motion.img src={giftbox} alt="Festival gift" loading="lazy" width={768} height={768}
              animate={{ rotate: [-3, 3, -3], y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-64 md:w-80 mx-auto drop-shadow-2xl relative z-10"
            />
          </motion.div>

          {/* Offer cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {offers.map((o, i) => (
              <motion.div key={o.tag}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${o.grad} border border-white/60 p-6 shadow-card-festive`}>
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl"
                  style={{ background: `hsl(${o.color} 90% 65%)` }} />
                <div className="relative z-10">
                  <Gift className="w-8 h-8 mb-3" style={{ color: `hsl(${o.color} 80% 50%)` }} />
                  <h3 className="font-display text-2xl font-bold mb-1">{o.tag}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{o.off}</p>
                  <SparkButton className="!px-5 !py-2 text-sm">Shop Now</SparkButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Offers;
