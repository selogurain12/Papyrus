import { getLocalDatabaseApi } from "../../../apps/desktop/src/local-db/renderer";
import type { LocalDatabaseApi } from "../../../apps/desktop/src/local-db/types";

describe("local database renderer bridge", () => {
  it("returns the Electron local database bridge when available", () => {
    const localDb = {} as LocalDatabaseApi;
    Object.defineProperty(window, "papyrusLocalDb", {
      configurable: true,
      value: localDb,
    });

    expect(getLocalDatabaseApi()).toBe(localDb);
  });

  it("fails clearly when the Electron local database bridge is missing", () => {
    Object.defineProperty(window, "papyrusLocalDb", {
      configurable: true,
      value: undefined,
    });

    expect(() => getLocalDatabaseApi()).toThrow(
      "La base locale Papyrus n'est pas disponible dans cette fenetre."
    );
  });
});
