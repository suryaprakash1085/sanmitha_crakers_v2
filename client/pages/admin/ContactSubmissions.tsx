import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePagePermissions } from "@/hooks/useAccessControl";
import { MessageSquare, Trash2 } from "lucide-react";
import { format } from "date-fns";

type Status = "new" | "read" | "replied";

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: Status;
  created_at: string;
}

const statusVariants: Record<Status, string> = {
  new: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-700",
  replied: "bg-green-100 text-green-800",
};

export default function ContactSubmissions() {
  const perms = usePagePermissions("contact-submissions");
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    try {
      const res = await api.get<{ data: Submission[] }>("/contact");
      setData(res.data ?? []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id: number, status: Status) => {
    try {
      await api.put(`/contact/${id}/status`, { status });
      setData((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      toast.success("Status updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.del(`/contact/${deleteId}`);
      setData((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success("Submission deleted");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<Submission>[] = [
    {
      header: "Date",
      cell: (row) => (
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {format(new Date(row.created_at), "dd MMM yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      header: "Name",
      cell: (row) => <span className="font-medium text-white">{row.name}</span>,
    },
    {
      header: "Email / Phone",
      cell: (row) => (
        <div>
          <div className="text-sm text-slate-300">{row.email}</div>
          {row.phone && <div className="text-xs text-slate-500">{row.phone}</div>}
        </div>
      ),
    },
    {
      header: "Message",
      cell: (row) => (
        <div>
          <p
            className={`text-sm text-slate-400 cursor-pointer ${expanded === row.id ? "" : "line-clamp-2"}`}
            onClick={() => setExpanded(expanded === row.id ? null : row.id)}
          >
            {row.message}
          </p>
          {row.message.length > 100 && (
            <button
              className="text-xs text-violet-400 hover:underline mt-0.5"
              onClick={() => setExpanded(expanded === row.id ? null : row.id)}
            >
              {expanded === row.id ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) =>
        perms.put ? (
          <Select value={row.status} onValueChange={(v) => changeStatus(row.id, v as Status)}>
            <SelectTrigger className="h-7 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge className={statusVariants[row.status]}>{row.status}</Badge>
        ),
    },
    {
      header: "",
      cell: (row) =>
        perms.delete ? (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
            onClick={() => setDeleteId(row.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        ) : null,
    },
  ];

  const newCount = data.filter((s) => s.status === "new").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Submissions"
        description={`${data.length} total · ${newCount} new`}
        icon={<MessageSquare className="w-5 h-5" />}
      />
      {loading ? (
        <p className="text-slate-400 text-sm">Loading…</p>
      ) : (
        <DataTable columns={columns} data={data} rowKey={(r) => String(r.id)} empty="No contact submissions yet" />
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete submission?"
        description="This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
