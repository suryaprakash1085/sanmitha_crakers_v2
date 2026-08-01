import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.string("order_number", 30).notNullable().unique();
    table.string("customer_name", 150).notNullable();
    table.string("phone", 30).notNullable();
    table.text("address").nullable();
    table.string("category", 100).nullable();
    table.decimal("total", 10, 2).notNullable().defaultTo(0);
    table
      .enum("status", ["Pending", "Processing", "Shipped", "Delivered"])
      .notNullable()
      .defaultTo("Pending");
    table.date("order_date").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("orders");
}
