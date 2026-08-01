import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { FormModal } from "@/components/admin/FormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TableFilters } from "@/components/admin/TableFilters";
import { useCrudModal } from "@/hooks/useCrudModal";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePagePermissions } from "@/hooks/useAccessControl";
import { settingsStore } from "@/lib/appSettings";
import { buildInvoicePdf } from "@/lib/invoicePdf";

type Status = "Pending" | "Processing" | "Shipped" | "Delivered";
type PaymentMethod = "Pending" | "Cash on Delivery" | "Online Payment" | "UPI" | "Card";

interface OrderItem {
  id?: number;
  product_id?: number | null;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: Status;
  payment_method: PaymentMethod;
  order_date: string;
  phone: string;
  address: string;
  items?: OrderItem[];
}

interface ProductOption {
  id: number;
  name: string;
  price: number;
}

const statusVariants: Record<Status, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
};

const paymentMethodVariants: Record<PaymentMethod, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  "Cash on Delivery": "bg-orange-100 text-orange-800",
  "Online Payment": "bg-green-100 text-green-800",
  UPI: "bg-teal-100 text-teal-800",
  Card: "bg-indigo-100 text-indigo-800",
};

const paymentMethodOptions: PaymentMethod[] = ["Pending", "Cash on Delivery", "Online Payment", "UPI", "Card"];

