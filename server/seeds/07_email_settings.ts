import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("email_settings").del();
  await knex("email_settings").insert([
    {
      id: 1,
      smtp_host: "smtp.gmail.com",
      smtp_port: 587,
      smtp_user: "",
      smtp_pass: "",
      from_name: "Fire Crackers",
      from_email: "noreply@firecrackers.com",
      secure: false,
    },
  ]);
}
