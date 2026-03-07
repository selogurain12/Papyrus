/* eslint-disable max-len */
import { Card } from "../ui/card";
import { MapPin } from "lucide-react";
import { PlaceDto } from "@papyrus/source";
import { Badge } from "../ui/badge";

interface PlaceDetailProps {
  place: PlaceDto | undefined;
}

// eslint-disable-next-line complexity
export function PlaceDetail({ place }: PlaceDetailProps) {
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

  const importanceMap: Record<string, string> = {
    high: "Elevée",
    medium: "Moyenne",
    low: "Basse",
  };

  const importanceColorMap: Record<string, string> = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-green-200",
  };

  const typeMap: Record<string, string> = {
    city: "Ville",
    village: "Village",
    country: "Pays",
    continent: "Continent",
    building: "Bâtiment",
    naturalFeature: "Caractéristique naturelle",
    other: "Autre",
  };

  if (!place) {
    return (
      <Card className="rounded-lg p-6 w-full flex flex-col items-center justify-center text-muted-foreground">
        <MapPin className="w-16 h-16 text-gray-300" />
        <p className="text-md text-gray-600">Sélectionnez un lieu</p>
        <p className="text-sm text-gray-400">
          Choisissez un lieu dans la liste pour voir ses détails
        </p>
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
          } flex items-center justify-center`}
        >
          <MapPin className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-card-foreground">{place.name}</h3>

          {place.type && (
            <p className="text-sm text-muted-foreground">{typeMap[place.type] ?? place.type}</p>
          )}

          {place.narrativeImportance && (
            <Badge className={importanceColorMap[place.narrativeImportance] ?? "bg-gray-500"}>
              Importance {importanceMap[place.narrativeImportance] ?? place.narrativeImportance}
            </Badge>
          )}
        </div>
      </div>

      {/* INFORMATIONS GÉNÉRALES */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">
          INFORMATIONS GÉNÉRALES
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <p>
            <span className="font-semibold">Langue :</span> {place.language ?? "Non spécifié"}
          </p>

          <p>
            <span className="font-semibold">Gouvernement :</span>{" "}
            {place.government ?? "Non spécifié"}
          </p>

          <p>
            <span className="font-semibold">Population :</span> {place.population ?? "Non spécifié"}
          </p>

          <p>
            <span className="font-semibold">Ressources :</span> {place.ressources ?? "Non spécifié"}
          </p>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">DESCRIPTION</h4>

        <p>
          <span className="font-semibold">Description physique :</span>{" "}
          {place.physicalDescription ?? "Non spécifié"}
        </p>

        <p>
          <span className="font-semibold">Atmosphère :</span> {place.atmosphere ?? "Non spécifié"}
        </p>

        <p>
          <span className="font-semibold">Usages :</span> {place.usages ?? "Non spécifié"}
        </p>
      </section>

      {/* HISTOIRE */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">HISTOIRE</h4>
        <p>{place.history ?? "Non spécifié"}</p>
      </section>
    </Card>
  );
}
