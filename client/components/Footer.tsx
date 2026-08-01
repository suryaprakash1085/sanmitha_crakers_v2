import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Sparkles,
  Twitter,
  Youtube,
  Gem,
  ShieldCheck,
  Leaf,
  Truck,
  Award,
} from "lucide-react";

const features = [
  { icon: Gem, title: "Premium Quality", desc: "Finest quality products for extra brightness." },
  { icon: ShieldCheck, title: "Safe & Certified", desc: "100% safe products with BIS certification." },
  { icon: Leaf, title: "Eco Friendly", desc: "Environment safe fireworks." },
  { icon: Truck, title: "Fast Delivery", desc: "On-time delivery guaranteed." },
  { icon: Award, title: "Best Price Guarantee", desc: "Get the best quality at affordable prices." },
];

export const Footer = () => (
  <footer className="relative bg-[#0b0718]">
    {/* Feature strip */}
    <div className="border-t border-white/10 bg-[#100b26]">
      <div className="container-festive grid gap-8 sm:grid-cols-2 lg:grid-cols-5 py-12 px-4 md:px-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-12 h-12 shrink-0 rounded-full grid place-items-center text-white"
              style={{ background: ["hsl(330 82% 60%)", "hsl(200 85% 55%)", "hsl(42 92% 55%)", "hsl(20 92% 55%)", "hsl(330 82% 60%)"][i % 5] }}
            >
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-foreground">{f.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Main footer */}
     <div className="bg-[#0b0718] text-white">
      <div className="container-festive section-pad !py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5 px-4 md:px-8">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-festive grid place-items-center">
                <img
    src="/favicon.ico"
    alt="Sanmitha Fireworks Logo"
    className="w-full h-full object-cover"
  />
            </div>
            <span className="font-display font-extrabold text-xl text-white uppercase">
              Sanmitha Fireworks
            </span>
          </Link>
          <p className="text-sm text-white/60">
            Lighting up your celebrations with premium quality crackers since 2010.
          </p>
          <div className="flex gap-3 mt-4">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 grid place-items-center rounded-full border border-white/15 text-white/70 hover:text-primary hover:border-primary transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {["Home", "About", "Services", "Products", "Offers", "Contact"].map((l) => (
              <li key={l}><a href="#" className="hover:text-primary transition">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-white">Categories</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {["Rockets", "Sparklers", "Fountains", "Bombs", "Gift Boxes"].map((l) => (
              <li key={l}><a href="#" className="hover:text-primary transition">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-white">Customer Service</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {["My Orders", "Shipping Policy", "Returns & Refunds", "FAQ", "Track Order"].map((l) => (
              <li key={l}><a href="#" className="hover:text-primary transition">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-white">Newsletter</h4>
          <p className="text-sm text-white/60 mb-3">Get festive offers in your inbox.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 text-sm py-2 px-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/40 outline-none focus:border-primary transition"
            />
            <button type="submit" className="btn-spark !px-4 !py-2 !rounded-lg text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 container-festive">
        <span className="text-xs text-white/50">
          © {new Date().getFullYear()} Star Fireworks. All rights reserved.
        </span>
        <div className="flex gap-2">
          {["Visa", "Mastercard", "UPI", "Paytm"].map((p) => (
            <span key={p} className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white/10 text-white/70">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
