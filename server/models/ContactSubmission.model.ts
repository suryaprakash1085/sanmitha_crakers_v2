import db from "../db";

const table = () => db("contact_submissions");

export const ContactSubmissionModel = {
  async getAll() {
    return table().orderBy("created_at", "desc");
  },

  async getById(id: number) {
    return table().where({ id }).first();
  },

  async create(data: { name: string; email: string; phone?: string; message: string }) {
    const [id] = await table().insert({ ...data, status: "new" });
    return table().where({ id }).first();
  },

  async updateStatus(id: number, status: "new" | "read" | "replied") {
    await table().where({ id }).update({ status, updated_at: db.fn.now() });
    return table().where({ id }).first();
  },

  async delete(id: number) {
    return table().where({ id }).delete();
  },
};
