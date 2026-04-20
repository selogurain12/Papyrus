/* eslint-disable max-len */
import { Card } from "../ui/card";
import { MapPin, Calendar } from "lucide-react";
import { EventDto } from "@papyrus/source";
import { Badge } from "../ui/badge";
import { format } from "../../utils/date/date-utils";
import { parseZonedDateTime } from "@internationalized/date";

interface EventDetailProps {
  event: EventDto | undefined;
}

export function EventDetail({ event }: EventDetailProps) {
  const importanceMap: Record<string, string> = {
    critical: "Critique",
    important: "Importante",
    action: "Action",
    normal: "Normale",
  };

  const importanceColorMap: Record<string, string> = {
    critical: "bg-red-200 text-red-800",
    important: "bg-orange-200 text-orange-800",
    action: "bg-blue-200 text-blue-800",
    normal: "bg-green-200 text-green-800",
  };

  if (!event) {
    return (
      <Card className="rounded-lg p-6 w-full flex flex-col items-center justify-center text-muted-foreground">
        <MapPin className="w-16 h-16 text-gray-300" />
        <p className="text-md text-gray-600">Sélectionnez un évènement</p>
        <p className="text-sm text-gray-400">
          Choisissez un évènement dans la liste pour voir ses détails
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg p-6 w-full space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="justify-between flex">
          <h3 className="text-2xl font-semibold text-card-foreground">{event.title}</h3>
          {event.importance && (
            <Badge className={`${importanceColorMap[event.importance]} rounded-2xl`}>
              {importanceMap[event.importance]}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {format(parseZonedDateTime(event.eventDate), "dd MMMM yyyy")}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Description</p>
        <p className="text-sm text-card-foreground">{event.description || "—"}</p>
      </div>

      {/* LIEU */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Lieu</p>
        </div>
        <p className="text-sm text-card-foreground">{event.location || "—"}</p>
      </div>

      {/* NOTES SUPPLÉMENTAIRES */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Notes supplémentaires</p>
        <p className="text-sm text-card-foreground whitespace-pre-line">
          {event.additionalDetails || "—"}
        </p>
      </div>
    </Card>
  );
}
