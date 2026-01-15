import { fromDate, getLocalTimeZone, parseZonedDateTime } from "@internationalized/date";
import { AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import React, { type InputHTMLAttributes, useRef } from "react";
import { fr } from "date-fns/locale";
import type { Matcher } from "react-day-picker";

import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "../../../lib/utils";
import { format } from "../../../utils/date/date-utils";
import { Calendar } from "../calendar";

import { TimePickerInput } from "./time-picker-input";

interface DateTimePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  changeValue: (date: string) => void;
  errorIcon?: boolean;
  isError?: boolean;
  disabledRange: Matcher | Matcher[] | undefined;
}

// eslint-disable-next-line complexity
export function DateTimePicker({
  value,
  changeValue,
  disabled,
  errorIcon = false,
  isError = false,
  disabledRange = undefined,
}: DateTimePickerProps) {
  const hourReference = useRef<HTMLInputElement>(null);
  const minuteReference = useRef<HTMLInputElement>(null);

  function handleSelect(day: Date | undefined, selected: Date) {
    const zonedValue = value === undefined ? undefined : parseZonedDateTime(value);
    changeValue(
      fromDate(selected, getLocalTimeZone())
        .add({
          hours: zonedValue ? zonedValue.hour : 0,
          minutes: zonedValue ? zonedValue.minute : 0,
        })
        .toString()
    );
  }

  const footer = (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label className="text-xs" htmlFor="hours">
          Heures
        </Label>
        <TimePickerInput
          date={value === undefined ? undefined : parseZonedDateTime(value).toDate()}
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
          Minutes
        </Label>
        <TimePickerInput
          date={value === undefined ? undefined : parseZonedDateTime(value).toDate()}
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
            <span>Sélectionnez une date</span>
          ) : (
            format(parseZonedDateTime(value), "dd MMMM yyyy à HH:mm")
          )}
          {errorIcon && isError && <AlertCircle className="size-6 text-destructive ml-auto" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background">
        <Calendar
          captionLayout="dropdown"
          disabled={disabledRange}
          initialFocus
          locale={fr}
          mode="single"
          onSelect={(day, selectedDay) => {
            handleSelect(day, selectedDay);
          }}
          selected={value === undefined ? undefined : parseZonedDateTime(value).toDate()}
        />
        <div className="p-3 border-t border-border">{footer}</div>
      </PopoverContent>
    </Popover>
  );
}
