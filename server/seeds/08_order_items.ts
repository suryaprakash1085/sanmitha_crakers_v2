import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("order_items").del();

  const orders = await knex("orders").select("id", "order_number");
  const byNumber = Object.fromEntries(orders.map((o) => [o.order_number, o.id]));
  const products = await knex("products").select("id", "name", "price").orderBy("id", "asc");

  if (!products.length || !orders.length) return;

  const rows = [
    { order_number: "ORD-001", product: products[0], quantity: 2 },
    { order_number: "ORD-001", product: products[8], quantity: 1 },
    { order_number: "ORD-002", product: products[3], quantity: 3 },
    { order_number: "ORD-003", product: products[5], quantity: 5 },
    { order_number: "ORD-003", product: products[7], quantity: 2 },
    { order_number: "ORD-004", product: products[9], quantity: 1 },
  ]
    .filter((r) => byNumber[r.order_number] && r.product)
    .map((r) => ({
      order_id: byNumber[r.order_number],
      product_id: r.product.id,
      product_name: r.product.name,
      quantity: r.quantity,
      price: r.product.price,
    }));

  if (rows.length) await knex("order_items").insert(rows);
}
