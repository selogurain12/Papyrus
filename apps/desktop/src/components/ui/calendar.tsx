/* eslint-disable max-len */
/* eslint-disable camelcase */
 
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import React, { type ChangeEventHandler } from "react";

import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps & { onChange?: ChangeEventHandler<HTMLSelectElement> }) {
  return (
    <DayPicker
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",

        month: "space-y-4 capitalize",
        caption_start: "is-start",
        caption_between: "is-between",
        caption_end: "is-end",
        caption: "flex justify-center pt-1 relative items-center px-10",
        caption_label: "flex items-center gap-2 text-sm font-medium",
        caption_dropdowns: "flex gap-4 [&_.rdp-vhidden]:hidden",
        dropdown_month: "relative inline-flex items-center",
        dropdown_year: "relative inline-flex items-center",

        dropdown: "absolute inset-0 w-full appearance-none opacity-0 z-10 cursor-pointer",

        multiple_months: "is-multiple",

        vhidden: "hidden [.is-between_&]:flex [.is-end_&]:flex [.is-start.is-end_&]:hidden",

        nav: "space-x-1 flex items-center",

        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),

        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",

        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",

        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",

        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-foreground"
        ),

        day_range_end: "day-range-end",

        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",

        day_today: "bg-accent text-accent-foreground",

        day_outside:
          "day-outside text-foreground opacity-60 aria-selected:bg-accent/50 aria-selected:text-background aria-selected:opacity-50",

        day_disabled: "text-muted-foreground opacity-50",

        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",

        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeftIcon {...props} />;
          }
          return <ChevronRightIcon {...props} />;
        },
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
export type { CalendarProps };
