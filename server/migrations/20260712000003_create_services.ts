import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("services", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable();
    table.text("description").nullable();
    table.decimal("price", 10, 2).notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("services");
}
