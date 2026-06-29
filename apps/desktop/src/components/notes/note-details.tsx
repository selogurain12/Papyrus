/* eslint-disable max-len */
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { NoteDto } from "@papyrus/source";
import { Link } from "lucide-react";
import { useState } from "react";
import { PDFViewerModal } from "../ui/pdf-viewer";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line complexity
export function NoteDetails({ note }: { note: NoteDto }) {
  const { t } = useTranslation(["notes/note-details", "common"]);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
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

  const colorBgMap: Record<string, string> = {
    blue: "bg-blue-100",
    red: "bg-red-100",
    green: "bg-green-100",
    yellow: "bg-yellow-100",
    purple: "bg-purple-100",
    pink: "bg-pink-100",
    orange: "bg-orange-100",
    gray: "bg-gray-100",
  };

  return (
    <Card className="p-4 rounded-lg w-full">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-card-foreground">
            {note?.title ?? t("untitled")}
          </h3>
          <button
            onClick={() => note.linkFile && setIsPDFModalOpen(true)}
            disabled={!note.linkFile}
            className={`flex items-center space-x-1 text-sm ${
              note.linkFile
                ? "text-indigo-600 hover:text-indigo-700 cursor-pointer"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <Link className="w-3 h-3" />
            <span>{note.linkFile ? t("common:openExternal") : t("noFile")}</span>
          </button>

          <div className="mt-3 flex flex-wrap gap-2">
            {note?.tags?.map((tag) => (
              <Badge
                key={tag}
                className="text-xs bg-gray-200 text-muted-foreground rounded-md px-2 py-1"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div
          className={`border-l-4 ${colorMap[note.color ?? "blue"]} ${colorBgMap[note.color ?? "blue"]} rounded-md p-4 text-sm text-card-foreground whitespace-pre-line`}
        >
          {note?.content ?? t("noContent")}
        </div>
      </div>
      <PDFViewerModal
        isOpen={isPDFModalOpen}
        url={note.linkFile}
        title={note.title}
        onClose={() => setIsPDFModalOpen(false)}
      />
    </Card>
  );
}

export default NoteDetails;
