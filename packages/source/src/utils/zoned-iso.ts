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
    fromDate(new Date(dateString), "UTC");
    return true;
  } catch {
    return false;
  }
}
