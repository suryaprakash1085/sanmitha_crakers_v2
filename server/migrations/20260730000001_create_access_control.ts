import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("admin_roles", (table) => {
    table.string("id", 100).primary();
    table.string("name", 100).notNullable();
    table.string("description", 255).defaultTo("");
    table.json("permissions").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("admin_role_assignments", (table) => {
    table.increments("id").primary();
    table.string("email", 191).notNullable().unique();
    table.string("role_id", 100).notNullable()
      .references("id").inTable("admin_roles").onDelete("CASCADE");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("admin_role_assignments");
  await knex.schema.dropTableIfExists("admin_roles");
}
