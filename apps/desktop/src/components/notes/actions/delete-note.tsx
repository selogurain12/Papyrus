/* eslint-disable no-unused-vars */
import { NoteDto } from "@papyrus/source";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { isFetchError } from "@ts-rest/react-query/v5";
import { AlertDialog } from "../../ui/alert-dialog/alert-dialog";
import { AlertDialogContent } from "../../ui/alert-dialog/alert-dialog-content";
import { AlertDialogHeader } from "../../ui/alert-dialog/alert-dialog-header";
import { AlertDialogTitle } from "../../ui/alert-dialog/alert-dialog-title";
import { AlertDialogDescription } from "../../ui/alert-dialog/alert-dialog-description";
import { AlertDialogFooter } from "../../ui/alert-dialog/alert-dialog-footer";
import { MotionAlertDialogCancelWrapper } from "../../ui/alert-dialog/motion/cancel-wrapper.motion";
import { MotionAlertDialogActionWrapper } from "../../ui/alert-dialog/motion/action-wrapper.motion";
import { useProject } from "../../../context/project-provider";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { deleteOfflineEntity } from "../../../local-db/offline-entity-store";

interface NoteDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  note: NoteDto;
  clearSelection: () => void;
}

export function NoteDeleteActions({
  note,
  open,
  setOpen,
  onClose = undefined,
  clearSelection,
}: NoteDeleteActionsProps) {
  const { t } = useTranslation(["notes/actions/delete-note", "common"]);
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const isOnline = useOnlineStatus();
  if (currentProject === null) {
    toast.error(t("common:projectNotSelected"));
    return null;
  }

  const { mutate, isPending } = client.note.softDelete.useMutation({
    onSuccess: () => {
      toast.success(t("delete.success"));
      void queryClient.invalidateQueries({ queryKey: ["note.getAll"] });
      clearSelection();
      onClose?.();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("common:error"));
      }
    },
  });

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogContent className="sm:max-w-200 sm:max-h-[80%] bg-white rounded-lg p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete.description", { title: note.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper onClick={() => setOpen(false)} />
          <MotionAlertDialogActionWrapper
            isLoading={isPending}
            onClick={async () => {
              if (!isOnline) {
                await deleteOfflineEntity("notes", note.id);
                toast.success(t("delete.success"));
                await queryClient.invalidateQueries({ queryKey: ["note.getAll"] });
                clearSelection();
                onClose?.();
                return;
              }

              mutate({ params: { id: note.id, projectId: currentProject.id } });
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
