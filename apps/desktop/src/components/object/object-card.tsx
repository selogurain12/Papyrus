/* eslint-disable max-len */
import { PencilLine, Trash2, Package } from "lucide-react";
import { Card } from "../ui/card";
import { ObjectDto } from "@papyrus/source";
import { Badge } from "../ui/badge";

export function ObjectCard({
  object,
  onSelect,
  onEdit,
  onDelete,
}: {
  object: ObjectDto;
  // eslint-disable-next-line no-unused-vars
  onSelect: (object: ObjectDto) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const importanceMap: Record<string, string> = {
    high: "Élevée",
    medium: "Moyenne",
    low: "Faible",
  };

  const importanceColorMap: Record<string, string> = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-green-200",
  };

  return (
    <Card
      className="rounded-lg p-4 w-full cursor-pointer hover:bg-accent transition-colors"
      onClick={() => onSelect(object)}
    >
      <div className="flex items-center space-x-4">
        {/* AVATAR */}
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
          <Package className="w-6 h-6 text-white" />
        </div>

        {/* INFORMATIONS */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-card-foreground leading-tight">
            {object.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {Array.isArray(object.type) ? object.type.join(" • ") : object.type}
          </p>

          <Badge
            className={`mt-1 px-2 py-0.5 text-xs font-medium ${importanceColorMap[object.importance] || "bg-gray-500"}`}
          >
            Importance : {importanceMap[object.importance] || object.importance}
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
