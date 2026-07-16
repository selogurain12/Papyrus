/* eslint-disable max-lines */
/* eslint-disable max-len */
import { ChapterDto, PartDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { Button } from "../ui/button";
import { BookOpen, ChevronDown, ChevronRight, PencilLine, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";
import {
  openCreateChapterEvent,
  openCreatePartEvent,
  openDeleteSelectedChapterEvent,
  openDeleteSelectedPartEvent,
  openEditSelectedChapterEvent,
  openEditSelectedPartEvent,
} from "../../utils/shortcut-events";
import { useOfflineList } from "../../hooks/use-offline-list";

// eslint-disable-next-line complexity
export function PartsList() {
  const { t } = useTranslation("chapter/list-part");
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
  const cachedParts = useOfflineList({
    entityType: "parts",
    projectId: currentProject?.id,
    onlineData: parts?.body,
  });
  const cachedChapters = useOfflineList({
    entityType: "chapters",
    projectId: currentProject?.id,
    onlineData: chaptersData?.body,
  });

  useEffect(() => {
    function handleOpenCreatePart() {
      setIsCreatingPart(true);
    }

    function handleOpenCreateChapter() {
      setIsCreatingChapter(true);
    }

    window.addEventListener(openCreatePartEvent, handleOpenCreatePart);
    window.addEventListener(openCreateChapterEvent, handleOpenCreateChapter);

    return () => {
      window.removeEventListener(openCreatePartEvent, handleOpenCreatePart);
      window.removeEventListener(openCreateChapterEvent, handleOpenCreateChapter);
    };
  }, []);

  useEffect(() => {
    function handleOpenEditSelectedPart() {
      if (selectedPart) {
        setIsUpdatingPart(true);
      }
    }

    function handleOpenDeleteSelectedPart() {
      if (selectedPart) {
        setIsDeletingPart(true);
      }
    }

    function handleOpenEditSelectedChapter() {
      if (selectedChapter) {
        setIsUpdatingChapter(true);
      }
    }

    function handleOpenDeleteSelectedChapter() {
      if (selectedChapter) {
        setIsDeletingChapter(true);
      }
    }

    window.addEventListener(openEditSelectedPartEvent, handleOpenEditSelectedPart);
    window.addEventListener(openDeleteSelectedPartEvent, handleOpenDeleteSelectedPart);
    window.addEventListener(openEditSelectedChapterEvent, handleOpenEditSelectedChapter);
    window.addEventListener(openDeleteSelectedChapterEvent, handleOpenDeleteSelectedChapter);

    return () => {
      window.removeEventListener(openEditSelectedPartEvent, handleOpenEditSelectedPart);
      window.removeEventListener(openDeleteSelectedPartEvent, handleOpenDeleteSelectedPart);
      window.removeEventListener(openEditSelectedChapterEvent, handleOpenEditSelectedChapter);
      window.removeEventListener(openDeleteSelectedChapterEvent, handleOpenDeleteSelectedChapter);
    };
  }, [selectedChapter, selectedPart]);

  const chapters = cachedChapters?.data ?? [];
  const chaptersWithoutPart = chapters.filter((chapter) => !chapter.part);
  return (
    <div className="p-6">
      <div className="flex justify-between gap-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
          <p className="text-gray-600 mb-6">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="blue" onClick={() => setIsCreatingPart(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t("addPart")}
          </Button>
          <Button variant="green" onClick={() => setIsCreatingChapter(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t("addChapter")}
          </Button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-1/2 gap-6 bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-lg font-semibold">{t("overview")}</p>
          <div className="mt-4 flex w-full gap-4 pb-4">
            <div className="flex flex-col w-1/3 items-center justify-center px-4 py-3 rounded-xl shadow-sm bg-purple-50">
              <span className="text-2xl font-bold text-pink-800">{cachedParts?.total ?? 0}</span>
              <span className="text-sm font-medium text-gray-700">
                {t("parts", { count: cachedParts?.total ?? 0 })}
              </span>
            </div>
            <div className="flex flex-col w-1/3 items-center justify-center px-4 py-3 rounded-xl shadow-sm bg-blue-50">
              <span className="text-2xl font-bold text-blue-600">{cachedChapters?.total ?? 0}</span>
              <span className="text-sm font-medium text-gray-700">
                {t("chapters", { count: cachedChapters?.total ?? 0 })}
              </span>
            </div>
            <div className="flex flex-col w-1/3 items-center justify-center px-4 py-3 rounded-xl shadow-sm bg-emerald-50">
              <span className="text-2xl font-bold text-emerald-600">
                {currentProject?.currentWordCount ?? 0}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {t("words", { count: currentProject?.currentWordCount ?? 0 })}
              </span>
            </div>
          </div>
          {cachedParts?.data.map((part) => {
            const chapterCount = chapters.filter((ch) => ch.part?.id === part.id).length;
            const isOpen = openPartId === part.id;
            return (
              <div key={part.id} className="border rounded-lg border-gray-300 p-2 m-2">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    setOpenPartId(isOpen ? null : part.id);
                    setSelectedPart(part);
                  }}
                >
                  {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  <BookOpen className="ml-4 text-blue-600" size={20} />

                  <div className="ml-8 flex flex-col" style={{ marginLeft: 8, flex: 1 }}>
                    <p className="font-medium ml-4">{part.title}</p>
                    <p className="text-sm text-gray-500 ml-4">
                      {t("chapterCount", { count: chapterCount })}
                    </p>
                  </div>

                  <div className="flex flex-row">
                    <Button
                      variant="transparent"
                      onClick={() => {
                        setIsUpdatingPart(true);
                        setSelectedPart(part);
                      }}
                    >
                      <PencilLine className="text-blue-600" size={18} />
                    </Button>

                    <Button
                      variant="transparent"
                      onClick={() => {
                        setIsDeletingPart(true);
                        setSelectedPart(part);
                      }}
                    >
                      <Trash2 className="text-red-600" size={18} />
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
          <div className="border rounded-lg border-dashed border-gray-300 p-2 m-2">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setOpenPartId(openPartId === "without-part" ? null : "without-part");
                setSelectedPart(undefined);
              }}
            >
              {openPartId === "without-part" ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
              <BookOpen className="ml-4 text-gray-500" size={20} />

              <div className="ml-8 flex flex-col" style={{ marginLeft: 8, flex: 1 }}>
                <p className="font-medium ml-4">{t("withoutPart")}</p>
                <p className="text-sm text-gray-500 ml-4">
                  {t("chapterCount", { count: chaptersWithoutPart.length })}
                </p>
              </div>
            </div>

            {openPartId === "without-part" && (
              <div className="mt-3 flex flex-col w-full gap-3 p-2">
                <ChapterList
                  withoutPart
                  setSelectedChapter={setSelectedChapter}
                  selectedChapter={selectedChapter}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2">
          {selectedChapter && (
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
          )}
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
