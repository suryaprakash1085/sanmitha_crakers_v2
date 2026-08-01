import { Request, Response } from "express";
import { OrderModel } from "../models/Order.model";

export const OrderController = {
  async list(req: Request, res: Response) {
    const { search, status, from, to, category } = req.query;
    const items = await OrderModel.findAll({
      search: search as string,
      status: status as string,
      from: from as string,
      to: to as string,
      category: category as string,
    });
    res.json({ success: true, data: items });
  },

  async get(req: Request, res: Response) {
    const item = await OrderModel.findById(Number(req.params.id));
    if (!item) return res.status(404).json({ success: false, error: "Order not found" });
    res.json({ success: true, data: item });
  },

  async create(req: Request, res: Response) {
    const { customer_name, phone, address, category, total, status, payment_method, order_date, items } = req.body;
    if (!customer_name?.trim() || !phone?.trim()) {
      return res.status(400).json({ success: false, error: "Customer name and phone are required" });
    }
    const item = await OrderModel.create({
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      address,
      category,
      total: Number(total) || 0,
      status,
      payment_method: payment_method || "Pending",
      order_date,
      items: Array.isArray(items)
        ? items.map((it: any) => ({
            product_id: it.product_id ? Number(it.product_id) : null,
            product_name: String(it.product_name || "").trim(),
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
          }))
        : undefined,
    });
    res.status(201).json({ success: true, data: item });
  },

  async updateStatus(req: Request, res: Response) {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: "Status is required" });
    const item = await OrderModel.updateStatus(Number(req.params.id), status);
    res.json({ success: true, data: item });
  },

  async updatePaymentMethod(req: Request, res: Response) {
    const { payment_method } = req.body;
    if (!payment_method) return res.status(400).json({ success: false, error: "Payment method is required" });
    const item = await OrderModel.updatePaymentMethod(Number(req.params.id), payment_method);
    res.json({ success: true, data: item });
  },

  async update(req: Request, res: Response) {
    const { items, ...rest } = req.body;
    const item = await OrderModel.update(Number(req.params.id), {
      ...rest,
      items: Array.isArray(items)
        ? items.map((it: any) => ({
            product_id: it.product_id ? Number(it.product_id) : null,
            product_name: String(it.product_name || "").trim(),
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
          }))
        : undefined,
    });
    res.json({ success: true, data: item });
  },

  async remove(req: Request, res: Response) {
    await OrderModel.remove(Number(req.params.id));
    res.json({ success: true });
  },
};
