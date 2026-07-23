import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { loadApiEnv } from "./utils/load-api-env";

loadApiEnv();

export default defineConfig({
  driver: PostgreSqlDriver,
  allowGlobalContext: true,

  entities: ["dist/apps/apii/**/*.entity.js"],

  migrations: {
    path: "dist/apps/apii/apps/apii/src/migrations",
    pathTs: "apps/apii/src/migrations",
  },

  host: process.env.DBHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  dbName: process.env.PGDATABASE,
});
