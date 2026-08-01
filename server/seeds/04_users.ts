import type { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();
  const passwordHash = bcrypt.hashSync("admin123", 10);
  await knex("users").insert([
    {
      name: "Admin",
      email: "admin@firecrackers.com",
      password: passwordHash,
      role: "admin",
    },
    {
      name: "Ravi Kumar",
      email: "ravi@example.com",
      password: bcrypt.hashSync("password123", 10),
      role: "customer",
    },
    {
      name: "Priya Sharma",
      email: "priya@example.com",
      password: bcrypt.hashSync("password123", 10),
      role: "customer",
    },
  ]);
}
