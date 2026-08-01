import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("company_settings", (table) => {
    table.text("logo").nullable();
    table.string("website", 191).nullable();
    table.text("description").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("company_settings", (table) => {
    table.dropColumn("logo");
    table.dropColumn("website");
    table.dropColumn("description");
  });
}
