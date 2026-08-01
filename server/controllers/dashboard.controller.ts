import { Request, Response } from "express";
import db from "../db";

export const DashboardController = {
  async stats(_req: Request, res: Response) {
    const [{ totalOrders }] = await db("orders").count({ totalOrders: "id" });
    const [{ pendingOrders }] = await db("orders").where({ status: "Pending" }).count({ pendingOrders: "id" });
    const [{ completedOrders }] = await db("orders").where({ status: "Delivered" }).count({ completedOrders: "id" });
    const [{ totalProducts }] = await db("products").count({ totalProducts: "id" });
    const [{ totalCustomers }] = await db("users").where({ role: "customer" }).count({ totalCustomers: "id" });
    const [{ totalRevenue }] = await db("orders").sum({ totalRevenue: "total" });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStr = startOfMonth.toISOString().slice(0, 10);
    const [{ revenueThisMonth }] = await db("orders").where("order_date", ">=", monthStr).sum({ revenueThisMonth: "total" });

    // last 7 days sales/revenue trend
    const since = new Date();
    since.setDate(since.getDate() - 6);
    const sinceStr = since.toISOString().slice(0, 10);
    const rows = await db("orders")
      .where("order_date", ">=", sinceStr)
      .select("order_date")
      .count({ sales: "id" })
      .sum({ revenue: "total" })
      .groupBy("order_date")
      .orderBy("order_date", "asc");

    res.json({
      success: true,
      data: {
        totalOrders: Number(totalOrders) || 0,
        pendingOrders: Number(pendingOrders) || 0,
        completedOrders: Number(completedOrders) || 0,
        totalProducts: Number(totalProducts) || 0,
        totalCustomers: Number(totalCustomers) || 0,
        totalRevenue: Number(totalRevenue) || 0,
        revenueThisMonth: Number(revenueThisMonth) || 0,
        weeklyTrend: rows.map((r: any) => ({
          date: r.order_date,
          sales: Number(r.sales) || 0,
          revenue: Number(r.revenue) || 0,
        })),
      },
    });
  },
};
