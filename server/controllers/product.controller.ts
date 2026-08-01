import { Request, Response } from "express";
import { ProductModel } from "../models/Product.model";
import { publicUploadUrl } from "../middleware/upload.middleware";

export const ProductController = {
  // Handles the actual file (multer already saved it to uploads/products/
  // via the imageUpload middleware). Only the resulting URL goes back to the
  // client — that's the string that ends up saved in the products.image column.
  async uploadImage(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file uploaded" });
    }
    const url = publicUploadUrl("products", req.file.filename);
    res.status(201).json({ success: true, url });
  },

  async list(req: Request, res: Response) {
    const { search, category } = req.query;
    const items = await ProductModel.findAll({
      search: search as string,
      category: category as string,
    });
    res.json({ success: true, data: items });
  },

  async get(req: Request, res: Response) {
    const item = await ProductModel.findById(Number(req.params.id));
    if (!item) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, data: item });
  },

  async create(req: Request, res: Response) {
    const { name, price, discount_percent, category, image, badge } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, error: "Name is required" });
    const item = await ProductModel.create({
      name: name.trim(),
      price: Number(price) || 0,
      discount_percent: Number(discount_percent) || 0,
      category,
      image,
      badge,
    });
    res.status(201).json({ success: true, data: item });
  },

  async update(req: Request, res: Response) {
    const { name, price, discount_percent, category, image, badge } = req.body;
    const item = await ProductModel.update(Number(req.params.id), {
      name,
      price: price !== undefined ? Number(price) : undefined,
      discount_percent: discount_percent !== undefined ? Number(discount_percent) : undefined,
      category,
      image,
      badge,
    });
    res.json({ success: true, data: item });
  },

  async remove(req: Request, res: Response) {
    await ProductModel.remove(Number(req.params.id));
    res.json({ success: true });
  },
};
