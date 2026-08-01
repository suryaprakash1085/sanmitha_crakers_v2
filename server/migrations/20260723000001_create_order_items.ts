import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("order_items", (table) => {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    // Nullable + kept as a snapshot (product_name/price at order time) so the
    // line item still reads correctly even if the product is later edited or removed.
    table
      .integer("product_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("products")
      .onDelete("SET NULL");
    table.string("product_name", 200).notNullable();
    table.integer("quantity").notNullable().defaultTo(1);
    table.decimal("price", 10, 2).notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("order_items");
}
