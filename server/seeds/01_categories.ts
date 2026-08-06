import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("categories").del();
  await knex("categories").insert([
    { id: 1, name: "Rockets", sort_order: 1 },
    { id: 2, name: "Sparklers", sort_order: 2 },
    { id: 3, name: "Fountains", sort_order: 3 },
    { id: 4, name: "Bombs", sort_order: 4 },
  ]);
}
