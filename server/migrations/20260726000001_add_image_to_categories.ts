import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("categories", (table) => {
    table.string("image", 500).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("categories", (table) => {
    table.dropColumn("image");
  });
}
