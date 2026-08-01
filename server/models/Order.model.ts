import db from "../db";
import { OrderItemModel, OrderItemInput } from "./OrderItem.model";

const table = () => db("orders");

async function nextOrderNumber() {
  const last = await table().orderBy("id", "desc").first();
  const nextId = (last?.id || 0) + 1;
  return `ORD-${String(nextId).padStart(3, "0")}`;
}

const itemsTotal = (items: OrderItemInput[] = []) =>
  items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);

export const OrderModel = {
  async findAll(filters: { search?: string; status?: string; from?: string; to?: string; category?: string } = {}) {
    let query = table().select("*");
    if (filters.search) {
      const q = filters.search;
      query = query.where((b) =>
        b.where("order_number", "like", `%${q}%`).orWhere("customer_name", "like", `%${q}%`).orWhere("phone", "like", `%${q}%`),
      );
    }
    if (filters.status) query = query.andWhere("status", filters.status);
    if (filters.category) query = query.andWhere("category", filters.category);
    if (filters.from) query = query.andWhere("order_date", ">=", filters.from);
    if (filters.to) query = query.andWhere("order_date", "<=", filters.to);
    const orders = await query.orderBy("id", "desc");

    // Attach each order's product list (one grouped query, not N+1) so the
    // admin table / PDF export always has line items available.
    const grouped = await OrderItemModel.findByOrderIds(orders.map((o: any) => o.id));
    return orders.map((o: any) => ({ ...o, items: grouped[o.id] || [] }));
  },

  async findById(id: number) {
    const order = await table().where({ id }).first();
    if (!order) return order;
    order.items = await OrderItemModel.findByOrderId(id);
    return order;
  },

  async findByOrderNumber(orderNumber: string) {
    return table().where({ order_number: orderNumber }).first();
  },

  async create(data: {
    customer_name: string;
    phone: string;
    address?: string;
    category?: string;
    total: number;
    status?: string;
    payment_method?: string;
    order_date?: string;
    items?: OrderItemInput[];
  }) {
    const order_number = await nextOrderNumber();
    // If line items were sent but no (or zero) total, derive the total from them.
    const total = data.total || (data.items?.length ? itemsTotal(data.items) : 0);
    const [id] = await table().insert({
      order_number,
      customer_name: data.customer_name,
      phone: data.phone,
      address: data.address || null,
      category: data.category || null,
      total,
      status: data.status || "Pending",
      payment_method: data.payment_method || "Pending",
      order_date: data.order_date || new Date().toISOString().slice(0, 10),
    });
    if (data.items?.length) {
      await OrderItemModel.createMany(id, data.items);
    }
    return this.findById(id);
  },

  async updateStatus(id: number, status: string) {
    await table().where({ id }).update({ status, updated_at: db.fn.now() });
    return this.findById(id);
  },

  async updatePaymentMethod(id: number, payment_method: string) {
    await table().where({ id }).update({ payment_method, updated_at: db.fn.now() });
    return this.findById(id);
  },

  async update(
    id: number,
    data: Partial<{
      customer_name: string;
      phone: string;
      address: string;
      category: string;
      total: number;
      status: string;
      payment_method: string;
      items: OrderItemInput[];
    }>,
  ) {
    const { items, ...rest } = data;
    const update: Record<string, any> = { ...rest, updated_at: db.fn.now() };
    if (items && !data.total) {
      update.total = itemsTotal(items);
    }
    await table().where({ id }).update(update);
    if (items) {
      await OrderItemModel.replaceForOrder(id, items);
    }
    return this.findById(id);
  },

  async remove(id: number) {
    // order_items has ON DELETE CASCADE, but clean up explicitly too in case
    // the DB engine/table doesn't enforce the FK (e.g. older MyISAM tables).
    await OrderItemModel.removeByOrderId(id);
    return table().where({ id }).del();
  },
};
