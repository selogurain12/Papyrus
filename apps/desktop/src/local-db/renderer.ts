import type { LocalDatabaseApi } from "./types";

export function getLocalDatabaseApi(): LocalDatabaseApi {
  if (!window.papyrusLocalDb) {
    throw new Error("La base locale Papyrus n'est pas disponible dans cette fenetre.");
  }

  return window.papyrusLocalDb;
}
