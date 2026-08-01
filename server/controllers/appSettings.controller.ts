import { Request, Response } from "express";
import { AppSettingsModel } from "../models/AppSettings.model";

export const AppSettingsController = {
  async get(_req: Request, res: Response) {
    const data = await AppSettingsModel.get();
    res.json({ success: true, data: data ?? {} });
  },

  async set(req: Request, res: Response) {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ success: false, error: "Invalid body" });
    }
    const data = await AppSettingsModel.set(req.body);
    res.json({ success: true, data });
  },
};
