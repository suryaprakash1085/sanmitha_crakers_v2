import { Request, Response } from "express";
import { UserModel } from "../models/User.model";

export const UserController = {
  async list(req: Request, res: Response) {
    const { search, role } = req.query;
    const items = await UserModel.findAll({ search: search as string, role: role as string });
    res.json({ success: true, data: items });
  },

  async get(req: Request, res: Response) {
    const item = await UserModel.findById(Number(req.params.id));
    if (!item) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: item });
  },

  async create(req: Request, res: Response) {
    const { name, email, phone, password, role } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }
    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ success: false, error: "Email already exists" });
    const item = await UserModel.create({ name, email: email.trim(), phone, password, role });
    res.status(201).json({ success: true, data: item });
  },

  async update(req: Request, res: Response) {
    const { name, email, phone, role } = req.body;
    const item = await UserModel.update(Number(req.params.id), { name, email, phone, role });
    res.json({ success: true, data: item });
  },

  async remove(req: Request, res: Response) {
    await UserModel.remove(Number(req.params.id));
    res.json({ success: true });
  },
};
