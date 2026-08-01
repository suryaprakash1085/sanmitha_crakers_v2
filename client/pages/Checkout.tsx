import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Country, State, City } from "country-state-city";
import { settingsStore } from "@/lib/appSettings";
import { buildInvoicePdf } from "@/lib/invoicePdf";
import { notifications } from "@/lib/notifications";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, updateQty, remove, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", country: "IN", state: "", city: "", pincode: "" });
  const [submitting, setSubmitting] = useState(false);

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => (form.country ? State.getStatesOfCountry(form.country) : []), [form.country]);
  const cities = useMemo(() => (form.country && form.state ? City.getCitiesOfState(form.country, form.state) : []), [form.country, form.state]);

  const update = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const placeOrder = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill name, phone & address");
      return;
    }

    setSubmitting(true);
    const pdfCfg = settingsStore.getPdf();
    const invoiceNo = `${pdfCfg.invoicePrefix || "INV"}-${Date.now().toString().slice(-6)}`;
    const countryName = countries.find(c => c.isoCode === form.country)?.name || "";
    const stateName = states.find(s => s.isoCode === form.state)?.name || "";

    const doc = buildInvoicePdf(pdfCfg, {
      invoiceNo,
      date: new Date().toLocaleDateString("en-GB"),
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        state: stateName,
        country: countryName,
        pincode: form.pincode,
      },
      dropLocation: [form.name, form.city].filter(Boolean).join(", "),
      items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price, unit: "-" })),
      total,
      tax: 0,
    });

    doc.save(`${invoiceNo}.pdf`);


    notifications.push({
      type: "order",
      title: `New Order · ${invoiceNo}`,
      message: `${form.name} placed an order of ₹${total} (${items.length} item${items.length > 1 ? "s" : ""})`,
      meta: { invoiceNo, total, customer: form.name },
    });

    toast.success("Order placed! Invoice downloaded 🎆");
    clear();
    setSubmitting(false);
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl font-bold text-gradient-festive mb-2"
        >
          Checkout
        </motion.h1>
        <p className="text-muted-foreground mb-8">Enter your details and place the order</p>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          {/* Customer Details Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-3xl p-6 md:p-8 space-y-5 h-fit"
          >
            <h2 className="font-display font-bold text-2xl mb-2">Customer Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="9876543210" />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" />
            </div>

            <div>
              <Label>Address *</Label>
              <Textarea value={form.address} onChange={e => update("address", e.target.value)} placeholder="House no, street, area" rows={3} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Country</Label>
                <Select value={form.country} onValueChange={v => setForm(f => ({ ...f, country: v, state: "", city: "" }))}>
                  <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {countries.map(c => (
                      <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>State</Label>
                <Select value={form.state} onValueChange={v => setForm(f => ({ ...f, state: v, city: "" }))} disabled={!states.length}>
                  <SelectTrigger><SelectValue placeholder={states.length ? "Select state" : "No states"} /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {states.map(s => (
                      <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                {cities.length > 0 ? (
                  <Select value={form.city} onValueChange={v => update("city", v)}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {cities.map(ci => (
                        <SelectItem key={`${ci.name}-${ci.latitude}-${ci.longitude}`} value={ci.name}>{ci.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={form.city} onChange={e => update("city", e.target.value)} placeholder="City" />
                )}
              </div>
              <div>
                <Label>Pincode</Label>
                <Input value={form.pincode} onChange={e => update("pincode", e.target.value)} placeholder="600001" />
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-3xl p-6 space-y-4 h-fit lg:sticky lg:top-24"
          >
            <h2 className="font-display font-bold text-xl flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Order Summary
            </h2>

            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Your cart is empty</p>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {items.map(i => (
                  <div key={i.id} className="flex gap-3 items-center bg-secondary/30 rounded-xl p-2">
                    <img src={i.image} alt={i.name} className="w-14 h-14 object-contain rounded-lg bg-background/50" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{i.name}</div>
                      <div className="text-xs text-muted-foreground">₹{i.price}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQty(i.id, i.qty - 1)} className="w-6 h-6 rounded-full bg-primary/10 grid place-items-center hover:bg-primary/20"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-semibold w-5 text-center">{i.qty}</span>
                        <button onClick={() => updateQty(i.id, i.qty + 1)} className="w-6 h-6 rounded-full bg-primary/10 grid place-items-center hover:bg-primary/20"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span><span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery</span><span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-gradient-festive font-display text-2xl">₹{total}</span>
              </div>
            </div>

            <Button
              onClick={placeOrder}
              disabled={submitting || items.length === 0}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-orange-500 hover:opacity-90"
            >
              {submitting ? "Processing..." : "Place Order & Download PDF"}
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
