import db from "../db";

const table = () => db("order_items");

export interface OrderItemInput {
  product_id?: number | null;
  product_name: string;
  quantity: number;
  price: number;
}

export const OrderItemModel = {
  async findByOrderId(orderId: number) {
    return table().where({ order_id: orderId }).orderBy("id", "asc");
  },

  // Attaches an `items` array to each order in the list (one extra query,
  // not N+1) — used by OrderModel.findAll so the admin table/PDF always has
  // the product list available without a per-row round trip.
  async findByOrderIds(orderIds: number[]) {
    if (!orderIds.length) return {};
    const rows = await table().whereIn("order_id", orderIds).orderBy("id", "asc");
    const grouped: Record<number, any[]> = {};
    for (const row of rows) {
      (grouped[row.order_id] ||= []).push(row);
    }
    return grouped;
  },

  async createMany(orderId: number, items: OrderItemInput[] = []) {
    const rows = items
      .filter((it) => it.product_name?.trim() && it.quantity > 0)
      .map((it) => ({
        order_id: orderId,
        product_id: it.product_id || null,
        product_name: it.product_name.trim(),
        quantity: it.quantity,
        price: it.price || 0,
      }));
    if (rows.length) await table().insert(rows);
    return this.findByOrderId(orderId);
  },

  // Used on update: wipe the old line items and insert the new set.
  async replaceForOrder(orderId: number, items: OrderItemInput[] = []) {
    await table().where({ order_id: orderId }).del();
    return this.createMany(orderId, items);
  },

  async removeByOrderId(orderId: number) {
    return table().where({ order_id: orderId }).del();
  },
};
