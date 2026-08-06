import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("categories", (table) => {
    table.integer("sort_order").notNullable().defaultTo(0);
  });

  // Backfill existing rows with 1,2,3... based on current id order, so the
  // admin list keeps its present order until someone edits it.
  const rows = await knex("categories").select("id").orderBy("id", "asc");
  for (let i = 0; i < rows.length; i++) {
    await knex("categories").where({ id: rows[i].id }).update({ sort_order: i + 1 });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("categories", (table) => {
    table.dropColumn("sort_order");
  });
}
