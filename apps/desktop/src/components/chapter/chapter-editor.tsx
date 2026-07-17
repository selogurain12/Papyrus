import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { isFetchError } from "@ts-rest/react-query/v5";

import { client } from "../../utils/client/client";
import { ChapterDto, queryKeys } from "@papyrus/source";
import { DialogContent } from "../ui/dialogs/dialog-content";
import Editor from "../ui/editor/editor";
import { Button } from "../ui/button";
import { useProject } from "../../context/project-provider";
import { queryClient } from "../../context/query-client";
import { useTranslation } from "react-i18next";
import { countWordsFromContent } from "../../utils/lexical-content";
import { useOnlineStatus } from "../../hooks/use-online-status";
import { updateOfflineEntity } from "../../local-db/offline-entity-store";

interface ChapterEditorProps {
  chapter: ChapterDto;
  setOpen: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line no-unused-vars
  setChapter: (chapter: ChapterDto) => void;
}

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export function ChapterEditor({ chapter, setOpen, setChapter }: ChapterEditorProps) {
  const { t } = useTranslation(["chapter/chapter-editor", "common"]);
  const [content, setContent] = useState(chapter.content ?? "");
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
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
    // eslint-disable-next-line complexity
    async ({ closeAfterSave, showToast }: { closeAfterSave: boolean; showToast: boolean }) => {
      if (isSavingReference.current) {
        return;
      }

      const currentContent = contentReference.current;
      if (!closeAfterSave && currentContent === lastSavedContentReference.current) {
        return;
      }

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
          if (isFetchError(error)) {
            toast.error(error.message);
          } else {
            toast.error(t("common:error"));
          }
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
        "sm:max-w-212.5 sm:max-h-[90vh] bg-white p-6 sm:p-8 rounded-2xl " +
        "shadow-2xl border border-slate-200 overflow-y-auto"
      }
      onInteractOutside={(event) => {
        event.preventDefault();
        void handleClose();
      }}
    >
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
        <Button variant="blue" onClick={() => void handleSave()}>
          {t("save")}
        </Button>
      </div>
    </DialogContent>
  );
}
