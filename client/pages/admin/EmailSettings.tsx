import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Server, Lock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { api } from "@/lib/api";
import { usePagePermissions } from "@/hooks/useAccessControl";

interface EmailSettingsType {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  fromEmail: string;
  secure: boolean;
}

const empty: EmailSettingsType = {
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: "",
  fromName: "",
  fromEmail: "",
  secure: false,
};

const PRESETS: Record<string, { host: string; port: number; secure: boolean }> = {
  Gmail: { host: "smtp.gmail.com", port: 587, secure: false },
  Outlook: { host: "smtp.office365.com", port: 587, secure: false },
  "Yahoo Mail": { host: "smtp.mail.yahoo.com", port: 465, secure: true },
  SendGrid: { host: "smtp.sendgrid.net", port: 587, secure: false },
  Mailgun: { host: "smtp.mailgun.org", port: 587, secure: false },
  Custom: { host: "", port: 587, secure: false },
};

export default function EmailSettings() {
  const perms = usePagePermissions("email-settings");
  const [v, setV] = useState<EmailSettingsType>(empty);
  const [preset, setPreset] = useState("Custom");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [exists, setExists] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: EmailSettingsType | null }>("/email-settings");
      if (res.data && res.data.smtpHost) {
        setV({ ...empty, ...res.data });
        setExists(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load SMTP settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const upd = <K extends keyof EmailSettingsType>(k: K, val: EmailSettingsType[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const applyPreset = (name: string) => {
    setPreset(name);
    const p = PRESETS[name];
    setV((s) => ({ ...s, smtpHost: p.host, smtpPort: p.port, secure: p.secure }));
  };

  const save = async () => {
    setSaving(true);
    try {
      if (exists) {
        await api.put("/email-settings", v);
      } else {
        await api.post("/email-settings", v);
        setExists(true);
      }
      toast.success("SMTP settings saved");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!v.smtpHost || !v.smtpUser) {
      toast.error("Please fill SMTP host and username");
      return;
    }
    setTesting(true);
    try {
      const res = await api.post<{ message: string }>("/email-settings/test", v);
      toast.success(`✓ ${res.message}`);
    } catch (err: any) {
      toast.error(err.message || "SMTP connection failed");
    } finally {
      setTesting(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testTo.trim()) {
      toast.error("Enter an email address to send the test to");
      return;
    }
    if (!exists) {
      toast.error("Save SMTP settings first");
      return;
    }
    setSendingTest(true);
    try {
      const res = await api.post<{ message: string }>("/email-settings/send-test", { to: testTo.trim() });
      toast.success(`✓ ${res.message}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Email Settings" description="Configure SMTP for sending order invoices & notifications" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">SMTP Connection</h3>
          </div>

          <div>
            <Label>Provider Preset</Label>
            <Select value={preset} onValueChange={applyPreset}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(PRESETS).map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label>SMTP Host</Label>
              <Input value={v.smtpHost} onChange={(e) => upd("smtpHost", e.target.value)} placeholder="smtp.example.com" disabled={loading} />
            </div>
            <div>
              <Label>Port</Label>
              <Input type="number" value={v.smtpPort} onChange={(e) => upd("smtpPort", Number(e.target.value))} disabled={loading} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Username</Label>
              <Input value={v.smtpUser} onChange={(e) => upd("smtpUser", e.target.value)} placeholder="you@example.com" disabled={loading} />
            </div>
            <div>
              <Label>Password / App Key</Label>
              <Input type="password" value={v.smtpPass} onChange={(e) => upd("smtpPass", e.target.value)} placeholder="••••••••" disabled={loading} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>From Name</Label>
              <Input value={v.fromName} onChange={(e) => upd("fromName", e.target.value)} disabled={loading} />
            </div>
            <div>
              <Label>From Email</Label>
              <Input type="email" value={v.fromEmail} onChange={(e) => upd("fromEmail", e.target.value)} disabled={loading} />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <Label>Use SSL/TLS (secure)</Label>
            </div>
            <Switch checked={v.secure} onCheckedChange={(c) => upd("secure", c)} disabled={loading} />
          </div>

          <div className="flex gap-3 pt-2">
            {perms.put && (
              <Button onClick={save} className="flex-1" disabled={loading || saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            )}
            {perms.post && (
              <Button variant="outline" onClick={testConnection} disabled={testing || loading}>
                {testing ? "Testing..." : "Test Connection"}
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Send Test Email</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Sends a real email using the saved SMTP settings so you can confirm delivery actually works
            (save the settings above first).
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              className="md:flex-1"
            />
            {perms.post && (
              <Button onClick={sendTestEmail} disabled={sendingTest || loading}>
                {sendingTest ? "Sending..." : "Send Test Email"}
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Status</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className={`h-4 w-4 mt-0.5 ${v.smtpHost ? "text-green-500" : "text-muted-foreground"}`} />
              <div><b>Host:</b> {v.smtpHost || "Not set"}</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className={`h-4 w-4 mt-0.5 ${v.smtpUser ? "text-green-500" : "text-muted-foreground"}`} />
              <div><b>User:</b> {v.smtpUser || "Not set"}</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className={`h-4 w-4 mt-0.5 ${v.fromEmail ? "text-green-500" : "text-muted-foreground"}`} />
              <div><b>From:</b> {v.fromName} &lt;{v.fromEmail}&gt;</div>
            </div>
            <div className="flex items-start gap-2">
              <Lock className={`h-4 w-4 mt-0.5 ${v.secure ? "text-green-500" : "text-muted-foreground"}`} />
              <div><b>Encryption:</b> {v.secure ? "SSL/TLS" : "STARTTLS / None"}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-3 border-t border-white/10">
            For Gmail use an <b>App Password</b> from your Google Account → Security.
          </div>
        </Card>
      </div>
    </div>
  );
}
