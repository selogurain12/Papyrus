/* eslint-disable no-unused-vars */
import { GoalDto } from "@papyrus/source";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useTranslation } from "react-i18next";
import { client } from "../../../utils/client/client";
import { AlertDialog } from "../../ui/alert-dialog/alert-dialog";
import { AlertDialogContent } from "../../ui/alert-dialog/alert-dialog-content";
import { AlertDialogHeader } from "../../ui/alert-dialog/alert-dialog-header";
import { AlertDialogTitle } from "../../ui/alert-dialog/alert-dialog-title";
import { AlertDialogDescription } from "../../ui/alert-dialog/alert-dialog-description";
import { AlertDialogFooter } from "../../ui/alert-dialog/alert-dialog-footer";
import { MotionAlertDialogCancelWrapper } from "../../ui/alert-dialog/motion/cancel-wrapper.motion";
import { MotionAlertDialogActionWrapper } from "../../ui/alert-dialog/motion/action-wrapper.motion";
import { useProject } from "../../../context/project-provider";

interface GoalDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  goal: GoalDto;
}

export function GoalDeleteActions({ goal, open, setOpen, onClose }: GoalDeleteActionsProps) {
  const { t } = useTranslation("goals/actions/delete-goal");
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  if (currentProject === null) {
    toast.error(t("toast.projectNotSelected"));
    return null;
  }

  const { mutate } = client.goal.softDelete.useMutation({
    onSuccess: () => {
      toast.success(t("toast.deleteSuccess"));
      void queryClient.invalidateQueries({ queryKey: ["goal.getAll"] });
      onClose?.();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("toast.error"));
      }
    },
  });

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogContent className="sm:max-w-200 sm:max-h-[80%] bg-white rounded-lg p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description", { title: goal.title })}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper
            onClick={() => {
              setOpen(false);
            }}
          />
          <MotionAlertDialogActionWrapper
            onClick={() => {
              mutate({ params: { id: goal.id, projectId: currentProject.id } });
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
