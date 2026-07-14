import { formatDistanceToNow } from "../../../../apps/desktop/src/utils/date/format-distance";

jest.mock("@internationalized/date", () => ({
  now: () => ({
    toDate: () => new Date("2026-07-14T12:00:00.000Z"),
  }),
}));

function zonedDate(date: string) {
  return {
    toDate: () => new Date(date),
  } as any;
}

describe("formatDistanceToNow", () => {
  it("formats future and recent dates", () => {
    expect(formatDistanceToNow(zonedDate("2026-07-14T12:01:00.000Z"))).toBe("Aujourd'hui");
    expect(formatDistanceToNow(zonedDate("2026-07-14T11:59:30.000Z"))).toBe(
      "Il y a moins d'une minute"
    );
  });

  it("formats minute, hour, day, week and month distances", () => {
    expect(formatDistanceToNow(zonedDate("2026-07-14T11:50:00.000Z"))).toBe(
      "Il y a 10 minute(s)"
    );
    expect(formatDistanceToNow(zonedDate("2026-07-14T09:30:00.000Z"))).toBe(
      "Il y a 3 heure(s)"
    );
    expect(formatDistanceToNow(zonedDate("2026-07-11T12:00:00.000Z"))).toBe("Il y a 3 jour(s)");
    expect(formatDistanceToNow(zonedDate("2026-06-30T12:00:00.000Z"))).toBe(
      "Il y a 2 semaine(s)"
    );
    expect(formatDistanceToNow(zonedDate("2026-05-01T12:00:00.000Z"))).toBe("Il y a 2 mois");
  });
});
