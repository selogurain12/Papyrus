import BetterSqlite3, { type Database } from "better-sqlite3";
import { app } from "electron";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import { runMigrations } from "./migrations";

let database: Database | null = null;

function getNativeBindingPath(): string | undefined {
  const candidates = [
    path.join(process.cwd(), ".native", "better_sqlite3-electron.node"),
    path.join(process.cwd(), "apps/desktop/.native", "better_sqlite3-electron.node"),
    path.join(app.getAppPath(), ".native", "better_sqlite3-electron.node"),
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

export function getLocalDatabase(): Database {
  if (database) {
    return database;
  }

  const databaseDirectory = path.join(app.getPath("userData"), "offline");
  mkdirSync(databaseDirectory, { recursive: true });

  database = new BetterSqlite3(path.join(databaseDirectory, "papyrus.sqlite"), {
    nativeBinding: getNativeBindingPath(),
  });
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  runMigrations(database);

  return database;
}
