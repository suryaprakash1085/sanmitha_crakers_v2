import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { api } from "@/lib/api";
import { usePagePermissions } from "@/hooks/useAccessControl";

interface CompanyForm {
  company_name: string;
  gst_number: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  website: string;
  description: string;
}

const empty: CompanyForm = {
  company_name: "",
  gst_number: "",
  address: "",
  phone: "",
  email: "",
  logo: "",
  website: "",
  description: "",
};

export default function Company() {
  const perms = usePagePermissions("company");
  const [form, setForm] = useState<CompanyForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ data: CompanyForm | null }>("/company");
        if (res.data) setForm({ ...empty, ...res.data });
      } catch (err: any) {
        toast.error(err.message || "Failed to load company details");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/company", form);
      toast.success("Company details saved");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Company Details" description="Update business information" />
      <Card className="p-6 space-y-4 max-w-2xl">
        <ImagePicker label="Company Logo" value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} />
        <div><Label>Company Name</Label><Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} disabled={loading} /></div>
        <div><Label>GST Number</Label><Input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} disabled={loading} /></div>
        <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} disabled={loading} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={loading} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={loading} /></div>
        </div>
        <div><Label>Website</Label><Input placeholder="https://example.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} disabled={loading} /></div>
        <div><Label>Company Description</Label><Textarea placeholder="A short description about your company" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={loading} /></div>
        {perms.put && <Button onClick={save} disabled={loading || saving}>{saving ? "Saving..." : "Save"}</Button>}
      </Card>
    </div>
  );
}
