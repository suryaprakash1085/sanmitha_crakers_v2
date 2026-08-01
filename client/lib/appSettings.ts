import { useEffect, useState } from "react";

type AppCustom = {
  primaryHsl: string;
  fontFamily: string;
  fontSize: number;
  tagline: string;
  enableFireworks: boolean;
  enableCart: boolean;
  showOffersBanner: boolean;
};

type PdfSettings = {
  headerTitle: string;
  footerNote: string;
  terms: string;
  accentHex: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  baseFontSize: number;
  gstin: string;
  companyLogoUrl: string;
  invoicePrefix: string;
  placeOfSupply: string;
  bankName: string;
  bankAccName: string;
  bankAccNo: string;
  bankAccType: string;
  bankIfsc: string;
  bankUpi: string;
  qrDataUrl: string;
  authorizedFor: string;
  thankYouNote: string;
  supportContact: string;
  copyLabel: string;
  showBankDetails: boolean;
  showQr: boolean;
  showThankYou: boolean;
};

type EmailSettings = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  fromEmail: string;
  secure: boolean;
};

/* ---------------- Home / About CMS ---------------- */

export type HomeSettings = {
  hero: {
    show: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaPrimaryLink: string;
    ctaSecondary: string;
    ctaSecondaryLink: string;
    image: string;
    accentHex: string;
  };
  featureStrip: {
    show: boolean;
    items: { icon: string; title: string; desc: string }[];
  };
  featured: {
    show: boolean;
    eyebrow: string;
    title: string;
    titleHighlight: string;
  };
  offer: {
    show: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    cta: string;
    ctaLink: string;
    image: string;
    accentHex: string;
  };
  why: {
    show: boolean;
    title: string;
    titleHighlight: string;
    items: { icon: string; title: string; desc: string; colorHue: string }[];
  };
};

export type AboutSettings = {
  header: {
    show: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
  };
  pillars: {
    show: boolean;
    items: { icon: string; title: string; desc: string }[];
  };
  timeline: {
    show: boolean;
    title: string;
    titleHighlight: string;
    items: { year: string; title: string; desc: string }[];
  };
  stats: {
    show: boolean;
    items: { n: string; l: string }[];
  };
};

const APP_KEY = "app_customization";
const PDF_KEY = "pdf_settings";
const EMAIL_KEY = "email_settings";
const HOME_KEY = "home_settings";
const ABOUT_KEY = "about_settings";

