import { isFilterDateString, isZonedIso8601 } from "../../../packages/source/src/utils/zoned-iso";

describe("zoned iso utilities", () => {
  it("accepts a zoned date time with bracketed time zone", () => {
    expect(isZonedIso8601("2026-07-14T23:59[Europe/Paris]")).toBe(true);
  });

  it("rejects a regular ISO date without time zone identifier", () => {
    expect(isZonedIso8601("2026-07-14T23:59:00.000Z")).toBe(false);
  });

  it("accepts dates usable by filters", () => {
    expect(isFilterDateString("2026-07-14")).toBe(true);
  });

  it("rejects impossible date values", () => {
    expect(isFilterDateString("not-a-date")).toBe(false);
  });
});
