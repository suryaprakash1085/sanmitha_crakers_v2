import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { FloatingSparks } from "@/components/FloatingSparks";
import { SparkButton } from "@/components/SparkButton";
import { Package, Sparkles, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import giftbox from "@/assets/giftbox.png";

const services = [
  { icon: Package, title: "Bulk Orders", desc: "Get the best deals on bulk purchases for weddings, festivals & more.", color: "6" },
  { icon: Sparkles, title: "Event Fireworks", desc: "Make your events more special with professional firework displays.", color: "340" },
  { icon: Gift, title: "Custom Gift Boxes", desc: "Custom designed festive gift boxes for your loved ones.", color: "42" },
];

const Services = () => (
  <Layout>
    <section className="relative section-pad !pt-10">
      <FloatingSparks count={16} />
      <div className="container-festive relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-semibold text-sm">Our Services</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-2 mb-3">
            We provide the <span className="text-gradient-festive">best services</span>
          </h1>
          <p className="text-muted-foreground">For your celebrations, big or small.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {services.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-3xl p-7 group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"
                style={{ background: `hsl(${s.color} 90% 65%)` }} />
              <div className="w-16 h-16 rounded-2xl grid place-items-center mb-5 group-hover:animate-wiggle relative"
                style={{ background: `hsl(${s.color} 95% 92%)`, boxShadow: `0 0 30px hsl(${s.color} 90% 70% / 0.5)` }}>
                <s.icon className="w-8 h-8" style={{ color: `hsl(${s.color} 80% 50%)` }} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
              <Link to="/contact" className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 md:p-12 grid md:grid-cols-2 gap-6 items-center text-white shadow-soft">
          <FloatingSparks count={10} />
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Need Help With Bulk Order?</h2>
            <p className="opacity-90 mb-5">Get in touch with our team for the best quotes and offers.</p>
            <Link to="/contact"><SparkButton variant="outline" className="!bg-white !text-primary !border-white">Contact Us</SparkButton></Link>
          </div>
          <div className="relative z-10 flex justify-center">
            <img src={giftbox} alt="Gift box" loading="lazy" width={768} height={768} className="w-56 md:w-72 drop-shadow-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Services;
