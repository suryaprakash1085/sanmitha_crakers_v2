import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { FormModal } from "@/components/admin/FormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useCrudModal } from "@/hooks/useCrudModal";
import { TableFilters } from "@/components/admin/TableFilters";
import { api } from "@/lib/api";
import { usePagePermissions } from "@/hooks/useAccessControl";

interface Service { id: number; name: string; description: string; price: number; }

export default function Services() {
  const perms = usePagePermissions("services");
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const modal = useCrudModal<Service>();
  const [form, setForm] = useState({ name: "", description: "", price: 0 });
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: Service[] }>("/services");
      setItems(res.data.map((s: any) => ({ ...s, price: Number(s.price) })));
    } catch (err: any) {
      toast.error(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter(s => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  }), [items, search]);

  const onCreate = () => { setForm({ name: "", description: "", price: 0 }); modal.openCreate(); };
  const onEdit = (s: Service) => { setForm({ name: s.name, description: s.description, price: s.price }); modal.openEdit(s); };
  const save = async () => {
    if (!form.name) return toast.error("Name required");
    try {
      if (modal.mode === "edit" && modal.item) {
        await api.put(`/services/${modal.item.id}`, form);
        toast.success("Service updated");
      } else {
        await api.post("/services", form);
        toast.success("Service added");
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
        await api.del(`/services/${modal.deleteItem.id}`);
        toast.success("Deleted");
        modal.closeDelete();
        load();
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  const columns: Column<Service>[] = [
    { header: "Name", cell: (s) => s.name },
    { header: "Description", cell: (s) => <span className="line-clamp-1">{s.description}</span> },
    { header: "Price", cell: (s) => `₹${s.price}` },
    { header: "Actions", cell: (s) => <RowActions onView={() => modal.openView(s)} onEdit={perms.put ? () => onEdit(s) : undefined} onDelete={perms.delete ? () => modal.openDelete(s) : undefined} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage offered services"
        action={perms.post ? <Button onClick={onCreate}><Plus className="h-4 w-4" /> Add Service</Button> : undefined}
      />
      <TableFilters search={search} onSearchChange={setSearch} placeholder="Search services..." />
      <DataTable columns={columns} data={filtered} rowKey={(s) => s.id} empty={loading ? "Loading..." : "No services found"} />

      <FormModal
        open={modal.isOpen}
        onOpenChange={modal.setOpen}
        title={modal.mode === "view" ? "View Service" : modal.mode === "edit" ? "Edit Service" : "Add Service"}
        onSubmit={save}
        readOnly={modal.mode === "view"}
      >
        {modal.mode === "view" && modal.item ? (
          <div className="space-y-2">
            <div><Label>Name</Label><p className="font-medium">{modal.item.name}</p></div>
            <div><Label>Description</Label><p>{modal.item.description}</p></div>
            <div><Label>Price</Label><p>₹{modal.item.price}</p></div>
          </div>
        ) : (
          <>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
          </>
        )}
      </FormModal>

      <ConfirmDialog
        open={modal.isDeleteOpen}
        onOpenChange={modal.setDeleteOpen}
        description={`Delete "${modal.deleteItem?.name}"?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
