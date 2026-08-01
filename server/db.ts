import knex from "knex";
import "dotenv/config";

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME ,
    // mysql2 returns DECIMAL columns as strings by default, which causes
    // "0" + "450.00" style string concatenation bugs when summing amounts.
    // decimalNumbers makes it return them as JS numbers instead.
    decimalNumbers: true,
  },
});

export default db;
