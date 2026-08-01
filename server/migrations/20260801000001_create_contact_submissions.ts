import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("contact_submissions", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable();
    table.string("email", 191).notNullable();
    table.string("phone", 30).nullable();
    table.text("message").notNullable();
    table.enum("status", ["new", "read", "replied"]).notNullable().defaultTo("new");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("contact_submissions");
}
