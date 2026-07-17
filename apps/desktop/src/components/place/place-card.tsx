/* eslint-disable max-len */
import { PencilLine, Trash2, MapPin } from "lucide-react";
import { Card } from "../ui/card";
import { PlaceDto } from "@papyrus/source";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";

export function PlaceCard({
  place,
  onSelect,
  onEdit,
  onDelete,
}: {
  place: PlaceDto;
  // eslint-disable-next-line no-unused-vars
  onSelect: (place: PlaceDto) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation("place/place-card");

  const importanceColorMap: Record<string, string> = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-green-200",
  };

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

  return (
    <Card
      className="rounded-lg p-4 w-full cursor-pointer hover:bg-accent transition-colors"
      onClick={() => onSelect(place)}
    >
      <div className="flex items-center space-x-4">
        {/* AVATAR */}
        <div
          className={`w-12 h-12 rounded-full ${colorMap[place.color ?? "blue"]} flex items-center justify-center shadow-md`}
        >
          <MapPin className="w-6 h-6 text-white" />
        </div>

        {/* INFORMATIONS */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-card-foreground leading-tight">{place.name}</h3>

          <p className="text-sm text-muted-foreground">
            {Array.isArray(place.type)
              ? place.type.map((type) => t(`types.${type}`, { defaultValue: type })).join(" • ")
              : t(`types.${place.type}`, { defaultValue: place.type })}
          </p>

          <Badge
            className={`mt-1 px-2 py-0.5 text-xs font-medium ${importanceColorMap[place.narrativeImportance] || "bg-gray-500"}`}
          >
            {t("labels.importance", {
              importance: t(`importance.${place.narrativeImportance}`, {
                defaultValue: place.narrativeImportance,
              }),
            })}
          </Badge>
        </div>

        {/* ACTIONS */}
        <div className="ml-auto flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <PencilLine
            className="w-4 h-4 text-muted-foreground hover:text-foreground transition cursor-pointer"
            onClick={onEdit}
          />
          <Trash2
            className="w-4 h-4 text-muted-foreground hover:text-red-600 transition cursor-pointer"
            onClick={onDelete}
          />
        </div>
      </div>
    </Card>
  );
}
