import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Info, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { settingsStore, AboutSettings } from "@/lib/appSettings";
import { ICON_NAMES, Icon } from "@/lib/iconMap";

const inputCls = "bg-slate-50 border-slate-200 text-slate-900";
const sectionCard = "p-6 bg-white border-slate-200 space-y-4";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-slate-400 uppercase tracking-wider">{label}</Label>
    {children}
  </div>
);

const IconSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
    <SelectContent className="bg-white border-slate-200 text-slate-900 max-h-64">
      {ICON_NAMES.map((n) => (
        <SelectItem key={n} value={n}>
          <span className="inline-flex items-center gap-2"><Icon name={n} className="w-4 h-4" /> {n}</span>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const ShowToggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (b: boolean) => void }) => (
  <div className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
    <div className="font-medium text-slate-900">{label}</div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default function AboutContent() {
  const [v, setV] = useState<AboutSettings>(settingsStore.getAbout());
  const set = <K extends keyof AboutSettings>(k: K, val: AboutSettings[K]) => setV((p) => ({ ...p, [k]: val }));

  const save = () => { settingsStore.setAbout(v); toast.success("About page updated"); };
  const reset = () => { setV(settingsStore.defaults.about); toast.info("Reset — click Save to apply"); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="About Page Content"
        description="Edit every section of the about page"
        icon={<Info className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="border-slate-200 bg-slate-50 text-slate-700"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            <Button onClick={save} className="bg-orange-600 hover:bg-orange-500"><Save className="w-4 h-4 mr-2" />Save</Button>
          </div>
        }
      />

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="pillars">Story / Mission / Vision</TabsTrigger>
          <TabsTrigger value="timeline">Journey</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Header" checked={v.header.show} onChange={(b) => set("header", { ...v.header, show: b })} />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Badge"><Input className={inputCls} value={v.header.badge} onChange={(e) => set("header", { ...v.header, badge: e.target.value })} /></Field>
              <Field label="Title"><Input className={inputCls} value={v.header.title} onChange={(e) => set("header", { ...v.header, title: e.target.value })} /></Field>
              <Field label="Title Highlight"><Input className={inputCls} value={v.header.titleHighlight} onChange={(e) => set("header", { ...v.header, titleHighlight: e.target.value })} /></Field>
            </div>
            <Field label="Description"><Textarea className={inputCls} value={v.header.description} onChange={(e) => set("header", { ...v.header, description: e.target.value })} /></Field>
          </Card>
        </TabsContent>

        <TabsContent value="pillars" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Pillars" checked={v.pillars.show} onChange={(b) => set("pillars", { ...v.pillars, show: b })} />
            <div className="grid md:grid-cols-3 gap-4">
              {v.pillars.items.map((it, i) => (
                <Card key={i} className="p-4 bg-slate-50 border-slate-200 space-y-3">
                  <Field label="Icon"><IconSelect value={it.icon} onChange={(val) => {
                    const next = [...v.pillars.items]; next[i] = { ...it, icon: val };
                    set("pillars", { ...v.pillars, items: next });
                  }} /></Field>
                  <Field label="Title"><Input className={inputCls} value={it.title} onChange={(e) => {
                    const next = [...v.pillars.items]; next[i] = { ...it, title: e.target.value };
                    set("pillars", { ...v.pillars, items: next });
                  }} /></Field>
                  <Field label="Description"><Textarea className={inputCls} value={it.desc} onChange={(e) => {
                    const next = [...v.pillars.items]; next[i] = { ...it, desc: e.target.value };
                    set("pillars", { ...v.pillars, items: next });
                  }} /></Field>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Journey" checked={v.timeline.show} onChange={(b) => set("timeline", { ...v.timeline, show: b })} />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Title"><Input className={inputCls} value={v.timeline.title} onChange={(e) => set("timeline", { ...v.timeline, title: e.target.value })} /></Field>
              <Field label="Title Highlight"><Input className={inputCls} value={v.timeline.titleHighlight} onChange={(e) => set("timeline", { ...v.timeline, titleHighlight: e.target.value })} /></Field>
            </div>
            <div className="space-y-3">
              {v.timeline.items.map((it, i) => (
                <div key={i} className="grid md:grid-cols-[120px_1fr_2fr_auto] gap-2 items-end">
                  <Field label="Year"><Input className={inputCls} value={it.year} onChange={(e) => {
                    const next = [...v.timeline.items]; next[i] = { ...it, year: e.target.value };
                    set("timeline", { ...v.timeline, items: next });
                  }} /></Field>
                  <Field label="Title"><Input className={inputCls} value={it.title} onChange={(e) => {
                    const next = [...v.timeline.items]; next[i] = { ...it, title: e.target.value };
                    set("timeline", { ...v.timeline, items: next });
                  }} /></Field>
                  <Field label="Description"><Input className={inputCls} value={it.desc} onChange={(e) => {
                    const next = [...v.timeline.items]; next[i] = { ...it, desc: e.target.value };
                    set("timeline", { ...v.timeline, items: next });
                  }} /></Field>
                  <Button variant="ghost" size="icon" onClick={() => {
                    set("timeline", { ...v.timeline, items: v.timeline.items.filter((_, idx) => idx !== i) });
                  }} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => set("timeline", { ...v.timeline, items: [...v.timeline.items, { year: "", title: "", desc: "" }] })} className="border-slate-200 bg-slate-50 text-slate-700">
                <Plus className="w-4 h-4 mr-2" />Add Milestone
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Stats" checked={v.stats.show} onChange={(b) => set("stats", { ...v.stats, show: b })} />
            <div className="space-y-3">
              {v.stats.items.map((it, i) => (
                <div key={i} className="grid md:grid-cols-[1fr_2fr_auto] gap-2 items-end">
                  <Field label="Number"><Input className={inputCls} value={it.n} onChange={(e) => {
                    const next = [...v.stats.items]; next[i] = { ...it, n: e.target.value };
                    set("stats", { ...v.stats, items: next });
                  }} /></Field>
                  <Field label="Label"><Input className={inputCls} value={it.l} onChange={(e) => {
                    const next = [...v.stats.items]; next[i] = { ...it, l: e.target.value };
                    set("stats", { ...v.stats, items: next });
                  }} /></Field>
                  <Button variant="ghost" size="icon" onClick={() => {
                    set("stats", { ...v.stats, items: v.stats.items.filter((_, idx) => idx !== i) });
                  }} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => set("stats", { ...v.stats, items: [...v.stats.items, { n: "", l: "" }] })} className="border-slate-200 bg-slate-50 text-slate-700">
                <Plus className="w-4 h-4 mr-2" />Add Stat
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
