/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import { ChapterDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { FileText } from "lucide-react";

interface ChapterListProps {
  id: string;
  // eslint-disable-next-line no-unused-vars
  setSelectedChapter?: (chapter: ChapterDto) => void;
  selectedChapter?: ChapterDto;
}

export function ChapterList({ id, setSelectedChapter, selectedChapter }: ChapterListProps) {
  const { currentProject } = useProject();
  const { data: chaptersData, isLoading } = client.chapter.getByPart.useQuery({
    queryKey: queryKeys.chapter.getByPart({
      pathParams: {
        projectId: currentProject?.id ?? "",
        partId: id,
      },
    }),

    queryData: {
      params: {
        projectId: currentProject?.id ?? "",
        partId: id,
      },
    },
  });

  const chapters = chaptersData?.body.data ?? [];

  const statusColorMap: Record<string, string> = {
    toStart: "bg-slate-400",
    inProgress: "bg-amber-500",
    completed: "bg-emerald-600",
  };

  const statusTextMap: Record<string, string> = {
    toStart: "À commencer",
    inProgress: "En cours",
    completed: "Terminé",
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : chapters.length === 0 ? (
        <p className="text-gray-500">Aucun chapitre pour cette partie.</p>
      ) : (
        chapters.map((ch) => (
          <div
            className={`flex items-center justify-between gap-4 border border-gray-200 py-2 p-2 rounded-lg ${selectedChapter?.id === ch.id ? "bg-blue-100 border-blue-500" : ""}`}
            key={ch.id}
            onClick={() => setSelectedChapter && setSelectedChapter(ch)}
          >
            <div className="flex items-center gap-4">
              <FileText size={16} color="#111827" />
              <div className="flex flex-col">
                <p className="font-medium">{ch.title}</p>

                <p className="mt-2 text-sm text-gray-500">{ch.wordCount} mots</p>
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
