/* eslint-disable max-len */
import { Card } from "../ui/card";
import { MapPin, Package } from "lucide-react";
import { ObjectDto } from "@papyrus/source";
import { Badge } from "../ui/badge";

interface ObjectDetailProps {
  object: ObjectDto | undefined;
}

// eslint-disable-next-line complexity
export function ObjectDetail({ object }: ObjectDetailProps) {
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
    high: "Élevée",
    medium: "Moyenne",
    low: "Basse",
  };

  const importanceColorMap: Record<string, string> = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-green-200",
  };

  const typeMap: Record<string, string> = {
    weapon: "Arme",
    vehicle: "Véhicule",
    artifact: "Artefact",
    tool: "Outil",
    clothing: "Vêtement",
    jewelry: "Bijou",
    furniture: "Meuble",
    technology: "Technologie",
    paper: "Documents",
    equipment: "Equipement",
  };

  if (!object) {
    return (
      <Card className="rounded-lg p-6 w-full flex flex-col items-center justify-center text-muted-foreground">
        <MapPin className="w-16 h-16 text-gray-300" />
        <p className="text-md text-gray-600">Sélectionnez un objet</p>
        <p className="text-sm text-gray-400">
          Choisissez un objet dans la liste pour voir ses détails
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
            colorMap[object.color ?? "blue"]
          } flex items-center justify-center`}
        >
          <Package className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-card-foreground">{object.name}</h3>

          {object.type && (
            <p className="text-sm text-muted-foreground">{typeMap[object.type] ?? object.type}</p>
          )}

          {object.importance && (
            <Badge className={importanceColorMap[object.importance] ?? "bg-gray-500"}>
              Importance {importanceMap[object.importance] ?? object.importance}
            </Badge>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">DESCRIPTION</h4>

        <p>
          <span className="font-semibold">Description :</span>{" "}
          {object.description ?? "Non spécifié"}
        </p>

        <p>
          <span className="font-semibold">Apparence :</span> {object.appearance ?? "Non spécifié"}
        </p>

        <p>
          <span className="font-semibold">Signification :</span>{" "}
          {object.significance ?? "Non spécifié"}
        </p>

        <p>
          <span className="font-semibold">Localisation :</span> {object.location ?? "Non spécifié"}
        </p>
      </section>

      {/* HISTOIRE */}
      <section className="space-y-3">
        <h4 className="text-lg font-semibold tracking-wide text-card-foreground">HISTOIRE</h4>
        <p>{object.history ?? "Non spécifié"}</p>
      </section>
    </Card>
  );
}
