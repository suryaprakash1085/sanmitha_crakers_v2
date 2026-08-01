import { Request, Response } from "express";
import db from "../db";

export const ReportController = {
  async summary(req: Request, res: Response) {
    const { from, to, status, category } = req.query as Record<string, string | undefined>;

    const applyFilters = (query: any) => {
      if (from) query = query.andWhere("order_date", ">=", from);
      if (to) query = query.andWhere("order_date", "<=", to);
      if (status && status !== "__all__") query = query.andWhere("status", status);
      if (category && category !== "__all__") query = query.andWhere("category", category);
      return query;
    };

    const rows = await applyFilters(db("orders").select("*")).orderBy("order_date", "desc");

    const revenue = rows.reduce((s: number, r: any) => s + Number(r.total), 0);
    const delivered = rows.filter((r: any) => r.status === "Delivered").length;
    const customers = new Set(rows.map((r: any) => r.customer_name)).size;

    const byCategory: Record<string, number> = {};
    rows.forEach((r: any) => {
      if (!r.category) return;
      byCategory[r.category] = (byCategory[r.category] || 0) + Number(r.total);
    });

    const byDate: Record<string, number> = {};
    rows.forEach((r: any) => {
      const d = String(r.order_date).slice(0, 10);
      byDate[d] = (byDate[d] || 0) + Number(r.total);
    });

    res.json({
      success: true,
      data: {
        rows,
        stats: { revenue, orders: rows.length, delivered, customers },
        byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
        byDate: Object.entries(byDate)
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .map(([date, total]) => ({ date: date.slice(5), total })),
      },
    });
  },
};
