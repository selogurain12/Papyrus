/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { ChapterDto, queryKeys } from "@papyrus/source";
import { useQueryClient } from "@tanstack/react-query";
import { isFetchError } from "@ts-rest/react-query/v5";
import { toast } from "sonner";
import { useProject } from "../../../../context/project-provider";
import { client } from "../../../../utils/client/client";
import { AlertDialogFooter } from "../../../ui/alert-dialog/alert-dialog-footer";
import { AlertDialogHeader } from "../../../ui/alert-dialog/alert-dialog-header";
import { MotionAlertDialogActionWrapper } from "../../../ui/alert-dialog/motion/action-wrapper.motion";
import { MotionAlertDialogCancelWrapper } from "../../../ui/alert-dialog/motion/cancel-wrapper.motion";
import { AlertDialog } from "../../../ui/alert-dialog/alert-dialog";
import { AlertDialogContent } from "../../../ui/alert-dialog/alert-dialog-content";
import { AlertDialogTitle } from "../../../ui/alert-dialog/alert-dialog-title";
import { AlertDialogDescription } from "../../../ui/alert-dialog/alert-dialog-description";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../../hooks/use-online-status";
import { deleteOfflineEntity } from "../../../../local-db/offline-entity-store";

interface ChapterDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  chapter: ChapterDto;
  clearSelection: () => void;
}

export function ChapterDeleteActions({
  chapter,
  open,
  setOpen,
  onClose = undefined,
  clearSelection,
}: ChapterDeleteActionsProps) {
  const { t } = useTranslation("chapter/actions/chapter/delete-chapter");
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const isOnline = useOnlineStatus();
  if (currentProject === null) {
    toast.error(t("projectNotSelected"));
    return null;
  }

  const { mutate } = client.chapter.softDelete.useMutation({
    onSuccess: () => {
      toast.error(t("toasts.success"));
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
      clearSelection();
      onClose?.();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("toasts.error"));
      }
    },
  });

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogContent className="sm:max-w-200 sm:max-h-[80%] bg-white rounded-lg p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description", { title: chapter.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper onClick={() => setOpen(false)} />
          <MotionAlertDialogActionWrapper
            onClick={async () => {
              if (!isOnline) {
                await deleteOfflineEntity("chapters", chapter.id);
                toast.success(t("toasts.success"));
                await queryClient.invalidateQueries({ queryKey: ["chapter.getAll"] });
                clearSelection();
                onClose?.();
                return;
              }

              mutate({ params: { id: chapter.id, projectId: currentProject.id } });
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
