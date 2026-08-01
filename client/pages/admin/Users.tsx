import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { FormModal } from "@/components/admin/FormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useCrudModal } from "@/hooks/useCrudModal";
import { TableFilters } from "@/components/admin/TableFilters";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePagePermissions } from "@/hooks/useAccessControl";

type Role = "admin" | "customer";
interface User { id: number; name?: string; email: string; phone?: string; role: Role; created_at: string; }

const emptyForm = { name: "", email: "", phone: "", password: "", role: "customer" as Role };

export default function Users() {
  const perms = usePagePermissions("users");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const modal = useCrudModal<User>();
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("__all__");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (role !== "__all__") params.set("role", role);
      const res = await api.get<{ data: User[] }>(`/users?${params.toString()}`);
      setUsers(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, role]);

  const filtered = useMemo(() => users, [users]);

  const onEdit = (u: User) => { setForm({ name: u.name || "", email: u.email, phone: u.phone || "", password: "", role: u.role }); modal.openEdit(u); };
  const onCreate = () => { setForm(emptyForm); modal.openCreate(); };
  const save = async () => {
    try {
      if (modal.mode === "edit" && modal.item) {
        await api.put(`/users/${modal.item.id}`, { name: form.name, email: form.email, phone: form.phone, role: form.role });
        toast.success("User updated");
      } else {
        if (!form.email.trim() || !form.password) {
          toast.error("Email and password are required");
          return;
        }
        await api.post("/users", form);
        toast.success("User added");
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
        await api.del(`/users/${modal.deleteItem.id}`);
        toast.success("User deleted");
        modal.closeDelete();
        load();
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  const columns: Column<User>[] = [
    { header: "Name", cell: (u) => u.name || "—" },
    { header: "Email", cell: (u) => u.email },
    { header: "Phone", cell: (u) => u.phone || "—" },
    { header: "Role", cell: (u) => <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge> },
    { header: "Joined", cell: (u) => String(u.created_at).slice(0, 10) },
    { header: "Actions", cell: (u) => <RowActions onView={() => modal.openView(u)} onEdit={perms.put ? () => onEdit(u) : undefined} onDelete={perms.delete ? () => modal.openDelete(u) : undefined} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Registered users"
        action={perms.post ? <Button onClick={onCreate}><Plus className="h-4 w-4" /> Add User</Button> : undefined}
      />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Search users by email..."
        filters={[{
          label: "Role", value: "role", current: role, onChange: setRole,
          options: [{ label: "Admin", value: "admin" }, { label: "Customer", value: "customer" }],
        }]}
      />
      <DataTable columns={columns} data={filtered} rowKey={(u) => u.id} empty={loading ? "Loading..." : "No users found"} />

      <FormModal
        open={modal.isOpen}
        onOpenChange={modal.setOpen}
        title={modal.mode === "view" ? "View User" : modal.mode === "edit" ? "Edit User" : "Add User"}
        onSubmit={save}
        readOnly={modal.mode === "view"}
      >
        {modal.mode === "view" && modal.item ? (
          <div className="space-y-2">
            <div><Label>Name</Label><p className="font-medium">{modal.item.name || "—"}</p></div>
            <div><Label>Email</Label><p className="font-medium">{modal.item.email}</p></div>
            <div><Label>Phone</Label><p>{modal.item.phone || "—"}</p></div>
            <div><Label>Role</Label><Badge variant={modal.item.role === "admin" ? "default" : "secondary"}>{modal.item.role}</Badge></div>
            <div><Label>Joined</Label><p>{String(modal.item.created_at).slice(0, 10)}</p></div>
          </div>
        ) : (
          <>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            {modal.mode === "create" && (
              <div><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            )}
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </FormModal>

      <ConfirmDialog
        open={modal.isDeleteOpen}
        onOpenChange={modal.setDeleteOpen}
        description={`Delete "${modal.deleteItem?.email}"?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
