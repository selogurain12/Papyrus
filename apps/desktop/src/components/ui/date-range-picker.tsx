import { fromDate, getLocalTimeZone, parseZonedDateTime } from "@internationalized/date";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { type InputHTMLAttributes } from "react";
import { fr } from "date-fns/locale";
import type { DateRange, Matcher } from "react-day-picker";

import { cn } from "../../lib/utils";
import { format } from "../../utils/date/date-utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ZonedDateRange {
  from: string | undefined;
  to?: string;
}

interface NullableZonedDateRange {
  from: string | null;
  to: string | null;
}

interface DateRangePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  range: ZonedDateRange | undefined;
  // eslint-disable-next-line no-unused-vars
  changeValue: (range: NullableZonedDateRange | null) => void;
  disabledRange: Matcher | Matcher[] | undefined;
}

export function DateRangePicker({
  className = undefined,
  range,
  changeValue,
  disabledRange = undefined,
}: DateRangePickerProps) {
  function handleSelect(range: DateRange | undefined) {
    if (range === undefined) {
      changeValue(null);
    } else {
      changeValue({
        from: range.from ? fromDate(range.from, getLocalTimeZone()).toString() : null,

        to: range.to ? fromDate(range.to, getLocalTimeZone()).toString() : null,
      });
    }
  }

  function handleDateFormat(range: ZonedDateRange) {
    if (range.from === undefined && range.to === undefined) {
      return <span>Sélectionnez une date</span>;
    }
    if (range.from !== undefined && range.to === undefined) {
      return <span>{format(parseZonedDateTime(range.from), "dd MMMM yyyy")}</span>;
    }
    if (range.from === undefined && range.to !== undefined) {
      return <span>{format(parseZonedDateTime(range.to), "dd MMMM yyyy")}</span>;
    }

    if (range.from !== undefined && range.to !== undefined) {
      return (
        <>
          {format(parseZonedDateTime(range.from), "dd/MM/yyyy")} -{" "}
          {format(parseZonedDateTime(range.to), "dd/MM/yyyy")}
        </>
      );
    }

    return <span className="font-semibold text-destructive">Date incompatible</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-start text-left font-normal px-3",
            className,
            range === undefined && "text-muted-foreground"
          )}
          variant="outline"
        >
          <CalendarIcon className="mr-2 size-4" />
          {range?.from === undefined ? (
            <p className="truncate">Sélectionnez une date</p>
          ) : (
            <p className="truncate">{handleDateFormat(range)}</p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background">
        <Calendar
          disabled={disabledRange}
          initialFocus
          locale={fr}
          mode="range"
          onSelect={(range) => {
            handleSelect(range);
          }}
          selected={
            range === undefined
              ? undefined
              : {
                  from:
                    range.from === undefined ? undefined : parseZonedDateTime(range.from).toDate(),

                  to: range.to === undefined ? undefined : parseZonedDateTime(range.to).toDate(),
                }
          }
        />
      </PopoverContent>
    </Popover>
  );
}

export type { ZonedDateRange };
