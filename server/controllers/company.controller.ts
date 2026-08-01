import { Request, Response } from "express";
import { CompanyModel } from "../models/Company.model";

export const CompanyController = {
  async get(_req: Request, res: Response) {
    const item = await CompanyModel.get();
    res.json({ success: true, data: item });
  },

  async update(req: Request, res: Response) {
    const { company_name, gst_number, address, phone, email, logo, website, description } = req.body;
    const item = await CompanyModel.update({ company_name, gst_number, address, phone, email, logo, website, description });
    res.json({ success: true, data: item });
  },
};
