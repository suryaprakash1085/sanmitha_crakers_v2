import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { FloatingSparks } from "@/components/FloatingSparks";
import { useAboutSettings } from "@/lib/appSettings";
import { Icon } from "@/lib/iconMap";

const About = () => {
  const a = useAboutSettings();

  return (
    <Layout>
      <section className="relative section-pad !pt-10 overflow-hidden">
        <FloatingSparks count={20} />
        <div className="container-festive relative">
          {a.header.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              {a.header.badge && (
                <span className="text-primary font-semibold text-sm">
                  {a.header.badge}
                </span>
              )}
              <h1 className="font-display text-4xl md:text-6xl font-bold mt-2 mb-4">
                {a.header.title}
                <br />
                <span className="text-gradient-festive">
                  {a.header.titleHighlight}
                </span>
              </h1>
              <p className="text-muted-foreground">{a.header.description}</p>
            </motion.div>
          )}

          {a.pillars.show && (
            <div className="grid md:grid-cols-3 gap-5 mb-16">
              {a.pillars.items.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-3xl p-7 hover:-translate-y-1 transition"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 grid place-items-center text-primary mb-4 shadow-sm border border-primary/20">
                    <Icon name={c.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          )}

          {a.timeline.show && a.timeline.items.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
                {a.timeline.title}{" "}
                <span className="text-gradient-festive">
                  {a.timeline.titleHighlight}
                </span>
              </h2>
              <div className="relative">
                <div className="hidden md:block absolute left-0 right-0 top-7 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />
                <div className="grid md:grid-cols-4 gap-6">
                  {a.timeline.items.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="relative text-center"
                    >
                      <div className="w-14 h-14 mx-auto rounded-full bg-white border border-primary/20 text-primary grid place-items-center font-display font-bold shadow-sm mb-3 relative z-10">
                        {i + 1}
                      </div>
                      <div className="font-display text-2xl font-bold text-gradient-festive">
                        {t.year}
                      </div>
                      <div className="font-semibold mt-1">{t.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {t.desc}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {a.stats.show && a.stats.items.length > 0 && (
            <div className="glass-card rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {a.stats.items.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <div className="font-display text-4xl md:text-5xl font-bold text-gradient-festive">
                    {s.n}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {s.l}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default About;
