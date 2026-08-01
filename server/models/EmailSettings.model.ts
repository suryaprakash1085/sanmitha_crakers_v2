import db from "../db";

const table = () => db("email_settings");

export interface EmailSettingsData {
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  from_name?: string;
  from_email?: string;
  secure?: boolean;
}

export const EmailSettingsModel = {
  async get() {
    return table().where({ id: 1 }).first();
  },

  async create(data: EmailSettingsData) {
    const existing = await this.get();
    if (existing) return existing; // singleton: already created
    await table().insert({ id: 1, ...data });
    return this.get();
  },

  async update(data: EmailSettingsData) {
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
