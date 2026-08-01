import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("company_settings", (table) => {
    table.increments("id").primary();
    table.string("company_name", 150).notNullable().defaultTo("");
    table.string("gst_number", 50).nullable();
    table.text("address").nullable();
    table.string("phone", 30).nullable();
    table.string("email", 191).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("company_settings");
}
