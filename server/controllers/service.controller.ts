import { Request, Response } from "express";
import { ServiceModel } from "../models/Service.model";

export const ServiceController = {
  async list(req: Request, res: Response) {
    const items = await ServiceModel.findAll(req.query.search as string);
    res.json({ success: true, data: items });
  },

  async get(req: Request, res: Response) {
    const item = await ServiceModel.findById(Number(req.params.id));
    if (!item) return res.status(404).json({ success: false, error: "Service not found" });
    res.json({ success: true, data: item });
  },

  async create(req: Request, res: Response) {
    const { name, description, price } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, error: "Name is required" });
    const item = await ServiceModel.create({ name: name.trim(), description, price: Number(price) || 0 });
    res.status(201).json({ success: true, data: item });
  },

  async update(req: Request, res: Response) {
    const { name, description, price } = req.body;
    const item = await ServiceModel.update(Number(req.params.id), {
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
    });
    res.json({ success: true, data: item });
  },

  async remove(req: Request, res: Response) {
    await ServiceModel.remove(Number(req.params.id));
    res.json({ success: true });
  },
};
