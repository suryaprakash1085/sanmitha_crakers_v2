import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { settingsStore, AppCustom } from "@/lib/appSettings";
import { usePagePermissions } from "@/hooks/useAccessControl";
import { api } from "@/lib/api";
import { Palette, Type, Layers, Sparkles, ToggleLeft, RotateCcw } from "lucide-react";

/* ── colour presets ──────────────────────────────────────────────── */
const PRIMARY_COLORS = [
  { name: "Festive Pink",   hsl: "330 82% 60%" },
  { name: "Crimson",        hsl: "0 85% 55%"   },
  { name: "Sunset Orange",  hsl: "24 95% 53%"  },
  { name: "Gold",           hsl: "45 95% 50%"  },
  { name: "Emerald",        hsl: "150 70% 45%" },
  { name: "Ocean Blue",     hsl: "210 90% 55%" },
  { name: "Royal Purple",   hsl: "270 80% 55%" },
  { name: "Hot Magenta",    hsl: "310 90% 55%" },
];

const SECONDARY_COLORS = [
  { name: "Violet",      hsl: "265 80% 58%" },
  { name: "Indigo",      hsl: "240 80% 58%" },
  { name: "Teal",        hsl: "175 70% 45%" },
  { name: "Rose",        hsl: "350 85% 60%" },
  { name: "Amber",       hsl: "38 92% 52%"  },
  { name: "Sky",         hsl: "200 88% 52%" },
];

const FONTS = [
  { label: "Space Grotesk",  value: "Space Grotesk, system-ui, sans-serif" },
  { label: "Poppins",        value: "Poppins, system-ui, sans-serif"       },
  { label: "Outfit",         value: "Outfit, system-ui, sans-serif"        },
  { label: "Inter",          value: "Inter, system-ui, sans-serif"         },
  { label: "Fredoka",        value: "Fredoka, system-ui, sans-serif"       },
  { label: "Georgia",        value: "Georgia, serif"                       },
  { label: "Courier New",    value: "'Courier New', monospace"             },
];

/* ── helpers ─────────────────────────────────────────────────────── */
const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <Card className="p-6 space-y-5">
    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
      <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 grid place-items-center text-violet-500">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h3 className="font-semibold text-base text-slate-800">{title}</h3>
    </div>
    {children}
  </Card>
);

const ColorGrid = ({ colors, value, onChange }: {
  colors: { name: string; hsl: string }[];
  value: string;
  onChange: (h: string) => void;
}) => (
  <div className="grid grid-cols-4 gap-2">
    {colors.map((c) => (
      <button
        key={c.hsl}
        type="button"
        onClick={() => onChange(c.hsl)}
        title={c.name}
        className={`h-9 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 px-2 ${
          value === c.hsl
            ? "border-slate-800 scale-105 shadow-md"
            : "border-transparent hover:border-slate-300 hover:scale-105"
        }`}
        style={{ background: `hsl(${c.hsl} / 0.18)` }}
      >
        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: `hsl(${c.hsl})` }} />
        <span className="text-[10px] font-medium text-slate-700 truncate hidden sm:block">{c.name}</span>
      </button>
    ))}
  </div>
);

