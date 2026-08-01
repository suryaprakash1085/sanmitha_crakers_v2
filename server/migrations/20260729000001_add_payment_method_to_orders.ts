import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table
      .enum("payment_method", ["Pending", "Cash on Delivery", "Online Payment", "UPI", "Card"])
      .notNullable()
      .defaultTo("Pending");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("payment_method");
  });
}
