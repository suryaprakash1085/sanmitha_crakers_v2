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
import { notifyCompanyChanged } from "@/hooks/useCompany";

interface CompanyForm {
  company_name: string;
  gst_number: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  website: string;
  description: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  account_type: string;
  ifsc_code: string;
  upi_id: string;
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
  bank_name: "",
  account_holder_name: "",
  account_number: "",
  account_type: "",
  ifsc_code: "",
  upi_id: "",
};

// Normalize null values from DB to empty strings so inputs stay controlled
function normalize(raw: any): CompanyForm {
  return {
    ...empty,
    ...raw,
    logo: raw?.logo ?? "",
    website: raw?.website ?? "",
    description: raw?.description ?? "",
    bank_name: raw?.bank_name ?? "",
    account_holder_name: raw?.account_holder_name ?? "",
    account_number: raw?.account_number ?? "",
    account_type: raw?.account_type ?? "",
    ifsc_code: raw?.ifsc_code ?? "",
    upi_id: raw?.upi_id ?? "",
  };
}

export default function Company() {
  const perms = usePagePermissions("company");
  const [form, setForm] = useState<CompanyForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ data: any }>("/company");
        if (res.data) setForm(normalize(res.data));
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
      const res = await api.put<{ data: any }>("/company", form);
      if (res.data) setForm(normalize(res.data));
      toast.success("Company details saved");
      notifyCompanyChanged(); // refresh Navbar / Footer instantly
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
        <ImagePicker
          label="Company Logo"
          value={form.logo}
          onChange={(v) => setForm({ ...form, logo: v })}
          uploadUrl="/api/company/upload-logo"
        />
        <div><Label>Company Name</Label><Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} disabled={loading} /></div>
        <div><Label>GST Number</Label><Input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} disabled={loading} /></div>
        <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} disabled={loading} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={loading} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={loading} /></div>
        </div>
        <div><Label>Website</Label><Input placeholder="https://example.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} disabled={loading} /></div>
        <div><Label>Company Description</Label><Textarea placeholder="A short description about your company" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={loading} /></div>

        <div className="pt-2 border-t">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3 mt-4">Bank &amp; Payment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Bank Name</Label><Input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} disabled={loading} /></div>
            <div><Label>Account Holder Name</Label><Input value={form.account_holder_name} onChange={(e) => setForm({ ...form, account_holder_name: e.target.value })} disabled={loading} /></div>
            <div><Label>Account Number</Label><Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} disabled={loading} /></div>
            <div><Label>Account Type</Label><Input placeholder="SAVINGS / CURRENT" value={form.account_type} onChange={(e) => setForm({ ...form, account_type: e.target.value })} disabled={loading} /></div>
            <div><Label>IFSC Code</Label><Input value={form.ifsc_code} onChange={(e) => setForm({ ...form, ifsc_code: e.target.value })} disabled={loading} /></div>
            <div><Label>UPI ID</Label><Input placeholder="name@bank" value={form.upi_id} onChange={(e) => setForm({ ...form, upi_id: e.target.value })} disabled={loading} /></div>
          </div>
        </div>

        {perms.put && <Button onClick={save} disabled={loading || saving}>{saving ? "Saving..." : "Save"}</Button>}
      </Card>
    </div>
  );
}
