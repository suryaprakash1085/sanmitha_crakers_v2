import db from "../db";

const table = () => db("app_settings");

export const AppSettingsModel = {
  async get(): Promise<Record<string, any> | null> {
    const row = await table().where({ id: 1 }).first();
    if (!row) return null;
    try {
      return JSON.parse(row.value);
    } catch {
      return null;
    }
  },

  async set(data: Record<string, any>): Promise<Record<string, any>> {
    const json = JSON.stringify(data);
    const existing = await table().where({ id: 1 }).first();
    if (existing) {
      await table().where({ id: 1 }).update({ value: json, updated_at: db.fn.now() });
    } else {
      await table().insert({ id: 1, value: json });
    }
    return data;
  },
};
