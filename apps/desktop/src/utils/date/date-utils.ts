/* eslint-disable max-lines */
 

 
/* eslint-disable complexity */
import {
  parseZonedDateTime,
  now,
  type ZonedDateTime,
  parseAbsolute,
  getLocalTimeZone,
} from "@internationalized/date";

export type TimeTemplateSlot = `${number}:${number}`;

export interface ZonedDateTimeRange {
  start: ZonedDateTime | undefined;
  end: ZonedDateTime | undefined;
}

export function isHourPassed(minutes: number): boolean {
  return minutes > 60;
}

export function isTimeBetween(minutes: number, min: number, max: number): boolean {
  return minutes >= min && minutes <= max;
}

export function calculateDuration(startDate: ZonedDateTime, endDate: ZonedDateTime): string {
  const durationInMs = endDate.toDate().getTime() - startDate.toDate().getTime();
  const durationInMinutes = Math.round(durationInMs / (1000 * 60));

  const durationHours = Math.floor(durationInMinutes / 60);
  const durationMinutes = durationInMinutes % 60;

  return `${durationHours.toString().padStart(2, "0")}h${durationMinutes
    .toString()
    .padStart(2, "0")}min`;
}

// Custom format function:

interface Locale {
  months: string[];
  monthsAbbrv: string[];
  weekdays: string[];
}

const localeFr: Locale = {
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],

  monthsAbbrv: [
    "Janv",
    "Févr",
    "Mars",
    "Avr",
    "Mai",
    "Juin",
    "Juill",
    "Août",
    "Sept",
    "Oct",
    "Nov",
    "Déc",
  ],

  weekdays: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
};

function padZero(number: number): string {
  return number < 10 ? `0${number}` : number.toString();
}

export function format(
  zonedDateTime: ZonedDateTime,
  format: string,
  options?: { locale?: Locale }
): string {
  const date: Date = zonedDateTime.toDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const weekday = date.getDay();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const locale = options?.locale ?? localeFr;

  return format.replaceAll(/E{4}|H{1,2}|M{1,4}|d{1,2}|m{1,2}|s{1,2}|y{4}/gu, (match) => {
    switch (match) {
      case "yyyy": {
        return year.toString();
      }
      case "MM": {
        return padZero(month + 1);
      }
      case "dd": {
        return padZero(day);
      }
      case "HH": {
        return padZero(hour);
      }
      case "mm": {
        return padZero(minute);
      }
      case "ss": {
        return padZero(second);
      }
      case "MMM": {
        return locale.monthsAbbrv[month] ?? "";
      }
      case "MMMM": {
        return locale.months[month] ?? "";
      }
      case "EEEE": {
        return locale.weekdays[weekday] ?? "";
      }
      default: {
        return match;
      }
    }
  });
}

interface DateDifference {
  days: number;
  hours: number;
  minutes: number;
  secondes: number;
}

export function getDifferenceBetweenZonedDates(
  zonedDate1: ZonedDateTime,
  zonedDate2: ZonedDateTime
) {
  const date1 = zonedDate1.toDate();
  const date2 = zonedDate2.toDate();

  const diff: DateDifference = { secondes: 0, minutes: 0, hours: 0, days: 0 };
  let temporary = Number(date1) - Number(date2);

  temporary = Math.floor(temporary / 1000);
  diff.secondes = temporary % 60;
  temporary = Math.floor((temporary - diff.secondes) / 60);
  diff.minutes = temporary % 60;
  temporary = Math.floor((temporary - diff.minutes) / 60);
  diff.hours = temporary % 24;
  temporary = Math.floor((temporary - diff.hours) / 24);
  diff.days = temporary;

  return diff;
}

export function getDifferenceBetweenZonedDatesInSeconds(
  zonedDate1: ZonedDateTime,
  zonedDate2: ZonedDateTime
): number {
  return (
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).days * 24 * 60 * 60 +
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).hours * 60 * 60 +
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).minutes * 60 +
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).secondes
  );
}

export function getDifferenceBetweenZonedDatesInMinutes(
  zonedDate1: ZonedDateTime,
  zonedDate2: ZonedDateTime
): number {
  return (
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).days * 24 * 60 +
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).hours * 60 +
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).minutes
  );
}

