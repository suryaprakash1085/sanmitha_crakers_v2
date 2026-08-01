import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { FloatingSparks } from "@/components/FloatingSparks";
import { SparkButton } from "@/components/SparkButton";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent. We'll get back to you shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Layout>
      <section className="relative section-pad !pt-10">
        <FloatingSparks count={14} />
        <div className="container-festive relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <span className="text-primary font-semibold text-sm">
              Contact Us
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-2 mb-3">
              We're <span className="text-gradient-festive">here to help</span>
            </h1>
            <p className="text-muted-foreground">
              Reach out to us for any queries or bulk orders.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Your Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-glow"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Your Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="input-glow"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Your Phone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-glow"
                  placeholder="+91 ..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Your Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="input-glow resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <SparkButton type="submit">
                Send Message <Send className="w-4 h-4" />
              </SparkButton>
            </motion.form>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { icon: Phone, title: "Call Us", value: "+91 123 456 7890" },
                {
                  icon: Mail,
                  title: "Email Us",
                  value: "info@firecrackers.com",
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  value: "123, Festival Street, Sivakasi, Tamil Nadu, India",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="glass-card rounded-2xl p-5 flex gap-4 items-start hover:-translate-y-0.5 transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center text-primary shadow-sm shrink-0">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {c.value}
                    </div>
                  </div>
                </div>
              ))}
              <div className="glass-card rounded-2xl p-2 overflow-hidden">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary/40 via-primary/10 to-accent/20 grid place-items-center relative overflow-hidden">
                  <div className="absolute inset-0">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute w-px h-px bg-foreground/20"
                        style={{
                          left: `${(i * 13) % 100}%`,
                          top: `${(i * 17) % 100}%`,
                        }}
                      />
                    ))}
                  </div>
                  <MapPin className="w-12 h-12 text-primary drop-shadow-lg animate-bounce" />
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
