import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("services").del();
  await knex("services").insert([
    { name: "Wedding Display", description: "Full fireworks display for weddings", price: 25000 },
    { name: "Birthday Package", description: "Curated kit for birthday parties", price: 5000 },
  ]);
}
