import db from "../db";

export interface CategoryRow {
  id: number;
  name: string;
  image: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const table = () => db("categories");

export const CategoryModel = {
  async findAll() {
    // include live product count for each category
    return db("categories as c")
      .leftJoin("products as p", "p.category_id", "c.id")
      .groupBy("c.id")
      .select("c.id", "c.name", "c.image", "c.sort_order")
      .count("p.id as productCount")
      .orderBy("c.sort_order", "asc")
      .orderBy("c.id", "asc");
  },

  async findById(id: number) {
    return table().where({ id }).first();
  },

  async findByName(name: string) {
    return table().where({ name }).first();
  },

  async create(name: string, image?: string | null, sortOrder?: number | null) {
    const [id] = await table().insert({
      name,
      image: image || null,
      sort_order: sortOrder ?? 0,
    });
    return this.findById(id);
  },

  async update(id: number, name: string, image?: string | null, sortOrder?: number | null) {
    const update: Record<string, any> = { name, updated_at: db.fn.now() };
    if (image !== undefined) update.image = image || null;
    if (sortOrder !== undefined && sortOrder !== null) update.sort_order = sortOrder;
    await table().where({ id }).update(update);
    return this.findById(id);
  },

  async remove(id: number) {
    return table().where({ id }).del();
  },
};
