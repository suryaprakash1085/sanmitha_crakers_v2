import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("company_settings", (table) => {
    table.string("bank_name", 150).nullable();
    table.string("account_holder_name", 150).nullable();
    table.string("account_number", 50).nullable();
    table.string("account_type", 30).nullable();
    table.string("ifsc_code", 20).nullable();
    table.string("upi_id", 100).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("company_settings", (table) => {
    table.dropColumn("bank_name");
    table.dropColumn("account_holder_name");
    table.dropColumn("account_number");
    table.dropColumn("account_type");
    table.dropColumn("ifsc_code");
    table.dropColumn("upi_id");
  });
}
