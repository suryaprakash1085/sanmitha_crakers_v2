import { Request, Response } from "express";
import { CompanyModel } from "../models/Company.model";

export const CompanyController = {
  async get(_req: Request, res: Response) {
    const item = await CompanyModel.get();
    res.json({ success: true, data: item });
  },

  async update(req: Request, res: Response) {
    const {
      company_name,
      gst_number,
      address,
      phone,
      email,
      logo,
      website,
      description,
      bank_name,
      account_holder_name,
      account_number,
      account_type,
      ifsc_code,
      upi_id,
    } = req.body;
    const item = await CompanyModel.update({
      company_name,
      gst_number,
      address,
      phone,
      email,
      logo,
      website,
      description,
      bank_name,
      account_holder_name,
      account_number,
      account_type,
      ifsc_code,
      upi_id,
    });
    res.json({ success: true, data: item });
  },
};
