import { PencilLine, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import { NoteDto } from "@papyrus/source";
import { Badge } from "../ui/badge";

export function NoteCard({
  note,
  onSelect,
  onEdit,
  onDelete,
}: {
  note: NoteDto;
  // eslint-disable-next-line no-unused-vars
  onSelect: (note: NoteDto) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const colorMap: Record<string, string> = {
    blue: "border-l-blue-500 border-l-4",
    red: "border-l-red-500 border-l-4",
    green: "border-l-green-500 border-l-4",
    yellow: "border-l-yellow-500 border-l-4",
    purple: "border-l-purple-500 border-l-4",
    pink: "border-l-pink-500 border-l-4",
    orange: "border-l-orange-500 border-l-4",
    gray: "border-l-gray-500 border-l-4",
  };

  return (
    <Card
      className={`rounded-lg p-2 w-full cursor-pointer ${colorMap[note.color ?? "blue"]}`}
      onClick={() => onSelect(note)}
    >
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{note.title}</h3>
          <p className="text-sm text-muted-foreground">{note.content}</p>
          <div className="mt-1 flex space-x-2">
            {note.tags?.map((tag) => (
              <Badge
                key={tag}
                className="text-xs bg-gray-200 text-muted-foreground rounded-md px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <PencilLine className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={onEdit} />
          <Trash2 className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={onDelete} />
        </div>
      </div>
    </Card>
  );
}
