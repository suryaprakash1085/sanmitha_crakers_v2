import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("company_settings").del();
  await knex("company_settings").insert([
    {
      id: 1,
      company_name: "Fire Crackers Co.",
      gst_number: "33ABCDE1234F1Z5",
      address: "123 Festival St, Sivakasi, Tamil Nadu",
      phone: "+91 98765 43210",
      email: "info@firecrackers.com",
    },
  ]);
}
