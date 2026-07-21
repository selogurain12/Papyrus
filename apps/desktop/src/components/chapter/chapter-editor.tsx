/* eslint-disable complexity */
/* eslint-disable no-unused-vars */
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { isFetchError } from "@ts-rest/react-query/v5";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { ChapterDto, queryKeys } from "@papyrus/source";
import { Button } from "../ui/button";
import { DialogContent } from "../ui/dialogs/dialog-content";
import Editor from "../ui/editor/editor";
import { client } from "../../utils/client/client";
import { countWordsFromContent } from "../../utils/lexical-content";
import { queryClient } from "../../context/query-client";
import { updateOfflineEntity } from "../../local-db/offline-entity-store";
import { useOnlineStatus } from "../../hooks/use-online-status";
import { useProject } from "../../context/project-provider";
import { AutoSaveStatus } from "./editor/chapter-editor.types";
import { ChapterReferencePanel } from "./editor/chapter-reference-panel";

interface ChapterEditorProps {
  chapter: ChapterDto;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setChapter: (chapter: ChapterDto) => void;
}

export function ChapterEditor({ chapter, setOpen, setChapter }: ChapterEditorProps) {
  const { t } = useTranslation(["chapter/chapter-editor", "common"]);
  const [content, setContent] = useState(chapter.content ?? "");
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const [isReferencePanelOpen, setIsReferencePanelOpen] = useState(false);
  const { setCurrentProject, currentProject } = useProject();
  const isOnline = useOnlineStatus();
  const contentReference = useRef(content);
  const lastSavedContentReference = useRef(chapter.content ?? "");
  const isSavingReference = useRef(false);
  const { mutateAsync: updateChapter } = client.chapter.update.useMutation();

  useEffect(() => {
    contentReference.current = content;
  }, [content]);

  useEffect(() => {
    const initialContent = chapter.content ?? "";
    contentReference.current = initialContent;
    lastSavedContentReference.current = initialContent;
    setContent(initialContent);
    setAutoSaveStatus("idle");
  }, [chapter.content, chapter.id]);

  const invalidateChapterQueries = useCallback(async (updatedChapter: ChapterDto) => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.chapter.get({
        pathParams: { projectId: updatedChapter.project.id, id: updatedChapter.id },
      }),
    });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.chapter.getAll({
        pathParams: { projectId: updatedChapter.project.id },
      }),
    });

    if (updatedChapter.part) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.getByPart({
          pathParams: { projectId: updatedChapter.project.id, partId: updatedChapter.part.id },
        }),
      });
    }
  }, []);

  const saveChapter = useCallback(
    async ({ closeAfterSave, showToast }: { closeAfterSave: boolean; showToast: boolean }) => {
      if (isSavingReference.current) return;

      const currentContent = contentReference.current;
      if (!closeAfterSave && currentContent === lastSavedContentReference.current) return;

      const nextWordCount = countWordsFromContent(currentContent);
      isSavingReference.current = true;
      setAutoSaveStatus("saving");

      try {
        const body = {
          ...chapter,
          content: currentContent,
          wordCount: nextWordCount,
        };

        const updatedChapter = isOnline
          ? (
              await updateChapter({
                params: {
                  id: chapter.id,
                  projectId: chapter.project.id,
                },
                body,
              })
            ).body
          : await updateOfflineEntity("chapters", chapter.project.id, chapter, body);

        await invalidateChapterQueries(updatedChapter);

        if (updatedChapter.project) {
          setCurrentProject(updatedChapter.project);
        }

        setChapter(updatedChapter);
        lastSavedContentReference.current = currentContent;
        setAutoSaveStatus("saved");

        if (showToast) {
          toast.success(t("success"));
        }

        if (closeAfterSave) {
          setOpen(false);
        }
      } catch (error) {
        setAutoSaveStatus("error");

        if (showToast) {
          toast.error(isFetchError(error) ? error.message : t("common:error"));
        }
      } finally {
        isSavingReference.current = false;
      }
    },
    [
      chapter,
      invalidateChapterQueries,
      isOnline,
      setChapter,
      setCurrentProject,
      setOpen,
      t,
      updateChapter,
    ]
  );

  useEffect(() => {
    const autoSaveEnabled = currentProject?.settings.autoSave ?? true;
    const autoSaveInterval = currentProject?.settings.autoSaveInterval ?? 5;

    if (!autoSaveEnabled) {
      return undefined;
    }

    const intervalId = window.setInterval(
      () => {
        void saveChapter({ closeAfterSave: false, showToast: false });
      },
      Math.max(autoSaveInterval, 1) * 60 * 1000
    );

    return () => window.clearInterval(intervalId);
  }, [currentProject?.settings.autoSave, currentProject?.settings.autoSaveInterval, saveChapter]);

  async function handleSave() {
    await saveChapter({ closeAfterSave: true, showToast: true });
  }

  async function handleClose() {
    if (contentReference.current !== lastSavedContentReference.current) {
      await saveChapter({ closeAfterSave: false, showToast: false });
    }

    setOpen(false);
  }

  return (
    <DialogContent
      className={
        (isReferencePanelOpen ? "sm:max-w-[95vw] w-[95vw] " : "sm:max-w-212.5 ") +
        "sm:max-h-[90vh] bg-white p-6 sm:p-8 rounded-2xl " +
        "shadow-2xl border border-slate-200 overflow-hidden"
      }
      onInteractOutside={(event) => {
        event.preventDefault();
        void handleClose();
      }}
    >
      <div className="flex h-[calc(90vh-4rem)] max-h-[calc(90vh-4rem)] flex-col gap-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsReferencePanelOpen((isOpen) => !isOpen)}
          >
            {isReferencePanelOpen ? (
              <PanelRightClose className="mr-2 h-4 w-4" />
            ) : (
              <PanelRightOpen className="mr-2 h-4 w-4" />
            )}
            {isReferencePanelOpen ? t("references.hide") : t("references.show")}
          </Button>
        </div>

        <div
          className={
            isReferencePanelOpen
              ? "grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] gap-4"
              : "flex min-h-0 flex-1"
          }
        >
          <div className="flex min-w-0 flex-col gap-4 overflow-y-auto pr-1">
            <Editor
              value={content}
              onChange={(value) => {
                setContent(value);
              }}
            />
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                {autoSaveStatus === "saving" ? t("autoSave.saving") : null}
                {autoSaveStatus === "saved" ? t("autoSave.saved") : null}
                {autoSaveStatus === "error" ? t("autoSave.error") : null}
              </p>
              <Button
                variant="blue"
                isLoading={autoSaveStatus === "saving"}
                onClick={() => void handleSave()}
              >
                {t("save")}
              </Button>
            </div>
          </div>

          {isReferencePanelOpen && <ChapterReferencePanel projectId={chapter.project.id} />}
        </div>
      </div>
    </DialogContent>
  );
}
