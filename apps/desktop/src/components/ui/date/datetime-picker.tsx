import { fromDate, getLocalTimeZone, now, parseZonedDateTime } from "@internationalized/date";
import { AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import React, { type InputHTMLAttributes, useRef } from "react";
import { fr } from "date-fns/locale";
import type { Matcher } from "react-day-picker";
import { useTranslation } from "react-i18next";

import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "../../../lib/utils";
import { format, parseZonedDateTimeInLocalTimeZone } from "../../../utils/date/date-utils";
import { Calendar } from "../calendar";

import { TimePickerInput } from "./time-picker-input";

interface DateTimePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  changeValue: (date: string) => void;
  errorIcon?: boolean;
  isError?: boolean;
  disabledRange: Matcher | Matcher[] | undefined;
  toYear?: number;
}

// eslint-disable-next-line complexity
export function DateTimePicker({
  value,
  changeValue,
  disabled,
  errorIcon = false,
  isError = false,
  disabledRange,
  toYear = undefined,
}: DateTimePickerProps) {
  const { t, i18n } = useTranslation();
  const hourReference = useRef<HTMLInputElement>(null);
  const minuteReference = useRef<HTMLInputElement>(null);
  const localValue = value === undefined ? undefined : parseZonedDateTimeInLocalTimeZone(value);

  function handleSelect(day: Date | undefined, selected: Date) {
    changeValue(
      fromDate(selected, getLocalTimeZone())
        .add({
          hours: localValue ? localValue.hour : 0,
          minutes: localValue ? localValue.minute : 0,
        })
        .toString()
    );
  }

  const footer = (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label className="text-xs" htmlFor="hours">
          {t("dateTime.hours")}
        </Label>
        <TimePickerInput
          date={localValue?.toDate()}
          disabled={disabled}
          onRightFocus={() => minuteReference.current?.focus()}
          picker="hours"
          ref={hourReference}
          setDate={(newValue) => {
            if (newValue !== undefined) {
              changeValue(fromDate(newValue, getLocalTimeZone()).toString());
            }
          }}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label className="text-xs" htmlFor="minutes">
          {t("dateTime.minutes")}
        </Label>
        <TimePickerInput
          date={localValue?.toDate()}
          disabled={disabled}
          onLeftFocus={() => hourReference.current?.focus()}
          picker="minutes"
          ref={minuteReference}
          setDate={(newValue) => {
            if (newValue !== undefined) {
              changeValue(fromDate(newValue, getLocalTimeZone()).toString());
            }
          }}
        />
      </div>
      <div className="flex h-10 items-center">
        <Clock className="ml-2 size-4" />
      </div>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-start text-left font-normal px-3",
            value === undefined && "text-muted-foreground",
            isError && "border-destructive"
          )}
          disabled={disabled}
          variant="outline"
        >
          <CalendarIcon className="mr-2 size-4" />
          {value === undefined ? (
            <span>{t("selectDate")}</span>
          ) : (
            format(localValue ?? parseZonedDateTime(value), t("dateTime.format"))
          )}
          {errorIcon && isError && <AlertCircle className="size-6 text-destructive ml-auto" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background bg-white">
        <Calendar
          captionLayout="dropdown"
          disabled={disabledRange}
          autoFocus
          locale={i18n.language.startsWith("fr") ? fr : undefined}
          mode="single"
          onSelect={(day, selectedDay) => {
            handleSelect(day, selectedDay);
          }}
          selected={localValue?.toDate()}
          toYear={toYear ?? now(getLocalTimeZone()).year + 20}
        />
        <div className="p-3 border-t border-gray-100">{footer}</div>
      </PopoverContent>
    </Popover>
  );
}
