/* eslint-disable max-len */
import React, { useMemo } from "react";
import { BookOpen, PencilLine, Trash2, FileText } from "lucide-react";

export function ChapterDetail({ chapter, onEdit, onEditor, onDelete }) {
  if (!chapter) {
    return (
      <div className="bg-white border border-gray-300 rounded-2xl p-12 flex flex-col items-center text-center">
        <BookOpen size={60} color="#D1D5DB" />

        <h2 className="mt-4 text-xl font-bold text-gray-900">Sélectionnez un chapitre</h2>

        <p className="mt-2 text-gray-500">Choisissez un chapitre pour voir ses détails</p>
      </div>
    );
  }

  const statusColorMap = {
    toStart: "#E5E7EB",
    inProgress: "#FEF3C7",
    completed: "#DCFCE7",
  };

  const statusTextColorMap = {
    toStart: "#374151",
    inProgress: "#92400E",
    completed: "#166534",
  };

  const statusTextMap = {
    toStart: "À commencer",
    inProgress: "En cours",
    completed: "Terminé",
  };

  const wordCount = useMemo(() => {
    if (!chapter.content) return chapter.wordCount ?? 0;
    return chapter.content.trim().split(/\s+/).filter(Boolean).length;
  }, [chapter.content, chapter.wordCount]);

  return (
    <div className="overflow-y-auto max-h-[90vh] p-4">
      <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex flex-1">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
              <FileText size={22} color="#2563EB" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{chapter.title}</h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-600">{wordCount} mots</span>

                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: statusColorMap[chapter.status],
                    color: statusTextColorMap[chapter.status],
                  }}
                >
                  {statusTextMap[chapter.status] ?? chapter.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 ml-4">
            <button
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
              onClick={onEdit}
            >
              <PencilLine size={18} color="#374151" />
            </button>

            <button
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
              onClick={onDelete}
            >
              <Trash2 size={18} color="#DC2626" />
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-6" />

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Résumé</h2>

          <p className="text-gray-600 leading-7">{chapter.resume ?? "Aucun résumé disponible"}</p>
        </div>

        <button
          className="mt-4 w-full h-14 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2"
          onClick={onEditor}
        >
          <PencilLine size={18} color="white" />
          Ouvrir l’éditeur
        </button>
      </div>
    </div>
  );
}
