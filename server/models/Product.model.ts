import db from "../db";
import { CategoryModel } from "./Category.model";

const table = () => db("products");

const withCategory = () =>
  db("products as p")
    .leftJoin("categories as c", "c.id", "p.category_id")
    .select(
      "p.id",
      "p.name",
      "p.price",
      "p.discount_percent",
      "p.image",
      "p.badge",
      "c.name as category",
      "p.category_id",
    );

export const ProductModel = {
  async findAll(filters: { search?: string; category?: string } = {}) {
    let query = withCategory();
    if (filters.search) {
      query = query.where("p.name", "like", `%${filters.search}%`);
    }
    if (filters.category) {
      query = query.andWhere("c.name", filters.category);
    }
    return query.orderBy("p.id", "desc");
  },

  async findById(id: number) {
    return withCategory().where("p.id", id).first();
  },

  // Resolve a category name to an id, creating the category if it doesn't exist yet.
  async resolveCategoryId(categoryName?: string) {
    if (!categoryName) return null;
    const existing = await CategoryModel.findByName(categoryName);
    if (existing) return existing.id;
    const created = await CategoryModel.create(categoryName);
    return created.id;
  },

  async create(data: { name: string; price: number; discount_percent?: number; category?: string; image?: string; badge?: string }) {
    const category_id = await this.resolveCategoryId(data.category);
    const [id] = await table().insert({
      name: data.name,
      price: data.price,
      discount_percent: data.discount_percent || 0,
      category_id,
      image: data.image || null,
      badge: data.badge || null,
    });
    return this.findById(id);
  },

  async update(id: number, data: { name?: string; price?: number; discount_percent?: number; category?: string; image?: string; badge?: string }) {
    const update: Record<string, any> = { updated_at: db.fn.now() };
    if (data.name !== undefined) update.name = data.name;
    if (data.price !== undefined) update.price = data.price;
    if (data.discount_percent !== undefined) update.discount_percent = data.discount_percent;
    if (data.image !== undefined) update.image = data.image;
    if (data.badge !== undefined) update.badge = data.badge;
    if (data.category !== undefined) update.category_id = await this.resolveCategoryId(data.category);
    await table().where({ id }).update(update);
    return this.findById(id);
  },

  async remove(id: number) {
    return table().where({ id }).del();
  },
};
