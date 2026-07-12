import { ObjectDto } from "@papyrus/source";
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
import { objectRoute } from "../../../routes/object/index.route";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { deleteOfflineEntity } from "../../../local-db/offline-entity-store";

interface ObjectDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  object: ObjectDto;
  clearSelection: () => void;
}

export function ObjectDeleteActions({
  object,
  open,
  setOpen,
  onClose = undefined,
  clearSelection,
}: ObjectDeleteActionsProps) {
  const { t } = useTranslation(["object/actions/delete-object", "common"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const isOnline = useOnlineStatus();
  if (currentProject === null) {
    toast.error(t("common:projectNotSelected"));
    return null;
  }

  const { mutate } = client.object.softDelete.useMutation({
    onSuccess: () => {
      toast.success(t("delete.success"));
      void queryClient.invalidateQueries({
        queryKey: ["object.getAll"],
      });
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
      <AlertDialogContent className="sm:max-w-[800px] sm:max-h-[80%] bg-white rounded-lg p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("delete.description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper onClick={() => setOpen(false)} />
          <MotionAlertDialogActionWrapper
            onClick={async () => {
              if (!isOnline) {
                await deleteOfflineEntity("objects", object.id);
                toast.success(t("delete.success"));
                await queryClient.invalidateQueries({ queryKey: ["object.getAll"] });
                clearSelection();
                onClose?.();
                navigate({
                  to: objectRoute.to,
                  params: { name: currentProject.title },
                });
                return;
              }

              mutate({ params: { id: object.id, projectId: currentProject.id } });
              navigate({
                to: objectRoute.to,
                params: { name: currentProject.title },
              });
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
