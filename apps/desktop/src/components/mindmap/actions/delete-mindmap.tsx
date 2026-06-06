/* eslint-disable no-unused-vars */
import { MindMapDto } from "@papyrus/source";
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

interface MindMapDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  mindmap: MindMapDto;
  clearSelection: () => void;
}

export function MindMapDeleteActions({
  mindmap,
  open,
  setOpen,
  onClose = undefined,
  clearSelection,
}: MindMapDeleteActionsProps) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  if (currentProject === null) {
    toast.error("Projet non sélectionné");
    return null;
  }

  const { mutate } = client.mindmap.softDelete.useMutation({
    onSuccess: () => {
      toast.success("La carte mentale a été supprimée avec succès");
      void queryClient.invalidateQueries({ queryKey: ["mindmap.getAll"] });
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
          <AlertDialogTitle>Supprimer la carte mentale</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer « {mindmap.title} » ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper onClick={() => setOpen(false)} />
          <MotionAlertDialogActionWrapper
            onClick={() => {
              mutate({ params: { id: mindmap.id, projectId: currentProject.id } });
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
