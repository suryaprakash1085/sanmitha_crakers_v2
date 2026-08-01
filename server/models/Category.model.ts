import db from "../db";

export interface CategoryRow {
  id: number;
  name: string;
  image: string | null;
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
      .select("c.id", "c.name", "c.image")
      .count("p.id as productCount")
      .orderBy("c.id", "asc");
  },

  async findById(id: number) {
    return table().where({ id }).first();
  },

  async findByName(name: string) {
    return table().where({ name }).first();
  },

  async create(name: string, image?: string | null) {
    const [id] = await table().insert({ name, image: image || null });
    return this.findById(id);
  },

  async update(id: number, name: string, image?: string | null) {
    const update: Record<string, any> = { name, updated_at: db.fn.now() };
    if (image !== undefined) update.image = image || null;
    await table().where({ id }).update(update);
    return this.findById(id);
  },

  async remove(id: number) {
    return table().where({ id }).del();
  },
};
