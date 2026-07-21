/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { PartDto, queryKeys } from "@papyrus/source";
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

interface PartDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  part: PartDto;
  clearSelection: () => void;
}

export function PartDeleteActions({
  part,
  open,
  setOpen,
  onClose = undefined,
  clearSelection,
}: PartDeleteActionsProps) {
  const { t } = useTranslation("chapter/actions/part/delete-part");
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const isOnline = useOnlineStatus();
  if (currentProject === null) {
    toast.error(t("projectNotSelected"));
    return null;
  }

  const { mutate, isPending } = client.part.softDelete.useMutation({
    onSuccess: () => {
      toast.error(t("toasts.success"));
      void queryClient.invalidateQueries({
        queryKey: queryKeys.part.getAll({
          pathParams: { projectId: part.project.id },
        }),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.getAll({
          pathParams: { projectId: part.project.id },
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
          <AlertDialogDescription>{t("description", { title: part.title })}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper onClick={() => setOpen(false)} />
          <MotionAlertDialogActionWrapper
            isLoading={isPending}
            onClick={async () => {
              if (!isOnline) {
                await deleteOfflineEntity("parts", part.id);
                toast.success(t("toasts.success"));
                await queryClient.invalidateQueries({ queryKey: ["part.getAll"] });
                await queryClient.invalidateQueries({ queryKey: ["chapter.getAll"] });
                clearSelection();
                onClose?.();
                return;
              }

              mutate({ params: { id: part.id, projectId: currentProject.id } });
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
