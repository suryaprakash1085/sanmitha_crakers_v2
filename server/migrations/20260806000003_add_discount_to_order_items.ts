import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_items", (table) => {
    table.decimal("discount_percent", 5, 2).notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_items", (table) => {
    table.dropColumn("discount_percent");
  });
}
