/* eslint-disable max-len */
import { Card } from "../ui/card";
import { MapPin, Calendar } from "lucide-react";
import { EventDto } from "@papyrus/source";
import { Badge } from "../ui/badge";
import { format, parseZonedDateTimeInLocalTimeZone } from "../../utils/date/date-utils";
import { useTranslation } from "react-i18next";

interface EventDetailProps {
  event: EventDto | undefined;
}

export function EventDetail({ event }: EventDetailProps) {
  const { t } = useTranslation("event/event-details");
  const importanceMap: Record<string, string> = {
    critical: t("importance.critical"),
    important: t("importance.important"),
    action: t("importance.action"),
    normal: t("importance.normal"),
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
        <p className="text-md text-gray-600">{t("select.title")}</p>
        <p className="text-sm text-gray-400">{t("select.description")}</p>
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
          {format(parseZonedDateTimeInLocalTimeZone(event.eventDate), "HHhmm le dd MMMM yyyy")}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{t("fields.description")}</p>
        <p className="text-sm text-card-foreground">{event.description || "—"}</p>
      </div>

      {/* LIEU */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">{t("fields.location")}</p>
        </div>
        <p className="text-sm text-card-foreground">{event.location || "—"}</p>
      </div>

      {/* NOTES SUPPLÉMENTAIRES */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{t("fields.additionalDetails")}</p>
        <p className="text-sm text-card-foreground whitespace-pre-line">
          {event.additionalDetails || "—"}
        </p>
      </div>
    </Card>
  );
}
