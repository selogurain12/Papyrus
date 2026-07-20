/* eslint-disable max-len */
import { Card } from "../ui/card";
import { MapPin } from "lucide-react";
import { PlaceDto } from "@papyrus/source";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";

interface PlaceDetailProps {
  place: PlaceDto | undefined;
}

// eslint-disable-next-line complexity
export function PlaceDetail({ place }: PlaceDetailProps) {
  const { t } = useTranslation("place/place-details");
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    pink: "bg-pink-500",
    cyan: "bg-cyan-500",
    gray: "bg-gray-500",
    orange: "bg-orange-500",
  };

  const importanceColorMap: Record<string, string> = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-green-200",
  };

  if (!place) {
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
      <div className="flex items-center space-x-4">
        <div
          className={`w-16 h-16 rounded-full ${
            colorMap[place.color ?? "blue"]
          } flex items-center justify-center overflow-hidden`}
        >
          {place.avatarLink ? (
            <img src={place.avatarLink} alt={place.name} className="h-full w-full object-cover" />
          ) : (
            <MapPin className="w-8 h-8 text-white" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-card-foreground">{place.name}</h3>

          {place.type && (
            <p className="text-sm text-muted-foreground">
              {t(`types.${place.type}`, { defaultValue: place.type })}
            </p>
          )}

          {place.narrativeImportance && (
            <Badge className={importanceColorMap[place.narrativeImportance] ?? "bg-gray-500"}>
              {t("labels.importance", {
                importance: t(`importance.${place.narrativeImportance}`, {
                  defaultValue: place.narrativeImportance,
                }),
              })}
            </Badge>
          )}
        </div>
      </div>

      {/* INFORMATIONS GÉNÉRALES */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">
          {t("sections.general")}
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <p>
            <span className="font-semibold">{t("fields.language")} :</span>{" "}
            {place.language ?? t("notSpecified")}
          </p>

          <p>
            <span className="font-semibold">{t("fields.government")} :</span>{" "}
            {place.government ?? t("notSpecified")}
          </p>

          <p>
            <span className="font-semibold">{t("fields.population")} :</span>{" "}
            {place.population ?? t("notSpecified")}
          </p>

          <p>
            <span className="font-semibold">{t("fields.ressources")} :</span>{" "}
            {place.ressources ?? t("notSpecified")}
          </p>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">
          {t("sections.description")}
        </h4>

        <p>
          <span className="font-semibold">{t("fields.physicalDescription")} :</span>{" "}
          {place.physicalDescription ?? t("notSpecified")}
        </p>

        <p>
          <span className="font-semibold">{t("fields.atmosphere")} :</span>{" "}
          {place.atmosphere ?? t("notSpecified")}
        </p>

        <p>
          <span className="font-semibold">{t("fields.usages")} :</span>{" "}
          {place.usages ?? t("notSpecified")}
        </p>
      </section>

      {/* HISTOIRE */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">
          {t("sections.history")}
        </h4>
        <p>{place.history ?? t("notSpecified")}</p>
      </section>
    </Card>
  );
}