const ToggleRow = ({ label, desc, checked, onChange }: {
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
    <div>
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

/* ── main component ──────────────────────────────────────────────── */
export default function Customization() {
  const perms = usePagePermissions("customization");
  const [v, setV] = useState<AppCustom>(() => ({
    ...settingsStore.defaults.app,
    ...settingsStore.getApp(),
  }));
  const [saving, setSaving] = useState(false);

  // Load from API on mount (overrides localStorage if DB has data)
  useEffect(() => {
    api.get<{ data: Partial<AppCustom> }>("/app-settings")
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) {
          const merged = { ...settingsStore.defaults.app, ...res.data };
          settingsStore.setApp(merged);
          setV(merged);
        }
      })
      .catch(() => {}); // DB not ready — use localStorage fallback
  }, []);

  const upd = <K extends keyof AppCustom>(k: K, val: AppCustom[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/app-settings", v);
      settingsStore.setApp(v);
      toast.success("Customization saved and applied!");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    const def = settingsStore.defaults.app;
    setV(def);
    try {
      await api.put("/app-settings", def);
      settingsStore.setApp(def);
      toast.success("Reset to defaults");
    } catch {
      settingsStore.setApp(def);
      toast.success("Reset to defaults (offline)");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="App Customization"
        description="Control the look, feel and animations of your store"
        icon={<Palette className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── 1. Primary Colour ──────────────────────────────────────── */}
        <Section icon={Palette} title="Primary Colour">
          <ColorGrid colors={PRIMARY_COLORS} value={v.primaryHsl} onChange={(h) => upd("primaryHsl", h)} />
          <div>
            <Label className="text-xs text-slate-500">Custom HSL value</Label>
            <div className="flex gap-2 mt-1">
              <span className="w-8 h-9 rounded-lg border border-slate-200 shrink-0" style={{ background: `hsl(${v.primaryHsl})` }} />
              <Input
                value={v.primaryHsl}
                onChange={(e) => upd("primaryHsl", e.target.value)}
                placeholder="330 82% 60%"
              />
            </div>
          </div>
        </Section>

        {/* ── 2. Accent / Secondary Colour ──────────────────────────── */}
        <Section icon={Palette} title="Accent / Secondary Colour">
          <ColorGrid colors={SECONDARY_COLORS} value={v.accentSecondaryHsl} onChange={(h) => upd("accentSecondaryHsl", h)} />
          <div>
            <Label className="text-xs text-slate-500">Custom HSL value</Label>
            <div className="flex gap-2 mt-1">
              <span className="w-8 h-9 rounded-lg border border-slate-200 shrink-0" style={{ background: `hsl(${v.accentSecondaryHsl})` }} />
              <Input
                value={v.accentSecondaryHsl}
                onChange={(e) => upd("accentSecondaryHsl", e.target.value)}
                placeholder="265 80% 58%"
              />
            </div>
          </div>
        </Section>

        {/* ── 3. Typography ─────────────────────────────────────────── */}
        <Section icon={Type} title="Typography">
          <div>
            <Label>Font Family</Label>
            <Select value={v.fontFamily} onValueChange={(val) => upd("fontFamily", val)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Base Font Size — <span className="text-primary font-bold">{v.fontSize}px</span></Label>
            <input
              type="range" min={12} max={22} step={1} value={v.fontSize}
              onChange={(e) => upd("fontSize", Number(e.target.value))}
              className="w-full mt-2 accent-violet-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>12px — Small</span><span>17px — Default</span><span>22px — Large</span>
            </div>
          </div>
          <div>
            <Label>Site Tagline</Label>
            <Input
              className="mt-1"
              value={v.tagline}
              onChange={(e) => upd("tagline", e.target.value)}
              placeholder="Light up your celebrations"
            />
          </div>
          {/* live preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-400 mb-1">Live preview</p>
            <p style={{ fontFamily: v.fontFamily, fontSize: v.fontSize }}>
              The quick brown fox jumps over the lazy dog. 🎆
            </p>
          </div>
        </Section>

        {/* ── 4. Layout & Shape ─────────────────────────────────────── */}
        <Section icon={Layers} title="Layout & Shape">
          <div>
            <Label>
              Border Radius —{" "}
              <span className="text-primary font-bold">
                {v.borderRadius < 3 ? "Sharp" : v.borderRadius < 7 ? "Subtle" : v.borderRadius < 13 ? "Rounded" : "Pill"}
              </span>
            </Label>
            <input
              type="range" min={0} max={20} step={1} value={v.borderRadius}
              onChange={(e) => upd("borderRadius", Number(e.target.value))}
              className="w-full mt-2 accent-violet-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Sharp</span><span>Subtle</span><span>Rounded</span><span>Pill</span>
            </div>
            {/* visual preview */}
            <div className="flex gap-3 mt-3">
              {["Button", "Card", "Badge"].map((label, i) => (
                <div
                  key={label}
                  className="flex-1 py-2 text-center text-xs font-semibold bg-primary/10 text-primary border border-primary/30"
                  style={{ borderRadius: `${(v.borderRadius / 10)}rem` }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Card Shadow Intensity</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["none", "soft", "strong"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => upd("shadowStyle", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.shadowStyle === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                  style={{
                    boxShadow: s === "none" ? "none" : s === "soft" ? "0 8px 24px -8px rgba(15,23,42,0.15)" : "0 16px 40px -8px rgba(15,23,42,0.3)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Navbar Style</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["light", "glass", "dark"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => upd("navStyle", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.navStyle === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 5. Animations & Effects ───────────────────────────────── */}
        <Section icon={Sparkles} title="Animations & Effects">
          <ToggleRow
            label="Fireworks Animation"
            desc="Full-screen rocket + burst animation on all user pages"
            checked={v.enableFireworks}
            onChange={(c) => upd("enableFireworks", c)}
          />
          <ToggleRow
            label="Floating Sparks"
            desc="Small glowing particles that float up from the bottom"
            checked={v.enableFloatingSparks}
            onChange={(c) => upd("enableFloatingSparks", c)}
          />
          <div>
            <Label>Animation Speed</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["slow", "normal", "fast"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => upd("sparkSpeed", s)}
                  disabled={!v.enableFloatingSparks && !v.enableFireworks}
                  className={`p-2.5 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.sparkSpeed === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {s === "slow" ? "🐢 Slow" : s === "normal" ? "✨ Normal" : "⚡ Fast"}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 6. Feature Toggles ────────────────────────────────────── */}
        <Section icon={ToggleLeft} title="Feature Toggles">
          <ToggleRow
            label="Shopping Cart"
            desc="Show the cart icon and allow adding items"
            checked={v.enableCart}
            onChange={(c) => upd("enableCart", c)}
          />
          <ToggleRow
            label="Offers Banner"
            desc="Show the promotional offers banner section"
            checked={v.showOffersBanner}
            onChange={(c) => upd("showOffersBanner", c)}
          />
        </Section>

      </div>

      {/* ── Save bar ──────────────────────────────────────────────────── */}
      {perms.put && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 sticky bottom-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-100 text-violet-700 border-violet-200">Live preview</Badge>
            <span className="text-sm text-slate-500">Changes apply to the site immediately on save</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} disabled={saving} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset defaults
            </Button>
            <Button onClick={save} size="lg" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white min-w-[130px]">
              {saving ? "Saving…" : "Save & Apply"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
