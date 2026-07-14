import { getArrowByType, getDateByType, setDateByType } from "../../../apps/desktop/src/utils/time-picker-utils";

describe("time picker utils", () => {
  it("reads padded hours and minutes", () => {
    const date = new Date(2026, 6, 14, 4, 5);

    expect(getDateByType(date, "hours")).toBe("04");
    expect(getDateByType(date, "minutes")).toBe("05");
  });

  it("sets hours and minutes with clamped invalid values", () => {
    const date = new Date("2026-07-14T00:00:00.000Z");

    setDateByType(date, "29", "hours");
    setDateByType(date, "99", "minutes");

    expect(date.getHours()).toBe(23);
    expect(date.getMinutes()).toBe(59);
  });

  it("loops values when using keyboard arrows", () => {
    expect(getArrowByType("23", 1, "hours")).toBe("00");
    expect(getArrowByType("00", -1, "hours")).toBe("23");
    expect(getArrowByType("59", 1, "minutes")).toBe("00");
    expect(getArrowByType("abc", 1, "minutes")).toBe("00");
  });
});
