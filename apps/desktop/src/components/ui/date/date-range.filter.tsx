import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  useNavigate,
  type RouteIds,
  type RegisteredRouter,
  NavigateOptions,
} from "@tanstack/react-router";
import React, { useState, type ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { LuCalendarDays } from "react-icons/lu";

import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import { Button } from "../button";
import { cn } from "../../../lib/utils";
import { Calendar } from "../calendar";

interface DateRangePickerProps extends ComponentPropsWithoutRef<typeof PopoverContent> {
  routePath: RouteIds<RegisteredRouter["routeTree"]>;

  dateRange?: DateRange;

  fromParameter?: string;

  toParameter?: string;

  dayCount?: number;

  placeholder?: string;

  disabled?: boolean;

  className?: string;
}

// eslint-disable-next-line complexity
export function DateRangeFilter({
  routePath,
  dateRange = undefined,
  fromParameter = undefined,
  toParameter = undefined,
  dayCount = undefined,
  placeholder = "Pick a date",
  disabled = false,
  className,
  ...props
}: DateRangePickerProps) {
  const popoverReference = useRef(null);
  const navigate = useNavigate({ from: routePath });

  const [date, setDate] = useState<DateRange | undefined>(() => {
    let fromDay: Date | undefined = undefined;
    let toDay: Date | undefined = undefined;

    if (dateRange) {
      fromDay = dateRange.from;
      toDay = dateRange.to;
    }
    if (!dateRange && dayCount !== undefined) {
      toDay = new Date();
      fromDay = addDays(toDay, -dayCount);
    }

    return {
      from: fromParameter === undefined ? fromDay : new Date(fromParameter),
      to: toParameter === undefined ? toDay : new Date(toParameter),
    };
  });

  // Update query string
  useEffect(() => {
    void navigate({
      search: (old) => ({
        ...old,
        from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
        to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
      }),

      replace: true,
    } as NavigateOptions);
  }, [date?.from, date?.to]);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "h-8 border-dashed",
            date?.from ? "font-medium" : "font-normal text-muted-foreground"
          )}
          disabled={disabled}
          size="sm"
          variant="outline"
        >
          <LuCalendarDays className="size-4 mr-2" />
          {date?.from ? (
            <span>
              {`${format(date.from, "dd LLL, y")}${
                date.to ? ` - ${format(date.to, "dd LLL, y")}` : ""
              }`}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0 bg-background", className)}
        ref={popoverReference}
        {...props}
      >
        <Calendar
          defaultMonth={date?.from}
          initialFocus
          mode="range"
          numberOfMonths={2}
          onSelect={setDate}
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
}
