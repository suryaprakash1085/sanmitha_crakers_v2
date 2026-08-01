import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { settingsStore, AppCustom } from "@/lib/appSettings";
import { usePagePermissions } from "@/hooks/useAccessControl";

const FONTS = [
  "Poppins, system-ui, sans-serif",
  "Outfit, system-ui, sans-serif",
  "Fredoka, system-ui, sans-serif",
  "Inter, system-ui, sans-serif",
  "Georgia, serif",
  "'Courier New', monospace",
];

const PRESET_COLORS = [
  { name: "Festive Orange", hsl: "24 95% 53%" },
  { name: "Crimson Red", hsl: "0 85% 55%" },
  { name: "Royal Purple", hsl: "270 80% 55%" },
  { name: "Emerald", hsl: "150 70% 45%" },
  { name: "Ocean Blue", hsl: "210 90% 55%" },
  { name: "Gold", hsl: "45 95% 50%" },
];

export default function Customization() {
  const perms = usePagePermissions("customization");
  const [v, setV] = useState<AppCustom>(settingsStore.getApp());
  const upd = <K extends keyof AppCustom>(k: K, val: AppCustom[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const save = () => {
    settingsStore.setApp(v);
    toast.success("Customization applied!");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="App Customization" description="Theme, typography & feature toggles" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-5">
          <h3 className="font-semibold text-lg">Theme</h3>
          <div>
            <Label>Primary Color</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hsl}
                  type="button"
                  onClick={() => upd("primaryHsl", c.hsl)}
                  className={`p-3 rounded-xl border-2 transition flex items-center gap-2 ${
                    v.primaryHsl === c.hsl ? "border-slate-900" : "border-transparent"
                  }`}
                  style={{ background: `hsl(${c.hsl} / 0.2)` }}
                >
                  <span className="w-4 h-4 rounded-full" style={{ background: `hsl(${c.hsl})` }} />
                  <span className="text-xs">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Custom HSL (e.g. "24 95% 53%")</Label>
            <Input value={v.primaryHsl} onChange={(e) => upd("primaryHsl", e.target.value)} />
          </div>
          <div>
            <Label>Site Tagline</Label>
            <Input value={v.tagline} onChange={(e) => upd("tagline", e.target.value)} />
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <h3 className="font-semibold text-lg">Typography</h3>
          <div>
            <Label>Font Family</Label>
            <Select value={v.fontFamily} onValueChange={(val) => upd("fontFamily", val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                    {f.split(",")[0].replace(/'/g, "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Base Font Size: {v.fontSize}px</Label>
            <input
              type="range" min={12} max={22} value={v.fontSize}
              onChange={(e) => upd("fontSize", Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p style={{ fontFamily: v.fontFamily, fontSize: v.fontSize }}>
              Preview: The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4 lg:col-span-2">
          <h3 className="font-semibold text-lg">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <Label>Fireworks Animation</Label>
              <Switch checked={v.enableFireworks} onCheckedChange={(c) => upd("enableFireworks", c)} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <Label>Offers Banner</Label>
              <Switch checked={v.showOffersBanner} onCheckedChange={(c) => upd("showOffersBanner", c)} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <Label>Enable Cart</Label>
              <Switch checked={v.enableCart} onCheckedChange={(c) => upd("enableCart", c)} />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        {perms.put && <Button onClick={save} size="lg">Save & Apply</Button>}
      </div>
    </div>
  );
}
