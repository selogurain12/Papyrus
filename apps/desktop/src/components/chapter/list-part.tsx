/* eslint-disable max-len */
import { ChapterDto, PartDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { Button } from "../ui/button";
import { BookOpen, ChevronDown, ChevronRight, PencilLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog } from "../ui/dialogs/dialog";
import { CreatePart } from "./actions/part/create-part";
import { ChapterList } from "./list-chapter";
import { CreateChapter } from "./actions/chapter/create-chapter";
import { ChapterDetail } from "./chapter-details";
import { ChapterEditor } from "./chapter-editor";
import { UpdatePart } from "./actions/part/update-part";
import { UpdateChapter } from "./actions/chapter/update-chapter";
import { PartDeleteActions } from "./actions/part/delete-part";
import { ChapterDeleteActions } from "./actions/chapter/delete-chapter";

// eslint-disable-next-line complexity
export function PartsList() {
  const { currentProject } = useProject();
  const [isCreatingPart, setIsCreatingPart] = useState(false);
  const [isUpdatingPart, setIsUpdatingPart] = useState(false);
  const [isDeletingPart, setIsDeletingPart] = useState(false);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [isUpdatingChapter, setIsUpdatingChapter] = useState(false);
  const [isDeletingChapter, setIsDeletingChapter] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [selectedPart, setSelectedPart] = useState<PartDto | undefined>();
  const [selectedChapter, setSelectedChapter] = useState<ChapterDto | undefined>();
  const [openPartId, setOpenPartId] = useState<string | null>(null);

  const { data: parts } = client.part.getAll.useQuery({
    queryKey: queryKeys.part.getAll({ pathParams: { projectId: currentProject?.id ?? "" } }),
    queryData: {
      params: { projectId: currentProject?.id ?? "" },
    },
  });
  const { data: chaptersData } = client.chapter.getAll.useQuery({
    queryKey: queryKeys.chapter.getAll({
      pathParams: {
        projectId: currentProject?.id ?? "",
      },
    }),

    queryData: {
      params: {
        projectId: currentProject?.id ?? "",
      },
    },

    enabled: !!currentProject?.id,
  });

  const chapters = chaptersData?.body.data ?? [];
  return (
    <div className="p-6">
      <div className="flex justify-between gap-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Structure du livre</h2>
          <p className="text-gray-600 mb-6">Organisez vos parties et chapitres.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="blue" onClick={() => setIsCreatingPart(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une partie
          </Button>
          <Button variant="green" onClick={() => setIsCreatingChapter(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un chapitre
          </Button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-1/2 gap-6 bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-lg font-semibold">Vue d'ensemble</p>
          <div className="mt-4 flex w-full gap-4 pb-4">
            <div
              className="flex flex-col w-1/3 items-center justify-center px-4 py-3 rounded-xl shadow-sm"
              style={{ backgroundColor: "#FAF5FF" }}
            >
              <span className="text-2xl font-bold" style={{ color: "#9D174D" }}>
                {parts?.body.total ?? 0}
              </span>
              <span className="text-sm font-medium text-gray-700">Parties</span>
            </div>
            <div
              className="flex flex-col w-1/3 items-center justify-center px-4 py-3 rounded-xl shadow-sm"
              style={{ backgroundColor: "#EFF6FF" }}
            >
              <span className="text-2xl font-bold" style={{ color: "#2563EB" }}>
                {chaptersData?.body.total ?? 0}
              </span>
              <span className="text-sm font-medium text-gray-700">Chapitres</span>
            </div>
            <div
              className="flex flex-col w-1/3 items-center justify-center px-4 py-3 rounded-xl shadow-sm"
              style={{ backgroundColor: "#ECFDF5" }}
            >
              <span className="text-2xl font-bold" style={{ color: "#059669" }}>
                {currentProject?.currentWordCount ?? 0}
              </span>
              <span className="text-sm font-medium text-gray-700">Mots</span>
            </div>
          </div>
          {parts?.body?.data.map((part) => {
            const chapterCount = chapters.filter((ch) => ch.part.id === part.id).length;
            const isOpen = openPartId === part.id;
            return (
              <div key={part.id} className="border rounded-lg border-gray-300 p-2 m-2">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    setOpenPartId(isOpen ? null : part.id);
                  }}
                >
                  {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  <BookOpen className="ml-4" color="#2563EB" size={20} />

                  <div className="ml-8 flex flex-col" style={{ marginLeft: 8, flex: 1 }}>
                    <p className="font-medium ml-4">{part.title}</p>
                    <p className="text-sm text-gray-500 ml-4">{chapterCount} chapitres</p>
                  </div>

                  <div className="flex flex-row">
                    <Button
                      variant="transparent"
                      onClick={() => {
                        setIsUpdatingPart(true);
                        setSelectedPart(part);
                      }}
                    >
                      <PencilLine size={18} color="#2563EB" />
                    </Button>

                    <Button
                      variant="transparent"
                      onClick={() => {
                        setIsDeletingPart(true);
                        setSelectedPart(part);
                      }}
                    >
                      <Trash2 size={18} color="#DC2626" />
                    </Button>
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-3 flex flex-col w-full gap-3 p-2">
                    <ChapterList
                      id={part.id}
                      setSelectedChapter={setSelectedChapter}
                      selectedChapter={selectedChapter}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="w-1/2">
          <ChapterDetail
            chapter={selectedChapter}
            onEdit={() => {
              setIsUpdatingChapter(true);
            }}
            onEditor={() => {
              setOpenEditor(true);
            }}
            onDelete={() => {
              setIsDeletingChapter(true);
            }}
          />
        </div>
      </div>
      {openEditor && selectedChapter && (
        <Dialog open={openEditor} onOpenChange={setOpenEditor}>
          <ChapterEditor
            chapter={selectedChapter}
            setOpen={setOpenEditor}
            setChapter={setSelectedChapter}
          />
        </Dialog>
      )}
      {isCreatingPart && (
        <Dialog open={isCreatingPart} onOpenChange={setIsCreatingPart}>
          <CreatePart setOpen={setIsCreatingPart} />
        </Dialog>
      )}
      {isUpdatingPart && selectedPart && (
        <Dialog open={isUpdatingPart} onOpenChange={setIsUpdatingPart}>
          <UpdatePart setOpen={setIsUpdatingPart} part={selectedPart} />
        </Dialog>
      )}
      {isDeletingPart && selectedPart && (
        <Dialog open={isDeletingPart} onOpenChange={setIsDeletingPart}>
          <PartDeleteActions
            open={isDeletingPart}
            setOpen={setIsDeletingPart}
            part={selectedPart}
            clearSelection={() => setSelectedPart(undefined)}
          />
        </Dialog>
      )}
      {isCreatingChapter && (
        <Dialog open={isCreatingChapter} onOpenChange={setIsCreatingChapter}>
          <CreateChapter setOpen={setIsCreatingChapter} />
        </Dialog>
      )}
      {isUpdatingChapter && selectedChapter && (
        <Dialog open={isUpdatingChapter} onOpenChange={setIsUpdatingChapter}>
          <UpdateChapter setOpen={setIsUpdatingChapter} chapter={selectedChapter} />
        </Dialog>
      )}
      {isDeletingChapter && selectedChapter && (
        <Dialog open={isDeletingChapter} onOpenChange={setIsDeletingChapter}>
          <ChapterDeleteActions
            open={isDeletingChapter}
            setOpen={setIsDeletingChapter}
            chapter={selectedChapter}
            clearSelection={() => setSelectedChapter(undefined)}
          />
        </Dialog>
      )}
    </div>
  );
}
