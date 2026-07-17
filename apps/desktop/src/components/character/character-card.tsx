/* eslint-disable max-len */
import { PencilLine, Trash2, User } from "lucide-react";
import { Card } from "../ui/card";
import { CharacterDto } from "@papyrus/source";
import { useTranslation } from "react-i18next";

export function CharacterCard({
  character,
  onSelect,
  onEdit,
  onDelete,
}: {
  character: CharacterDto;
  // eslint-disable-next-line no-unused-vars
  onSelect: (character: CharacterDto) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation("character/character-card");
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
    <Card className="rounded-lg p-2 w-full cursor-pointer" onClick={() => onSelect(character)}>
      <div className="flex items-center space-x-4">
        <div
          className={`w-12 h-12 rounded-full ${colorMap[character.color ?? "blue"]} flex items-center justify-center`}
        >
          <User className="w-6 h-6 text-white" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            {character.firstName} {character.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(`roles.${character.role}`, { defaultValue: character.role })}
          </p>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <PencilLine className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={onEdit} />
          <Trash2 className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={onDelete} />
        </div>
      </div>
    </Card>
  );
}
