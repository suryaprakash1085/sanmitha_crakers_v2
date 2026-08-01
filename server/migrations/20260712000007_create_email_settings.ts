import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("email_settings", (table) => {
    table.increments("id").primary();
    table.string("smtp_host", 191).nullable();
    table.integer("smtp_port").notNullable().defaultTo(587);
    table.string("smtp_user", 191).nullable();
    table.string("smtp_pass", 255).nullable();
    table.string("from_name", 150).nullable();
    table.string("from_email", 191).nullable();
    table.boolean("secure").notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("email_settings");
}
