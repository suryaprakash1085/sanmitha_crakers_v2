import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Download, TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";
import { toast } from "sonner";
import { api } from "@/lib/api";

type Status = "Pending" | "Processing" | "Shipped" | "Delivered";
interface OrderRow { id: number; order_number: string; customer_name: string; total: number; status: Status; order_date: string; category: string; }

const COLORS = ["#f97316", "#facc15", "#ef4444", "#8b5cf6"];

export default function Report() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("__all__");
  const [category, setCategory] = useState("__all__");
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, delivered: 0, customers: 0 });
  const [byCategory, setByCategory] = useState<{ name: string; value: number }[]>([]);
  const [byDate, setByDate] = useState<{ date: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (status !== "__all__") params.set("status", status);
      if (category !== "__all__") params.set("category", category);
      const res = await api.get<{ data: any }>(`/reports/summary?${params.toString()}`);
      setRows(res.data.rows.map((r: any) => ({ ...r, total: Number(r.total) })));
      setStats(res.data.stats);
      setByCategory(res.data.byCategory);
      setByDate(res.data.byDate);
    } catch (err: any) {
      toast.error(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [from, to, status, category]);

  const exportCsv = () => {
    const header = "Order ID,Customer,Category,Date,Status,Total\n";
    const body = rows.map((r) => `${r.order_number},${r.customer_name},${r.category},${r.order_date},${r.status},${r.total}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported");
  };

  const columns: Column<OrderRow>[] = [
    { header: "Order ID", cell: (r) => <span className="font-mono text-xs">{r.order_number}</span> },
    { header: "Customer", cell: (r) => r.customer_name },
    { header: "Category", cell: (r) => r.category },
    { header: "Date", cell: (r) => r.order_date },
    { header: "Status", cell: (r) => <Badge variant="outline">{r.status}</Badge> },
    { header: "Total", cell: (r) => <span className="font-semibold">₹{r.total.toLocaleString()}</span> },
  ];

  const kpis = [
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign },
    { label: "Orders", value: stats.orders, icon: ShoppingBag },
    { label: "Delivered", value: stats.delivered, icon: TrendingUp },
    { label: "Customers", value: stats.customers, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Sales & performance analytics"
        action={<Button onClick={exportCsv}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>}
      />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs">From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Status</SelectItem>
                {["Pending", "Processing", "Shipped", "Delivered"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Categories</SelectItem>
                {["Rockets", "Sparklers", "Fountains", "Bombs"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold mt-1">{k.value}</p>
              </div>
              <k.icon className="h-8 w-8 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Revenue by Date</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={90} label>
                {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <DataTable columns={columns} data={rows} rowKey={(r) => r.id} empty={loading ? "Loading..." : "No records for selected filters"} />
    </div>
  );
}
