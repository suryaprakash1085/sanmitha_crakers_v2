import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { authToken } from "@/lib/api";

export const ImagePicker = ({
  value,
  onChange,
  label = "Image",
  // When provided (e.g. "/api/products/upload"), a picked file is uploaded
  // to that endpoint (multipart/form-data, field name "image") and the
  // server-returned URL is what gets stored via onChange. The server saves
  // the file to disk (uploads/<folder>/...) and only the URL ends up in the
  // DB. When omitted, falls back to the old base64-in-place behavior.
  uploadUrl,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  uploadUrl?: string;
}) => {
  const [uploading, setUploading] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;

    if (uploadUrl) {
      if (f.size > 5 * 1024 * 1024) {
        toast.error("Please pick an image under 5 MB (or paste an https URL).");
        return;
      }
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("image", f);
        const token = authToken.get();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: fd,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          throw new Error(data.error || "Upload failed");
        }
        onChange(data.url);
      } catch (err: any) {
        toast.error(err.message || "Image upload failed");
      } finally {
        setUploading(false);
      }
      return;
    }

    if (f.size > 1024 * 1024) {
      toast.error("Please pick an image under 1 MB (or paste an https URL).");
      return;
    }
    const r = new FileReader();
    r.onload = () => onChange(String(r.result || ""));
    r.readAsDataURL(f);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="flex gap-2">
        <Input
          placeholder="Paste image URL or upload"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-50 border-slate-200 text-slate-900"
        />
        <label className={uploading ? "cursor-not-allowed" : "cursor-pointer"}>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <span className="inline-flex items-center gap-1 h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-sm">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload"}
          </span>
        </label>
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")} className="text-slate-500">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {value && (
        <img src={value} alt="preview" className="max-h-32 rounded-lg border border-slate-200 bg-slate-50" />
      )}
    </div>
  );
};
