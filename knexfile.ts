import type { Knex } from "knex";
import "dotenv/config";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT || "3306"),
      user: process.env.DATABASE_USER ,
      password: process.env.DATABASE_PASSWORD ,
      database: process.env.DATABASE_NAME ,
    },
    migrations: {
      extension: "ts",
      directory: "./server/migrations",
    },
    seeds: {
      extension: "ts",
      directory: "./server/seeds",
    },
  },
};

export default config;
