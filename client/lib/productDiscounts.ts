import { api } from "./api";

// Invoices should always show each product's *current* discount, not
// whatever was cached on the cart item or stored on an older order line
// (e.g. orders placed before discount tracking existed, or a cart that was
// added to before a product's discount was set/changed). This fetches the
// live discount_percent straight from GET /products and returns it keyed by
// product id (as a string) for easy lookup.
export async function fetchProductDiscountMap(): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const res = await api.get<{ data: any[] }>("/products");
    for (const p of res.data || []) {
      map.set(String(p.id), Number(p.discount_percent) || 0);
    }
  } catch {
    // Network failure — caller should fall back to whatever discount value
    // it already has (cart/order snapshot), if any.
  }
  return map;
}
