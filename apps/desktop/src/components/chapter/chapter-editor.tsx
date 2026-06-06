import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { isFetchError } from "@ts-rest/react-query/v5";

import { client } from "../../utils/client/client";
import { ChapterDto, queryKeys } from "@papyrus/source";
import { DialogContent } from "../ui/dialogs/dialog-content";
import Editor from "../ui/editor/editor";
import { Button } from "../ui/button";
import { useProject } from "../../context/project-provider";
import { queryClient } from "../../context/query-client";

interface ChapterEditorProps {
  chapter: ChapterDto;
  setOpen: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line no-unused-vars
  setChapter: (chapter: ChapterDto) => void;
}

export function ChapterEditor({ chapter, setOpen, setChapter }: ChapterEditorProps) {
  const [content, setContent] = useState(chapter.content ?? "");
  const { setCurrentProject, currentProject } = useProject();

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const { mutate } = client.chapter.update.useMutation({
    onSuccess: (response) => {
      toast.success("Contenu du chapitre mis à jour");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.get({
          pathParams: { projectId: currentProject?.id ?? "", id: chapter.id },
        }),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.getAll({
          pathParams: { projectId: currentProject?.id ?? "" },
        }),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.getByPart({
          pathParams: { projectId: currentProject?.id ?? "", partId: chapter.part.id },
        }),
      });

      if (response.body.project) {
        setCurrentProject(response.body.project);
      }

      setChapter(response.body);
      setOpen(false);
    },

    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    },
  });

  function handleSave() {
    mutate({
      params: {
        id: chapter.id,
        projectId: chapter.project.id,
      },

      body: {
        ...chapter,
        content,
        wordCount,
      },
    });
  }

  return (
    <DialogContent
      className={
        "sm:max-w-212.5 sm:max-h-[90vh] bg-white p-6 sm:p-8 rounded-2xl " +
        "shadow-2xl border border-slate-200 overflow-y-auto"
      }
      onInteractOutside={(event) => {
        event.preventDefault();
        setOpen(false);
      }}
    >
      <Editor
        value={content}
        onChange={(value) => {
          setContent(value);
        }}
      />
      <Button variant="blue" onClick={handleSave}>
        Enregister
      </Button>
    </DialogContent>
  );
}
