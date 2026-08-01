import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 150).nullable();
    table.string("email", 191).notNullable().unique();
    table.string("password", 255).notNullable();
    table.enum("role", ["admin", "customer"]).notNullable().defaultTo("customer");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
