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
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  if (currentProject === null) {
    toast.error("Projet non sélectionné");
    return null;
  }

  const { mutate } = client.part.softDelete.useMutation({
    onSuccess: () => {
      toast.success("La partie a été supprimée avec succès");
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
        toast.error("Une erreur est survenue");
      }
    },
  });

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogContent className="sm:max-w-200 sm:max-h-[80%] bg-white rounded-lg p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la partie</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer « {part.title} » ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper onClick={() => setOpen(false)} />
          <MotionAlertDialogActionWrapper
            onClick={() => {
              mutate({ params: { id: part.id, projectId: currentProject.id } });
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
