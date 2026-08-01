import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("orders").del();
  await knex("orders").insert([
    {
      order_number: "ORD-001",
      customer_name: "Ravi Kumar",
      phone: "+91 98765 43210",
      address: "123 MG Road, Chennai",
      category: "Rockets",
      total: 1499,
      status: "Pending",
      order_date: "2026-04-22",
    },
    {
      order_number: "ORD-002",
      customer_name: "Priya Sharma",
      phone: "+91 99887 76655",
      address: "45 Park Street, Mumbai",
      category: "Sparklers",
      total: 899,
      status: "Shipped",
      order_date: "2026-04-21",
    },
    {
      order_number: "ORD-003",
      customer_name: "Arjun Patel",
      phone: "+91 90909 80808",
      address: "78 Lake View, Bangalore",
      category: "Bombs",
      total: 2499,
      status: "Delivered",
      order_date: "2026-04-20",
    },
    {
      order_number: "ORD-004",
      customer_name: "Meera Iyer",
      phone: "+91 91234 56789",
      address: "12 Beach Road, Kochi",
      category: "Fountains",
      total: 599,
      status: "Processing",
      order_date: "2026-04-22",
    },
  ]);
}
