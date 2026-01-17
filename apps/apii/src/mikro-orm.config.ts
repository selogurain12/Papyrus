import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";

export default defineConfig({
  driver: PostgreSqlDriver,
  allowGlobalContext: true,

  entities: ["dist/apps/apii/**/*.entity.js"],

  migrations: {
    path: "apps/apii/src/migrations",
    pathTs: "apps/apii/src/migrations",
  },

  host: process.env.DBHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  dbName: process.env.PGDATABASE,
});
