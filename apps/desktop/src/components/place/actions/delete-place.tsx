import { PlaceDto } from "@papyrus/source";
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
import { placeRoute } from "../../../routes/place/index.route";
import { useNavigate } from "@tanstack/react-router";

interface PlaceDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  place: PlaceDto;
  clearSelection: () => void;
}

export function PlaceDeleteActions({
  place,
  open,
  setOpen,
  onClose = undefined,
  clearSelection,
}: PlaceDeleteActionsProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { currentProject } = useProject();
  if (currentProject === null) {
    toast.error("Projet non sélectionné");
    return null;
  }

  const { mutate } = client.place.softDelete.useMutation({
    onSuccess: () => {
      toast.success("Le lieu a été supprimé avec succès");
      void queryClient.invalidateQueries({
        queryKey: ["place.getAll"],
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
      <AlertDialogContent className="sm:max-w-[800px] sm:max-h-[80%] bg-white rounded-lg p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer un lieu</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce lieu ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <MotionAlertDialogCancelWrapper onClick={() => setOpen(false)} />
          <MotionAlertDialogActionWrapper
            onClick={() => {
              mutate({ params: { id: place.id, projectId: currentProject.id } });
              navigate({
                to: placeRoute.to,
                params: { name: currentProject.title },
              });
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
