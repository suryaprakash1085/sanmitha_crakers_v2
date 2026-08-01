import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Eye } from "lucide-react";
import { settingsStore, PdfSettings } from "@/lib/appSettings";
import { buildInvoicePdf } from "@/lib/invoicePdf";
import { PageHeader } from "@/components/admin/PageHeader";
import { usePagePermissions } from "@/hooks/useAccessControl";

const sampleData = {
  invoiceNo: "ORD-001002",
  receiptNo: "-",
  date: new Date().toLocaleDateString("en-GB"),
  dropLocation: "raja, chennai",
  customer: {
    name: "raja",
    phone: "+91 87678 68887",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    address: "12, Anna Salai",
  },
  items: [
    { name: '4" Gold Lakshmi', qty: 738, price: 175, unit: "-", discountPct: 80 },
  ],
  total: 25830,
  tax: 0,
};

export default function PdfTemplate() {
  const perms = usePagePermissions("pdf-template");
  const [v, setV] = useState<PdfSettings>(settingsStore.getPdf());
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const upd = <K extends keyof PdfSettings>(k: K, val: PdfSettings[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const save = () => {
    settingsStore.setPdf(v);
    toast.success("PDF template saved & applied to invoices");
  };

  const generatePreview = () => {
    const doc = buildInvoicePdf(v, sampleData);
    const blob = doc.output("bloburl") as unknown as string;
    setPreviewUrl(blob);
    toast.success("Preview refreshed");
  };

  const downloadSample = () => {
    const doc = buildInvoicePdf(v, sampleData);
    doc.save("sample-invoice.pdf");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="PDF Invoice Template"
        description="Design your tax invoice — company, bank, QR, terms & branding"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={generatePreview}><Eye className="w-4 h-4 mr-2" />Live Preview</Button>
            <Button variant="outline" onClick={downloadSample}><Download className="w-4 h-4 mr-2" />Sample PDF</Button>
            {perms.put && <Button onClick={save}>Save Template</Button>}
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
        <Card className="p-5">
          <Tabs defaultValue="header" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="bank">Bank / QR</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>

            <TabsContent value="header" className="space-y-3 mt-4">
              <div><Label>Header Title</Label><Input value={v.headerTitle} onChange={(e) => upd("headerTitle", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Copy Label</Label><Input value={v.copyLabel} onChange={(e) => upd("copyLabel", e.target.value)} placeholder="Original Copy" /></div>
                <div><Label>Invoice Prefix</Label><Input value={v.invoicePrefix} onChange={(e) => upd("invoicePrefix", e.target.value)} placeholder="ORD" /></div>
              </div>
              <div><Label>Place of Supply</Label><Input value={v.placeOfSupply} onChange={(e) => upd("placeOfSupply", e.target.value)} placeholder="Tamil Nadu (33)" /></div>
              <div><Label>GSTIN</Label><Input value={v.gstin} onChange={(e) => upd("gstin", e.target.value)} placeholder="33ABCDE1234F1Z5" /></div>
            </TabsContent>

            <TabsContent value="company" className="space-y-3 mt-4">
              <div><Label>Company Name</Label><Input value={v.companyName} onChange={(e) => upd("companyName", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={v.companyPhone} onChange={(e) => upd("companyPhone", e.target.value)} /></div>
                <div><Label>Email</Label><Input value={v.companyEmail} onChange={(e) => upd("companyEmail", e.target.value)} /></div>
              </div>
              <div><Label>Address</Label><Textarea rows={2} value={v.companyAddress} onChange={(e) => upd("companyAddress", e.target.value)} /></div>
              <div><Label>Authorized Signatory Line</Label><Input value={v.authorizedFor} onChange={(e) => upd("authorizedFor", e.target.value)} placeholder="For Fire Crackers Co." /></div>
              <div><Label>Support Contact</Label><Input value={v.supportContact} onChange={(e) => upd("supportContact", e.target.value)} /></div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-3 mt-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div><Label className="mb-0">Show Bank Details</Label><p className="text-xs text-muted-foreground">Print bank block on invoice</p></div>
                <Switch checked={v.showBankDetails} onCheckedChange={(c) => upd("showBankDetails", c)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Acc Holder</Label><Input value={v.bankAccName} onChange={(e) => upd("bankAccName", e.target.value)} /></div>
                <div><Label>Bank Name</Label><Input value={v.bankName} onChange={(e) => upd("bankName", e.target.value)} /></div>
                <div><Label>Acc No</Label><Input value={v.bankAccNo} onChange={(e) => upd("bankAccNo", e.target.value)} /></div>
                <div><Label>Acc Type</Label><Input value={v.bankAccType} onChange={(e) => upd("bankAccType", e.target.value)} /></div>
                <div><Label>IFSC</Label><Input value={v.bankIfsc} onChange={(e) => upd("bankIfsc", e.target.value)} /></div>
                <div><Label>UPI ID</Label><Input value={v.bankUpi} onChange={(e) => upd("bankUpi", e.target.value)} /></div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div><Label className="mb-0">Show QR (Scan to Pay)</Label><p className="text-xs text-muted-foreground">Paste QR image URL / data URL</p></div>
                <Switch checked={v.showQr} onCheckedChange={(c) => upd("showQr", c)} />
              </div>
              <div><Label>QR Image URL / Data URL</Label><Input value={v.qrDataUrl} onChange={(e) => upd("qrDataUrl", e.target.value)} placeholder="https://... or data:image/png;base64,..." /></div>
            </TabsContent>

            <TabsContent value="terms" className="space-y-3 mt-4">
              <div><Label>Terms & Conditions (one per line)</Label><Textarea rows={5} value={v.terms} onChange={(e) => upd("terms", e.target.value)} /></div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div><Label className="mb-0">Show Thank You Banner</Label></div>
                <Switch checked={v.showThankYou} onCheckedChange={(c) => upd("showThankYou", c)} />
              </div>
              <div><Label>Thank You Note</Label><Input value={v.thankYouNote} onChange={(e) => upd("thankYouNote", e.target.value)} /></div>
              <div><Label>Footer Note</Label><Textarea rows={2} value={v.footerNote} onChange={(e) => upd("footerNote", e.target.value)} /></div>
            </TabsContent>

            <TabsContent value="style" className="space-y-3 mt-4">
              <div className="flex items-center gap-3">
                <input type="color" value={v.accentHex} onChange={(e) => upd("accentHex", e.target.value)} className="w-16 h-10 rounded cursor-pointer" />
                <div className="flex-1">
                  <Label>Accent Color</Label>
                  <Input value={v.accentHex} onChange={(e) => upd("accentHex", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Base Font Size: {v.baseFontSize}pt</Label>
                <input type="range" min={8} max={14} value={v.baseFontSize} onChange={(e) => upd("baseFontSize", Number(e.target.value))} className="w-full" />
              </div>
              <div><Label>Company Logo URL (optional)</Label><Input value={v.companyLogoUrl} onChange={(e) => upd("companyLogoUrl", e.target.value)} placeholder="https://..." /></div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-3 bg-muted/30 h-[720px] flex flex-col">
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            <p className="text-xs text-muted-foreground">Live PDF preview (click "Live Preview" to refresh)</p>
            <Button size="sm" variant="ghost" onClick={generatePreview}><Eye className="w-3 h-3 mr-1" />Refresh</Button>
          </div>
          {previewUrl ? (
            <iframe src={previewUrl} className="w-full flex-1 rounded border bg-white" title="Invoice preview" />
          ) : (
            <div className="flex-1 grid place-items-center border rounded bg-white text-sm text-muted-foreground">
              Click <b className="mx-1">Live Preview</b> to render your invoice
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