export default function Orders() {
  const perms = usePagePermissions("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const modal = useCrudModal<Order>();
  const [editStatus, setEditStatus] = useState<Status>("Pending");
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod>("Pending");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("__all__");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const emptyOrderForm = { customer_name: "", phone: "", address: "", total: 0, payment_method: "Pending" as PaymentMethod };
  const [orderForm, setOrderForm] = useState(emptyOrderForm);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [pickProductId, setPickProductId] = useState("");
  const [pickQty, setPickQty] = useState(1);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "__all__") params.set("status", statusFilter);
      const res = await api.get<{ data: Order[] }>(`/orders?${params.toString()}`);
      setOrders(res.data.map((o: any) => ({ ...o, total: Number(o.total) })));
    } catch (err: any) {
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get<{ data: any[] }>("/products");
      setProducts(res.data.map((p) => ({ id: p.id, name: p.name, price: Number(p.price) })));
    } catch {
      // product list is only used to speed up order entry; failing silently
      // still lets the admin type a manual total.
    }
  };

  useEffect(() => { load(); }, [search, statusFilter]);
  useEffect(() => { loadProducts(); }, []);

  const filtered = useMemo(() => orders, [orders]);

  const itemsTotal = (items: OrderItem[]) => items.reduce((s, it) => s + it.price * it.quantity, 0);

  const addOrderItem = () => {
    const product = products.find((p) => String(p.id) === pickProductId);
    if (!product) {
      toast.error("Pick a product first");
      return;
    }
    if (pickQty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    setOrderItems((prev) => {
      const existing = prev.find((it) => it.product_id === product.id);
      const next = existing
        ? prev.map((it) => (it.product_id === product.id ? { ...it, quantity: it.quantity + pickQty } : it))
        : [...prev, { product_id: product.id, product_name: product.name, quantity: pickQty, price: product.price }];
      setOrderForm((f) => ({ ...f, total: itemsTotal(next) }));
      return next;
    });
    setPickProductId("");
    setPickQty(1);
  };

  const removeOrderItem = (productId: number | null | undefined, productName: string) => {
    setOrderItems((prev) => {
      const next = prev.filter((it) => !(it.product_id === productId && it.product_name === productName));
      setOrderForm((f) => ({ ...f, total: itemsTotal(next) }));
      return next;
    });
  };

  const onEdit = (o: Order) => { setEditStatus(o.status); setEditPaymentMethod(o.payment_method || "Pending"); modal.openEdit(o); };
  const save = async () => {
    if (modal.item) {
      try {
        await api.put(`/orders/${modal.item.id}/status`, { status: editStatus });
        await api.put(`/orders/${modal.item.id}/payment-method`, { payment_method: editPaymentMethod });
        toast.success("Order updated");
        modal.close();
        load();
      } catch (err: any) {
        toast.error(err.message || "Update failed");
      }
    }
  };
  const onCreate = () => { setOrderForm(emptyOrderForm); setOrderItems([]); setPickProductId(""); setPickQty(1); setCreateOpen(true); };
  const saveNewOrder = async () => {
    if (!orderForm.customer_name.trim() || !orderForm.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    setCreating(true);
    try {
      await api.post("/orders", { ...orderForm, items: orderItems });
      toast.success("Order added");
      setCreateOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to add order");
    } finally {
      setCreating(false);
    }
  };
  const confirmDelete = async () => {
    if (modal.deleteItem) {
      try {
        await api.del(`/orders/${modal.deleteItem.id}`);
        toast.success("Order deleted");
        modal.closeDelete();
        load();
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  const downloadOrderPdf = async (o: Order) => {
    setDownloadingId(o.id);
    try {
      // Row data may not carry the product list, so fetch the full order first.
      const res = await api.get<{ data: Order }>(`/orders/${o.id}`);
      const full = res.data;
      const pdfCfg = settingsStore.getPdf();
      const items = (full.items && full.items.length ? full.items : []).map((it) => ({
        name: it.product_name,
        qty: it.quantity,
        price: it.price,
        unit: "-",
      }));
      const doc = buildInvoicePdf(pdfCfg, {
        invoiceNo: full.order_number,
        date: full.order_date,
        customer: { name: full.customer_name, phone: full.phone, address: full.address },
        items: items.length ? items : [{ name: "Order total", qty: 1, price: Number(full.total), unit: "-" }],
        total: Number(full.total),
        tax: 0,
      });
      doc.save(`${full.order_number}.pdf`);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const columns: Column<Order>[] = [
    { header: "Order ID", cell: (o) => <span className="font-mono">{o.order_number}</span> },
    { header: "Customer", cell: (o) => o.customer_name },
    { header: "Phone", cell: (o) => o.phone },
    { header: "Date", cell: (o) => o.order_date },
    { header: "Total", cell: (o) => `₹${o.total}` },
    { header: "Status", cell: (o) => <Badge className={statusVariants[o.status]}>{o.status}</Badge> },
    {
      header: "Payment Method",
      cell: (o) => (
        <Badge className={paymentMethodVariants[o.payment_method || "Pending"]}>
          {o.payment_method || "Pending"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (o) => (
        <RowActions
          onView={() => modal.openView(o)}
          onEdit={perms.put ? () => onEdit(o) : undefined}
          onDelete={perms.delete ? () => modal.openDelete(o) : undefined}
          onDownload={() => downloadOrderPdf(o)}
          downloadTitle={downloadingId === o.id ? "Generating..." : "Download PDF"}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="View and update order statuses"
        action={perms.post ? <Button onClick={onCreate}><Plus className="h-4 w-4" /> Add Order</Button> : undefined}
      />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by order ID, customer, phone..."
        filters={[{
          label: "Status",
          value: "status",
          current: statusFilter,
          onChange: setStatusFilter,
          options: ["Pending", "Processing", "Shipped", "Delivered"].map(s => ({ label: s, value: s })),
        }]}
      />
      <DataTable columns={columns} data={filtered} rowKey={(o) => o.id} empty={loading ? "Loading..." : "No orders found"} />

      <FormModal
        open={modal.isOpen}
        onOpenChange={modal.setOpen}
        title={modal.mode === "view" ? `Order ${modal.item?.order_number}` : `Update ${modal.item?.order_number}`}
        onSubmit={save}
        readOnly={modal.mode === "view"}
      >
        {modal.item && (
          <div className="space-y-3">
            <div><Label>Customer</Label><p className="font-medium">{modal.item.customer_name}</p></div>
            <div><Label>Phone</Label><p>{modal.item.phone}</p></div>
            <div><Label>Address</Label><p>{modal.item.address}</p></div>
            <div><Label>Date</Label><p>{modal.item.order_date}</p></div>
            <div>
              <Label>Products</Label>
              {modal.item.items && modal.item.items.length > 0 ? (
                <div className="border rounded-md divide-y mt-1">
                  {modal.item.items.map((it, i) => (
                    <div key={it.id ?? i} className="flex items-center justify-between px-3 py-1.5 text-sm">
                      <span>{it.product_name} <span className="text-slate-400">× {it.quantity}</span></span>
                      <span className="font-medium">₹{(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 mt-1">No products listed for this order.</p>
              )}
            </div>
            <div><Label>Total</Label><p className="text-lg font-bold">₹{modal.item.total}</p></div>
            <div>
              <Label>Status</Label>
              {modal.mode === "view" ? (
                <Badge className={statusVariants[modal.item.status]}>{modal.item.status}</Badge>
              ) : (
                <Select value={editStatus} onValueChange={(v) => setEditStatus(v as Status)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <Label>Payment Method</Label>
              {modal.mode === "view" ? (
                <Badge className={paymentMethodVariants[modal.item.payment_method || "Pending"]}>
                  {modal.item.payment_method || "Pending"}
                </Badge>
              ) : (
                <Select value={editPaymentMethod} onValueChange={(v) => setEditPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map((pm) => (
                      <SelectItem key={pm} value={pm}>{pm}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}
      </FormModal>

      <FormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add Order"
        onSubmit={saveNewOrder}
        submitText={creating ? "Saving..." : "Save"}
      >
        <div className="space-y-3">
          <div><Label>Customer Name</Label><Input value={orderForm.customer_name} onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} /></div>
          <div><Label>Address</Label><Textarea value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} /></div>
          <div>
            <Label>Payment Method</Label>
            <Select value={orderForm.payment_method} onValueChange={(v) => setOrderForm({ ...orderForm, payment_method: v as PaymentMethod })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map((pm) => (
                  <SelectItem key={pm} value={pm}>{pm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Products</Label>
            <div className="flex gap-2">
              <Select value={pickProductId} onValueChange={setPickProductId}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Select a product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name} — ₹{p.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={1}
                value={pickQty}
                onChange={(e) => setPickQty(Math.max(1, +e.target.value))}
                className="w-20"
              />
              <Button type="button" variant="outline" onClick={addOrderItem}>Add</Button>
            </div>
            {orderItems.length > 0 && (
              <div className="border rounded-md divide-y">
                {orderItems.map((it, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-1.5 text-sm">
                    <span>{it.product_name} <span className="text-slate-400">× {it.quantity}</span></span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">₹{(it.price * it.quantity).toFixed(2)}</span>
                      <button type="button" onClick={() => removeOrderItem(it.product_id, it.product_name)} className="text-slate-400 hover:text-red-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Total (₹)</Label>
            <Input type="number" value={orderForm.total} onChange={(e) => setOrderForm({ ...orderForm, total: +e.target.value })} />
            {orderItems.length > 0 && <p className="text-xs text-slate-400 mt-1">Auto-filled from products above — you can still adjust it.</p>}
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={modal.isDeleteOpen}
        onOpenChange={modal.setDeleteOpen}
        description={`Delete order ${modal.deleteItem?.order_number}?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
