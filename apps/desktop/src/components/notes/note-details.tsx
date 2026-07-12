/* eslint-disable max-len */
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { NoteDto } from "@papyrus/source";
import { ExternalLink, Link, X } from "lucide-react";
import { useState } from "react";
import { PDFViewerModal } from "../ui/pdf-viewer";
import { useTranslation } from "react-i18next";

function getLinkExtension(link: string) {
  try {
    const pathname = new URL(link).pathname;
    return pathname.split(".").pop()?.toLowerCase() ?? "";
  } catch {
    return link.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  }
}

function isPdfLink(link: string) {
  return getLinkExtension(link) === "pdf";
}

function isImageLink(link: string) {
  return ["apng", "avif", "gif", "jpeg", "jpg", "png", "svg", "webp"].includes(
    getLinkExtension(link)
  );
}

function openNoteFile(link: string, openPdfViewer: () => void, openImageViewer: () => void) {
  if (isPdfLink(link)) {
    openPdfViewer();
    return;
  }

  if (isImageLink(link)) {
    openImageViewer();
    return;
  }

  window.open(link, "_blank", "noopener,noreferrer");
}

function ImageViewerModal({
  isOpen,
  url,
  title,
  onClose,
}: {
  isOpen: boolean;
  url: string | null;
  title: string;
  onClose: () => void;
}) {
  const { t } = useTranslation("common");

  if (!isOpen || !url) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex h-[90vh] max-h-[90vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="truncate text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-50 p-6">
          <img src={url} alt={title} className="max-h-full max-w-full object-contain" />
        </div>

        <div className="flex items-center justify-end border-t border-gray-200 bg-white p-4">
          <button
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
            className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{t("openExternal")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line complexity
export function NoteDetails({ note }: { note: NoteDto }) {
  const { t } = useTranslation(["notes/note-details", "common"]);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
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
            onClick={() =>
              note.linkFile &&
              openNoteFile(
                note.linkFile,
                () => setIsPDFModalOpen(true),
                () => setIsImageModalOpen(true)
              )
            }
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
      <ImageViewerModal
        isOpen={isImageModalOpen}
        url={note.linkFile}
        title={note.title}
        onClose={() => setIsImageModalOpen(false)}
      />
    </Card>
  );
}

export default NoteDetails;
