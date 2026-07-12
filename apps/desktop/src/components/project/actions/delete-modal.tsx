/* eslint-disable max-len */
import { ProjectDto } from "@papyrus/source";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { isFetchError } from "@ts-rest/react-query/v5";
import { AlertDialog } from "../../../components/ui/alert-dialog/alert-dialog";
import { AlertDialogContent } from "../../../components/ui/alert-dialog/alert-dialog-content";
import { AlertDialogHeader } from "../../../components/ui/alert-dialog/alert-dialog-header";
import { AlertDialogTitle } from "../../../components/ui/alert-dialog/alert-dialog-title";
import { AlertDialogDescription } from "../../../components/ui/alert-dialog/alert-dialog-description";
import { AlertDialogFooter } from "../../../components/ui/alert-dialog/alert-dialog-footer";
import { MotionAlertDialogCancelWrapper } from "../../../components/ui/alert-dialog/motion/cancel-wrapper.motion";
import { MotionAlertDialogActionWrapper } from "../../../components/ui/alert-dialog/motion/action-wrapper.motion";
import { useAuth } from "../../../context/auth-provider";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { deleteOfflineEntity } from "../../../local-db/offline-entity-store";

interface ProjectDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  project: ProjectDto;
}

export function ProjectDeleteActions({
  project,
  open,
  setOpen,
  onClose = undefined,
}: ProjectDeleteActionsProps) {
  const { t } = useTranslation(["project/actions/delete-modal", "common"]);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  if (user === null) {
    toast.error(t("common:notConnected"));
    return null;
  }

  const { mutate } = client.project.delete.useMutation({
    onSuccess: () => {
      toast.success(t("delete.success"));
      void queryClient.invalidateQueries({
        queryKey: ["project.getAll"],
      });
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
      <AlertDialogContent className="sm:max-w-[800px] sm:max-h-[80%] bg-white rounded-lg p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("delete.description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper onClick={() => window.history.back()} />
          <MotionAlertDialogActionWrapper
            onClick={async () => {
              if (!isOnline) {
                await deleteOfflineEntity("projects", project.id);
                toast.success(t("delete.success"));
                await queryClient.invalidateQueries({ queryKey: ["project.getAll"] });
                onClose?.();
                window.history.back();
                return;
              }

              mutate({ params: { id: project.id, userId: user.id } });
              window.history.back();
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
