import db from "../db";

const table = () => db("services");

export const ServiceModel = {
  async findAll(search?: string) {
    let query = table().select("*");
    if (search) {
      query = query.where("name", "like", `%${search}%`).orWhere("description", "like", `%${search}%`);
    }
    return query.orderBy("id", "desc");
  },

  async findById(id: number) {
    return table().where({ id }).first();
  },

  async create(data: { name: string; description?: string; price: number }) {
    const [id] = await table().insert(data);
    return this.findById(id);
  },

  async update(id: number, data: { name?: string; description?: string; price?: number }) {
    await table()
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() });
    return this.findById(id);
  },

  async remove(id: number) {
    return table().where({ id }).del();
  },
};
