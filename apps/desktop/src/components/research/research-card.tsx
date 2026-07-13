/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { useState } from "react";
import {
  BookOpen,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  Image,
  Link,
  Search,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { Card } from "../ui/card";
import { PDFViewerModal } from "../ui/pdf-viewer";
import { ResearchDto } from "@papyrus/source";
import { useTranslation } from "react-i18next";
import { isImageFileLink, isPdfFileLink } from "../../utils/files/file-link";
import { useDisplayableFileUrl } from "../../hooks/use-displayable-file-url";

function openResearchLink(link: string, openPdfViewer: () => void, openImageViewer: () => void) {
  if (isPdfFileLink(link)) {
    openPdfViewer();
    return;
  }

  if (isImageFileLink(link)) {
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
  const { displayUrl, isPreparing } = useDisplayableFileUrl(url);

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
          {isPreparing ? (
            <p className="text-gray-500">{t("loading")}</p>
          ) : displayUrl ? (
            <img src={displayUrl} alt={title} className="max-h-full max-w-full object-contain" />
          ) : (
            <p className="text-red-600">{t("error")}</p>
          )}
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

export function ResearchCard({
  research,
  openEditModal,
  openDeleteModal,
}: {
  research: ResearchDto;
  openEditModal: (research: ResearchDto) => void;
  openDeleteModal: (research: ResearchDto) => void;
}) {
  const { t } = useTranslation(["research/research-card", "common"]);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const categories = [
    { id: "all", label: t("categories.all"), icon: Search },
    { id: "articles", label: t("categories.articles"), icon: FileText },
    { id: "links", label: t("categories.links"), icon: Link },
    { id: "images", label: t("categories.images"), icon: Image },
    { id: "videos", label: t("categories.videos"), icon: Video },
    { id: "books", label: t("categories.books"), icon: BookOpen },
  ];
  const getTypeIcon = (type) => {
    switch (type) {
      case "articles":
        return FileText;
      case "links":
        return Globe;
      case "images":
        return Image;
      case "videos":
        return Video;
      case "books":
        return BookOpen;
      default:
        return FileText;
    }
  };
  const TypeIcon = getTypeIcon(research.type);

  const getTypeColor = (type) => {
    switch (type) {
      case "articles":
        return "bg-blue-100 text-blue-800";
      case "links":
        return "bg-green-100 text-green-800";
      case "images":
        return "bg-purple-100 text-purple-800";
      case "videos":
        return "bg-red-100 text-red-800";
      case "books":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <Card
      key={research.id}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <TypeIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{research.title}</h3>
            <p className="text-sm text-gray-500">{research.sources}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(research.type)}`}>
          {categories.find((cat) => cat.id === research.type)?.label}
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-4">{research.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {research.tag &&
          research.tag.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
      </div>

      {research.note && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
          <p className="text-sm text-yellow-800">{research.note}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            research.link &&
            openResearchLink(
              research.link,
              () => setIsPDFModalOpen(true),
              () => setIsImageModalOpen(true)
            )
          }
          disabled={!research.link}
          className={`flex items-center space-x-1 text-sm ${
            research.link
              ? "text-indigo-600 hover:text-indigo-700 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <Link className="w-3 h-3" />
          <span>{research.link ? t("common:openExternal") : t("noFile")}</span>
        </button>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button
            onClick={() => openEditModal(research)}
            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(research)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <PDFViewerModal
        isOpen={isPDFModalOpen}
        url={research.link ?? null}
        title={research.title}
        onClose={() => setIsPDFModalOpen(false)}
      />
      <ImageViewerModal
        isOpen={isImageModalOpen}
        url={research.link ?? null}
        title={research.title}
        onClose={() => setIsImageModalOpen(false)}
      />
    </Card>
  );
}
