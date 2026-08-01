import { Request, Response } from "express";
import { ContactSubmissionModel } from "../models/ContactSubmission.model";

export const ContactController = {
  async getAll(_req: Request, res: Response) {
    const items = await ContactSubmissionModel.getAll();
    res.json({ success: true, data: items });
  },

  async create(req: Request, res: Response) {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "name, email and message are required" });
    }
    const item = await ContactSubmissionModel.create({ name, email, phone, message });
    res.status(201).json({ success: true, data: item });
  },

  async updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }
    const item = await ContactSubmissionModel.updateStatus(id, status);
    res.json({ success: true, data: item });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await ContactSubmissionModel.delete(id);
    res.json({ success: true });
  },
};
