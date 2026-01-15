import { parseInt } from "lodash";

type TimePickerType = "hours" | "minutes";

interface GetValidNumberConfig {
  max: number;
  min?: number;
  loop?: boolean;
}

interface GetValidArrowNumberConfig {
  min: number;
  max: number;
  step: number;
}

function getValidNumber(value: string, { max, min = 0, loop = false }: GetValidNumberConfig) {
  let numericValue = parseInt(value, 10);

  if (!Number.isNaN(numericValue)) {
    if (loop) {
      if (numericValue > max) {
        numericValue = min;
      }
      if (numericValue < min) {
        numericValue = max;
      }
    } else {
      if (numericValue > max) {
        numericValue = max;
      }
      if (numericValue < min) {
        numericValue = min;
      }
    }
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

function isValidHour(value: string) {
  return /^(?:0\d|1\d|2[0-3])$/u.test(value);
}

function isValidMinute(value: string) {
  return /^[0-5]\d$/u.test(value);
}

function getValidHour(value: string) {
  if (isValidHour(value)) {
    return value;
  }
  return getValidNumber(value, { max: 23 });
}

function getValidMinute(value: string) {
  if (isValidMinute(value)) {
    return value;
  }
  return getValidNumber(value, { max: 59 });
}

function setMinutes(date: Date, value: string) {
  const minutes = getValidMinute(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

function setHours(date: Date, value: string) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}

function setDateByType(date: Date, value: string, type: TimePickerType) {
  if (type === "minutes") {
    return setMinutes(date, value);
  }
  return setHours(date, value);
}
function getDateByType(date: Date, type: TimePickerType) {
  if (type === "minutes") {
    return getValidMinute(date.getMinutes().toString());
  }
  return getValidHour(date.getHours().toString());
}

function getValidArrowNumber(value: string, { min, max, step }: GetValidArrowNumberConfig) {
  let numericValue = parseInt(value, 10);
  if (!Number.isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return "00";
}

function getValidArrowHour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 23, step });
}

function getValidArrowMinute(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}

function getArrowByType(value: string, step: number, type: TimePickerType) {
  if (type === "minutes") {
    return getValidArrowMinute(value, step);
  }
  return getValidArrowHour(value, step);
}

export { getDateByType, setDateByType, getArrowByType };
export type { TimePickerType };
