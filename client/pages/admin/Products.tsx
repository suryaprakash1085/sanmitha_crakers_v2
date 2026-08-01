import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { FormModal } from "@/components/admin/FormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useCrudModal } from "@/hooks/useCrudModal";
import { TableFilters } from "@/components/admin/TableFilters";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { usePagePermissions } from "@/hooks/useAccessControl";

interface Product { id: number; name: string; price: number; discount_percent?: number; category: string; image: string; badge?: string; }
interface CategoryOption { id: number; name: string; }

export default function AdminProducts() {
  const perms = usePagePermissions("products");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const modal = useCrudModal<Product>();
  const [form, setForm] = useState({ name: "", price: 0, discount_percent: 0, category: "", image: "" });
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("__all__");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: Product[] }>("/products");
      setItems(res.data.map((p: any) => ({ ...p, price: Number(p.price), discount_percent: Number(p.discount_percent) || 0 })));
    } catch (err: any) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get<{ data: CategoryOption[] }>("/categories");
      setCategoryOptions(res.data.map((c: any) => ({ id: c.id, name: c.name })));
    } catch (err: any) {
      toast.error(err.message || "Failed to load categories");
    }
  };

  useEffect(() => { load(); loadCategories(); }, []);

  const filtered = useMemo(() => items.filter((p) => {
    const q = search.toLowerCase();
    return (!q || p.name.toLowerCase().includes(q)) && (cat === "__all__" || p.category === cat);
  }), [items, search, cat]);
  const categories = Array.from(new Set(items.map(p => p.category).filter(Boolean)));

  const onCreate = () => {
    setForm({ name: "", price: 0, discount_percent: 0, category: "", image: "" });
    modal.openCreate();
  };
  const onEdit = (p: Product) => {
    setForm({ name: p.name, price: p.price, discount_percent: p.discount_percent || 0, category: p.category, image: p.image });
    modal.openEdit(p);
  };
  const save = async () => {
    if (!form.name) return toast.error("Name required");
    try {
      if (modal.mode === "edit" && modal.item) {
        await api.put(`/products/${modal.item.id}`, form);
        toast.success("Product updated");
      } else {
        await api.post("/products", form);
        toast.success("Product added");
      }
      modal.close();
      load();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  };
  const confirmDelete = async () => {
    if (modal.deleteItem) {
      try {
        await api.del(`/products/${modal.deleteItem.id}`);
        toast.success("Deleted");
        modal.closeDelete();
        load();
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  const columns: Column<Product>[] = [
    { header: "Image", cell: (p) => <img src={p.image} alt={p.name} className="h-12 w-12 object-contain" /> },
    { header: "Name", cell: (p) => p.name },
    { header: "Category", cell: (p) => p.category },
    { header: "Price", cell: (p) => `₹${p.price}` },
    {
      header: "Discount",
      cell: (p) =>
        p.discount_percent ? (
          <span className="text-emerald-600 font-medium">{p.discount_percent}% off</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    { header: "Actions", cell: (p) => <RowActions onView={() => modal.openView(p)} onEdit={perms.put ? () => onEdit(p) : undefined} onDelete={perms.delete ? () => modal.openDelete(p) : undefined} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        action={perms.post ? <Button onClick={onCreate}><Plus className="h-4 w-4" /> Add Product</Button> : undefined}
      />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Search products..."
        filters={[{
          label: "Category", value: "cat", current: cat, onChange: setCat,
          options: categories.map(c => ({ label: c, value: c })),
        }]}
      />
      <DataTable columns={columns} data={filtered} rowKey={(p) => p.id} empty={loading ? "Loading..." : "No products found"} />

      <FormModal
        open={modal.isOpen}
        onOpenChange={modal.setOpen}
        title={modal.mode === "view" ? "View Product" : modal.mode === "edit" ? "Edit Product" : "Add Product"}
        onSubmit={save}
        readOnly={modal.mode === "view"}
      >
        {modal.mode === "view" && modal.item ? (
          <div className="space-y-3">
            <img src={modal.item.image} alt={modal.item.name} className="h-32 w-32 object-contain mx-auto" />
            <div><Label>Name</Label><p className="font-medium">{modal.item.name}</p></div>
            <div><Label>Category</Label><p>{modal.item.category}</p></div>
            <div><Label>Price</Label><p>₹{modal.item.price}</p></div>
            <div>
              <Label>Discount</Label>
              <p>{modal.item.discount_percent ? `${modal.item.discount_percent}% off` : "No discount"}</p>
            </div>
          </div>
        ) : (
          <>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
            <div><Label>Discount %</Label><Input type="number" min={0} max={100} value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: +e.target.value })} /></div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ImagePicker
              label="Product Image"
              value={form.image}
              onChange={(v) => setForm({ ...form, image: v })}
              uploadUrl="/api/products/upload"
            />
          </>
        )}
      </FormModal>

      <ConfirmDialog
        open={modal.isDeleteOpen}
        onOpenChange={modal.setDeleteOpen}
        description={`Delete "${modal.deleteItem?.name}"? This cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}