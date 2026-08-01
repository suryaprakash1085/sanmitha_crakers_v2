import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("app_settings", (table) => {
    table.increments("id").primary();
    table.text("value").notNullable(); // JSON blob of all customization fields
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("app_settings");
}
