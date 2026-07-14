import { localStorageBasePrefixVariable } from "../../../apps/desktop/src/utils/local-storage-base-prefix-variable";

describe("localStorageBasePrefixVariable", () => {
  it("prefixes keys with the API base URL", () => {
    expect(localStorageBasePrefixVariable("token")).toBe("http://localhost:3000/token");
  });
});
