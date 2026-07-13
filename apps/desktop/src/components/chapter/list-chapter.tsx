/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import { ChapterDto } from "@papyrus/source";
import { useProject } from "../../context/project-provider";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOfflineList } from "../../hooks/use-offline-list";

interface ChapterListProps {
  id?: string;
  withoutPart?: boolean;
  // eslint-disable-next-line no-unused-vars
  setSelectedChapter?: (chapter: ChapterDto) => void;
  selectedChapter?: ChapterDto;
}

// eslint-disable-next-line complexity
export function ChapterList({
  id,
  withoutPart = false,
  setSelectedChapter,
  selectedChapter,
}: ChapterListProps) {
  const { t } = useTranslation(["chapter/list-chapter", "common"]);
  const { currentProject } = useProject();
  const cachedChapters = useOfflineList<ChapterDto>({
    entityType: "chapters",
    projectId: currentProject?.id,
  });
  const chapters = (cachedChapters?.data ?? []).filter((chapter) =>
    withoutPart ? !chapter.part : chapter.part?.id === id
  );

  const statusColorMap: Record<string, string> = {
    toStart: "bg-slate-400",
    inProgress: "bg-amber-500",
    completed: "bg-emerald-600",
  };

  const statusTextMap: Record<string, string> = {
    toStart: t("common:status.toStart"),
    inProgress: t("common:status.inProgress"),
    completed: t("common:status.completed"),
  };

  return (
    <>
      {chapters.length === 0 ? (
        <p className="text-gray-500">{t("empty")}</p>
      ) : (
        chapters.map((ch) => (
          <div
            className={`flex items-center justify-between gap-4 border border-gray-200 py-2 p-2 rounded-lg ${selectedChapter?.id === ch.id ? "bg-blue-100 border-blue-500" : ""}`}
            key={ch.id}
            onClick={() => setSelectedChapter && setSelectedChapter(ch)}
          >
            <div className="flex items-center gap-4">
              <FileText className="text-gray-900" size={16} />
              <div className="flex flex-col">
                <p className="font-medium">{ch.title}</p>

                <p className="mt-2 text-sm text-gray-500">
                  {t("common:words", { count: ch.wordCount })}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span
                className={`${statusTextMap[ch.status] ? "text-white" : "text-gray-500"} ${statusColorMap[ch.status] ?? "bg-slate-200"} text-xs font-medium px-2 py-1 rounded-xl`}
              >
                {statusTextMap[ch.status] ?? ch.status}
              </span>
            </div>
          </div>
        ))
      )}
    </>
  );
}