const defaults = {
  app: {
    primaryHsl: "24 95% 53%",
    fontFamily: "Poppins, system-ui, sans-serif",
    fontSize: 16,
    tagline: "Light up your celebrations",
    enableFireworks: true,
    enableCart: true,
    showOffersBanner: true,
  } as AppCustom,
  pdf: {
    headerTitle: "TAX INVOICE",
    footerNote: "Thank you for your order! Light it up safely.",
    terms: "• Invoice was created on a computer and is invalid without the signature and seal.\n• Goods once sold will not be taken back or exchanged.\n• Subject to local jurisdiction.",
    accentHex: "#ea580c",
    companyName: "Fire Crackers Co.",
    companyPhone: "+91 98765 43210",
    companyEmail: "info@firecrackers.com",
    companyAddress: "123 Festival St, Sivakasi, Tamil Nadu",
    baseFontSize: 10,
    gstin: "33ABCDE1234F1Z5",
    companyLogoUrl: "",
    invoicePrefix: "ORD",
    placeOfSupply: "Tamil Nadu (33)",
    bankName: "ICICI Bank",
    bankAccName: "Fire Crackers Co.",
    bankAccNo: "0747020303030486",
    bankAccType: "SAVINGS",
    bankIfsc: "ICBA0000747",
    bankUpi: "firecrackers@icici",
    qrDataUrl: "",
    authorizedFor: "For Fire Crackers Co.",
    thankYouNote: "Thank You for your business with Fire Crackers Co.",
    supportContact: "+91 98765 43210",
    copyLabel: "Original Copy",
    showBankDetails: true,
    showQr: true,
    showThankYou: true,
  } as PdfSettings,
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    fromName: "Fire Crackers",
    fromEmail: "noreply@firecrackers.com",
    secure: false,
  } as EmailSettings,
  home: {
    hero: {
      show: true,
      badge: "Diwali 2026 Special",
      title: "Celebrate the",
      titleHighlight: "Festival of Lights",
      subtitle: "Best quality fire crackers for your happy & safe Diwali celebration. Light up the sky with us. ✨",
      ctaPrimary: "Shop Now",
      ctaPrimaryLink: "/products",
      ctaSecondary: "Explore Offers",
      ctaSecondaryLink: "/offers",
      image: "",
      accentHex: "#ea580c",
    },
    featureStrip: {
      show: true,
      items: [
        { icon: "Award", title: "Best Quality", desc: "Premium licensed products" },
        { icon: "Truck", title: "Safe Delivery", desc: "All over India" },
        { icon: "ShieldCheck", title: "Best Prices", desc: "Affordable for everyone" },
        { icon: "Headset", title: "24/7 Support", desc: "We're here to help" },
      ],
    },
    featured: {
      show: true,
      eyebrow: "Featured Products",
      title: "Our",
      titleHighlight: "Best Sellers",
    },
    offer: {
      show: true,
      badge: "Limited Time Only",
      title: "Biggest",
      titleHighlight: "Festival Offers",
      description: "Get amazing discounts on all your favourite crackers. Limited time only — grab them before they're gone!",
      cta: "View Offers",
      ctaLink: "/offers",
      image: "",
      accentHex: "#ea580c",
    },
    why: {
      show: true,
      title: "Why",
      titleHighlight: "Choose Us",
      items: [
        { icon: "Award", title: "Best Quality", desc: "We use the best raw materials.", colorHue: "340" },
        { icon: "ShieldCheck", title: "Safe & Secure", desc: "Your safety is our top priority.", colorHue: "200" },
        { icon: "Sparkles", title: "Wide Variety", desc: "Largest collection of crackers.", colorHue: "42" },
        { icon: "Truck", title: "Fast Delivery", desc: "Quick delivery at your door.", colorHue: "265" },
      ],
    },
  } as HomeSettings,
  about: {
    header: {
      show: true,
      badge: "About Us",
      title: "Lighting up Moments,",
      titleHighlight: "Creating Happiness",
      description: "We are one of the leading fire crackers manufacturers and suppliers with a mission to spread happiness and celebrate every moment with safety and quality.",
    },
    pillars: {
      show: true,
      items: [
        { icon: "Heart", title: "Our Story", desc: "Born from a love for celebrations, we have been crafting joy for over 15 years." },
        { icon: "Target", title: "Our Mission", desc: "Bring safe, high-quality crackers to every home that wants to celebrate." },
        { icon: "Eye", title: "Our Vision", desc: "To be India's most loved and trusted festive brand." },
      ],
    },
    timeline: {
      show: true,
      title: "Our",
      titleHighlight: "Journey",
      items: [
        { year: "2010", title: "Our Beginning", desc: "Started a small family workshop" },
        { year: "2014", title: "Growing Strong", desc: "Expanded to 10+ cities" },
        { year: "2018", title: "New Innovations", desc: "Launched eco-friendly crackers" },
        { year: "2023", title: "Trusted by Millions", desc: "10K+ happy customers" },
      ],
    },
    stats: {
      show: true,
      items: [
        { n: "500+", l: "Products" },
        { n: "10K+", l: "Happy Customers" },
        { n: "50+", l: "Cities Delivered" },
        { n: "15+", l: "Years Experience" },
      ],
    },
  } as AboutSettings,
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // shallow merge one level deep so new fields fall back to defaults
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const merged: any = { ...(fallback as any) };
      for (const k of Object.keys(parsed)) {
        const fv = (fallback as any)[k];
        const pv = parsed[k];
        if (fv && typeof fv === "object" && !Array.isArray(fv) && pv && typeof pv === "object" && !Array.isArray(pv)) {
          merged[k] = { ...fv, ...pv };
        } else {
          merged[k] = pv;
        }
      }
      return merged;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

export const settingsStore = {
  getApp: () => read(APP_KEY, defaults.app),
  getPdf: () => read(PDF_KEY, defaults.pdf),
  getEmail: () => read(EMAIL_KEY, defaults.email),
  getHome: () => read(HOME_KEY, defaults.home),
  getAbout: () => read(ABOUT_KEY, defaults.about),
  setApp: (v: AppCustom) => {
    localStorage.setItem(APP_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
  },
  setPdf: (v: PdfSettings) => {
    localStorage.setItem(PDF_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
  },
  setEmail: (v: EmailSettings) => {
    localStorage.setItem(EMAIL_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
  },
  setHome: (v: HomeSettings) => {
    localStorage.setItem(HOME_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
  },
  setAbout: (v: AboutSettings) => {
    localStorage.setItem(ABOUT_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
  },
  defaults,
};

export type { AppCustom, PdfSettings, EmailSettings };

export const useAppCustomization = () => {
  const [v, setV] = useState<AppCustom>(settingsStore.getApp());
  useEffect(() => {
    const h = () => setV(settingsStore.getApp());
    window.addEventListener("settings-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("settings-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
};

export const useHomeSettings = () => {
  const [v, setV] = useState<HomeSettings>(settingsStore.getHome());
  useEffect(() => {
    const h = () => setV(settingsStore.getHome());
    window.addEventListener("settings-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("settings-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
};

export const useAboutSettings = () => {
  const [v, setV] = useState<AboutSettings>(settingsStore.getAbout());
  useEffect(() => {
    const h = () => setV(settingsStore.getAbout());
    window.addEventListener("settings-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("settings-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
};

export const useApplyAppCustomization = () => {
  const v = useAppCustomization();
  useEffect(() => {
    const root = document.documentElement;
    if (v.primaryHsl) root.style.setProperty("--primary", v.primaryHsl);
    root.style.setProperty("--app-font", v.fontFamily);
    root.style.setProperty("--app-font-size", `${v.fontSize}px`);
    document.body.style.fontFamily = v.fontFamily;
    document.body.style.fontSize = `${v.fontSize}px`;
  }, [v]);
};

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
