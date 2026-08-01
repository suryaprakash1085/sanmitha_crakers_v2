import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, LayoutDashboard, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  revenueThisMonth: number;
  weeklyTrend: { date: string; sales: number; revenue: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ data: Stats }>("/dashboard/stats");
        setStats(res.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load dashboard stats");
      }
    })();
  }, []);

  const cards = [
    { label: "Total Orders", value: stats?.totalOrders ?? "—", icon: ShoppingCart },
    { label: "Products", value: stats?.totalProducts ?? "—", icon: Package },
    { label: "Customers", value: stats?.totalCustomers ?? "—", icon: Users },
    { label: "Revenue", value: stats ? `₹${stats.totalRevenue.toLocaleString()}` : "—", icon: DollarSign },
  ];

  const salesData = (stats?.weeklyTrend || []).map((d) => ({ name: d.date.slice(5), sales: d.sales }));
  const revenueData = (stats?.weeklyTrend || []).map((d) => ({ name: d.date.slice(5), revenue: d.revenue }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your fireworks store performance"
        icon={<LayoutDashboard className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="admin-stat">
            <div className="flex items-start justify-between">
              <div className="icon-badge">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                <ArrowUpRight className="w-3 h-3" /> live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-4 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Weekly Sales</h3>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }} />
              <Bar dataKey="sales" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Revenue Trend</h3>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#fb923c" strokeWidth={2.5} dot={{ fill: "#fb923c", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
