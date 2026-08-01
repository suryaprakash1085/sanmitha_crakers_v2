import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("categories").del();
  await knex("categories").insert([
    { id: 1, name: "Rockets" },
    { id: 2, name: "Sparklers" },
    { id: 3, name: "Fountains" },
    { id: 4, name: "Bombs" },
  ]);
}
