import { Calendar as CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { fromDate, getLocalTimeZone, type ZonedDateTime } from "@internationalized/date";
import { fr } from "date-fns/locale";

import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "../../../lib/utils";
import { format } from "../../../utils/date/date-utils";
import { Calendar } from "../calendar";

export interface DatePickerProps {
  // eslint-disable-next-line no-unused-vars
  setZonedDateTime: (date: ZonedDateTime) => void;
}

export function DatePicker({ setZonedDateTime }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  // const investigator = useAtomValue(connectedUserAtom);
  // if (investigator === undefined) {
  //   return (
  //     <Error
  //       bottomText="Veuillez vérifier que vous êtes bien connectés au portail ATLAS."
  //       bottomTextSize="text-xl"
  //       image="unauthorized"
  //       size="half"
  //       topText="Impossible de récupérer l'utilisateur connecté"
  //       topTextSize="text-6xl"
  //     />
  //   );
  // }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          variant="outline"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(fromDate(date, getLocalTimeZone()), "dd MMMM yyyy")
          ) : (
            <span>Sélectionnez une date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          initialFocus
          locale={fr}
          mode="single"
          onSelect={(date: Date) => {
            if (date === undefined) {
              return;
            }

            setDate(date);

            const parsedDate = fromDate(date, getLocalTimeZone());

            setZonedDateTime(parsedDate);
          }}
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
}
