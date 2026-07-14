import { fromDate, parseZonedDateTime } from "@internationalized/date";

export function isZonedIso8601(dateString: string) {
  try {
    parseZonedDateTime(dateString);
    return true;
  } catch {
    return false;
  }
}

export function isFilterDateString(dateString: string) {
  try {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    fromDate(date, "UTC");
    return true;
  } catch {
    return false;
  }
}
