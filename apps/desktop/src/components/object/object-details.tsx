/* eslint-disable max-len */
import { Card } from "../ui/card";
import { MapPin, Package } from "lucide-react";
import { ObjectDto } from "@papyrus/source";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";

interface ObjectDetailProps {
  object: ObjectDto | undefined;
}

// eslint-disable-next-line complexity
export function ObjectDetail({ object }: ObjectDetailProps) {
  const { t } = useTranslation("object/object-details");
  const colorMap: Record<string, string> = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    gray: "bg-gray-500",
  };

  const importanceColorMap: Record<string, string> = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-green-200",
  };

  if (!object) {
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
            colorMap[object.color ?? "blue"]
          } flex items-center justify-center`}
        >
          <Package className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-card-foreground">{object.name}</h3>

          {object.type && (
            <p className="text-sm text-muted-foreground">
              {t(`types.${object.type}`, { defaultValue: object.type })}
            </p>
          )}

          {object.importance && (
            <Badge className={importanceColorMap[object.importance] ?? "bg-gray-500"}>
              {t("labels.importance", {
                importance: t(`importance.${object.importance}`, {
                  defaultValue: object.importance,
                }),
              })}
            </Badge>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">
          {t("sections.description")}
        </h4>

        <p>
          <span className="font-semibold">{t("fields.description")} :</span>{" "}
          {object.description ?? t("notSpecified")}
        </p>

        <p>
          <span className="font-semibold">{t("fields.appearance")} :</span>{" "}
          {object.appearance ?? t("notSpecified")}
        </p>

        <p>
          <span className="font-semibold">{t("fields.significance")} :</span>{" "}
          {object.significance ?? t("notSpecified")}
        </p>

        <p>
          <span className="font-semibold">{t("fields.location")} :</span>{" "}
          {object.location ?? t("notSpecified")}
        </p>
      </section>

      {/* HISTOIRE */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">
          {t("sections.history")}
        </h4>
        <p>{object.history ?? t("notSpecified")}</p>
      </section>
    </Card>
  );
}