export function getDifferenceBetweenZonedDatesInHours(
  zonedDate1: ZonedDateTime,
  zonedDate2: ZonedDateTime
): number {
  return (
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).days * 24 +
    getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).hours
  );
}

export function getDifferenceBetweenZonedDatesInDays(
  zonedDate1: ZonedDateTime,
  zonedDate2: ZonedDateTime
): number {
  return getDifferenceBetweenZonedDates(zonedDate1, zonedDate2).days;
}

export function getDifferenceInMinutesBetweenDates(
  dateLeft: string,
  dateRight: string,
  timezone: string
): number {
  return getDifferenceBetweenZonedDates(
    parseAbsolute(dateLeft, timezone),
    parseAbsolute(dateRight, timezone)
  ).minutes;
}

export function getDifferenceInMinutesForNowZonedDate(dateA: string, timezone: string): number {
  if (dateA === "") {
    return 0;
  }
  const diff = getDifferenceBetweenZonedDates(now(timezone), parseZonedDateTime(dateA));

  const daysInMinutes = Math.abs(diff.days) * 24 * 60;

  const hoursInMinutes = Math.abs(diff.hours) * 60;

  return Math.abs(diff.minutes) + hoursInMinutes + daysInMinutes;
}

export function getDifferenceInMinutesForTicketAppointmentsZonedDate(
  dateA: string,
  timezone: string
): number {
  if (dateA === "") {
    return 0;
  }
  const diff = getDifferenceBetweenZonedDates(now(timezone), parseZonedDateTime(dateA));

  const daysInMinutes = diff.days * 24 * 60;

  const hoursInMinutes = diff.hours * 60;

  return diff.minutes < 0 || daysInMinutes < 0 || hoursInMinutes < 0
    ? 0
    : diff.minutes + hoursInMinutes + daysInMinutes;
}

export function daysToWeeks(days: number): number {
  return Math.floor(days / 7);
}

export function getTimeSince(date: string | null): string {
  if (date === null) {
    return "inconnu";
  }
  const zonedDate = parseZonedDateTime(date);
  const difference = getDifferenceBetweenZonedDates(
    now(zonedDate.timeZone),
    parseZonedDateTime(date)
  );

  if (difference.days > 0) {
    return `plus de ${difference.days} jour${difference.days > 1 ? "s" : ""}`;
  }

  if (difference.hours > 0) {
    return `${difference.hours} heure${difference.hours > 1 ? "s" : ""}`;
  }

  if (difference.minutes > 0) {
    return `${difference.minutes} minute${difference.minutes > 1 ? "s" : ""}`;
  }

  return `${difference.secondes} seconde${difference.secondes > 1 ? "s" : ""}`;
}

export function convertZonedDateStringToSameLocalTimeInOtherTimeZone(
  zonedDateString: string,
  otherTimeZone: string = getLocalTimeZone()
): string {
  return zonedDateString.replaceAll(
    /((\+|-)\d{2}:\d{2})?\[(\w|[-'])+(\/(\w|[-'])+)?\]$/gu,
    `[${otherTimeZone}]`
  );
}

export function convertAndParseZonedDateStringToSameLocalTimeInLocalTimeZone(
  zonedDateString: string
): ZonedDateTime {
  return parseZonedDateTime(convertZonedDateStringToSameLocalTimeInOtherTimeZone(zonedDateString));
}

export function convertAndParseZonedDateStringToSameLocalTimeInOtherTimeZone(
  zonedDateString: string,
  otherTimeZone: string
): ZonedDateTime {
  return parseZonedDateTime(
    convertZonedDateStringToSameLocalTimeInOtherTimeZone(zonedDateString, otherTimeZone)
  );
}

export function getNowZonedDateFromTimeZoneToSameLocalTimeInLocalTimeZone(
  timezone: string
): ZonedDateTime {
  return convertAndParseZonedDateStringToSameLocalTimeInLocalTimeZone(now(timezone).toString());
}

export function getAgeOfZonedDate(date: string): number {
  const zonedDate = parseZonedDateTime(date);
  const nowDate = now(zonedDate.timeZone).toDate();
  const birthDate = zonedDate.toDate();

  let age = nowDate.getFullYear() - birthDate.getFullYear();
  const month = nowDate.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && nowDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}
