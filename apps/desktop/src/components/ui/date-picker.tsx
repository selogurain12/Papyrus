import { fromDate, getLocalTimeZone, now, parseZonedDateTime } from "@internationalized/date";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { type InputHTMLAttributes } from "react";
import { fr } from "date-fns/locale";
import type { Matcher } from "react-day-picker";

import { cn } from "../../lib/utils";
import { format } from "../../utils/date/date-utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  changeValue: (date: string) => void;
  disabledRange: Matcher | Matcher[] | undefined;
  captionLayout?: "label" | "dropdown-months" | "dropdown";
  fromYear?: number;
  toYear?: number;
}

// eslint-disable-next-line complexity
export function DatePicker({
  value,
  changeValue,
  placeholder,
  disabledRange = undefined,
  disabled = false,
  captionLayout = "dropdown",
  fromYear = undefined,
  toYear = undefined,
}: DatePickerProps) {
  function handleSelect(day: Date | undefined, selected: Date) {
    changeValue(fromDate(selected, getLocalTimeZone()).toString());
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn("w-full justify-start text-left font-normal px-3")}
          disabled={disabled}
          variant="outline"
        >
          <CalendarIcon className="mr-2 size-4" />
          <div className="normal-case">
            {value === undefined ? (
              <span>{placeholder ?? "SÃ©lectionner une date..."}</span>
            ) : (
              format(parseZonedDateTime(value), "dd MMMM yyyy")
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background">
        <Calendar
          captionLayout={captionLayout}
          className="bg-white"
          disabled={disabledRange}
          fromYear={fromYear ?? 1900}
          initialFocus
          locale={fr}
          mode="single"
          onSelect={(day, selectedDay) => {
            handleSelect(day, selectedDay);
          }}
          selected={value === undefined ? undefined : parseZonedDateTime(value).toDate()}
          toYear={toYear ?? now(getLocalTimeZone()).year + 20}
        />
      </PopoverContent>
    </Popover>
  );
}
