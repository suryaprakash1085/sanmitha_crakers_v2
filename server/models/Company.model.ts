import db from "../db";

const table = () => db("company_settings");

export const CompanyModel = {
  async get() {
    return table().where({ id: 1 }).first();
  },

  async update(data: Partial<{ company_name: string; gst_number: string; address: string; phone: string; email: string; logo: string; website: string; description: string }>) {
    const existing = await this.get();
    if (existing) {
      await table()
        .where({ id: 1 })
        .update({ ...data, updated_at: db.fn.now() });
    } else {
      await table().insert({ id: 1, ...data });
    }
    return this.get();
  },
};
