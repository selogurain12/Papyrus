import { getLocalTimeZone, parseZonedDateTime } from "@internationalized/date";
import {
  calculateDuration,
  convertZonedDateStringToSameLocalTimeInOtherTimeZone,
  daysToWeeks,
  format,
  getAgeOfZonedDate,
  getDifferenceInMinutesBetweenDates,
  getDifferenceInMinutesForNowZonedDate,
  getDifferenceInMinutesForTicketAppointmentsZonedDate,
  getTimeSince,
  convertAndParseZonedDateStringToSameLocalTimeInLocalTimeZone,
  convertAndParseZonedDateStringToSameLocalTimeInOtherTimeZone,
  getDifferenceBetweenZonedDates,
  getDifferenceBetweenZonedDatesInDays,
  getDifferenceBetweenZonedDatesInHours,
  getDifferenceBetweenZonedDatesInMinutes,
  getDifferenceBetweenZonedDatesInSeconds,
  isHourPassed,
  isTimeBetween,
  parseZonedDateTimeInLocalTimeZone,
} from "../../../../apps/desktop/src/utils/date/date-utils";

describe("date utils", () => {
  const start = parseZonedDateTime("2026-07-14T10:15:00[Europe/Paris]");
  const end = parseZonedDateTime("2026-07-15T12:45:00[Europe/Paris]");

  it("checks hour and range helpers", () => {
    expect(isHourPassed(61)).toBe(true);
    expect(isHourPassed(60)).toBe(false);
    expect(isTimeBetween(30, 15, 45)).toBe(true);
    expect(isTimeBetween(10, 15, 45)).toBe(false);
  });

  it("formats durations and localized dates", () => {
    expect(calculateDuration(start, end)).toBe("26h30min");
    expect(format(start, "EEEE dd MMMM yyyy HH:mm:ss")).toBe("mardi 14 Juillet 2026 10:15:00");
    expect(format(start, "dd MMM yyyy")).toBe("14 Juill 2026");
    expect(format(start, "MM")).toBe("07");
  });

  it("computes differences between zoned dates", () => {
    expect(getDifferenceBetweenZonedDates(end, start)).toEqual({
      days: 1,
      hours: 2,
      minutes: 30,
      secondes: 0,
    });
    expect(getDifferenceBetweenZonedDatesInSeconds(end, start)).toBe(95_400);
    expect(getDifferenceBetweenZonedDatesInMinutes(end, start)).toBe(1_590);
    expect(getDifferenceBetweenZonedDatesInHours(end, start)).toBe(26);
    expect(getDifferenceBetweenZonedDatesInDays(end, start)).toBe(1);
  });

  it("converts timezone suffix while preserving local time", () => {
    expect(
      convertZonedDateStringToSameLocalTimeInOtherTimeZone(
        "2026-07-14T10:15:00+02:00[Europe/Paris]",
        "UTC"
      )
    ).toBe("2026-07-14T10:15:00[UTC]");
    expect(
      convertAndParseZonedDateStringToSameLocalTimeInOtherTimeZone(
        "2026-07-14T10:15:00[Europe/Paris]",
        "UTC"
      ).timeZone
    ).toBe("UTC");
    expect(
      convertAndParseZonedDateStringToSameLocalTimeInLocalTimeZone(
        "2026-07-14T10:15:00[Europe/Paris]"
      ).toString()
    ).toContain("2026-07-14T10:15:00");
  });

  it("converts a zoned date instant to the local timezone", () => {
    const utcDate = parseZonedDateTime("2026-07-09T17:36:00[UTC]");
    const localDate = parseZonedDateTimeInLocalTimeZone(utcDate.toString());

    expect(localDate.timeZone).toBe(getLocalTimeZone());
    expect(localDate.toDate().toISOString()).toBe(utcDate.toDate().toISOString());
  });

  it("converts days to weeks and computes age", () => {
    expect(daysToWeeks(15)).toBe(2);
    expect(getAgeOfZonedDate("2000-01-01T00:00:00[Europe/Paris]")).toBeGreaterThanOrEqual(26);
    expect(getAgeOfZonedDate("2000-12-31T00:00:00[Europe/Paris]")).toBeGreaterThanOrEqual(25);
  });

  it("handles minute differences and empty relative dates", () => {
    expect(
      getDifferenceInMinutesBetweenDates(
        "2026-07-14T10:30:00.000Z",
        "2026-07-14T10:15:00.000Z",
        "UTC"
      )
    ).toBe(15);
    expect(getDifferenceInMinutesForNowZonedDate("", "UTC")).toBe(0);
    expect(getDifferenceInMinutesForTicketAppointmentsZonedDate("", "UTC")).toBe(0);
    expect(getTimeSince(null)).toBe("inconnu");
  });
});
