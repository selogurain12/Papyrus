import { zodResolver } from "@hookform/resolvers/zod";
import { PartDto, UpdatePartDto, updatePartSchema } from "@papyrus/source";
import { useForm } from "react-hook-form";
import { useProject } from "../../../../context/project-provider";
import { isFetchError } from "@ts-rest/react-query/v5";
import { toast } from "sonner";
import { queryClient } from "../../../../context/query-client";
import { client } from "../../../../utils/client/client";
import { DialogContent } from "../../../ui/dialogs/dialog-content";
import { DialogHeader } from "../../../ui/dialogs/dialog-header";
import { Dispatch, SetStateAction } from "react";
import { DialogTitle } from "../../../ui/dialogs/dialog-title";
import { FormControl } from "../../../ui/forms/form-control";
import { FormField } from "../../../ui/forms/form-field-context";
import { FormItem } from "../../../ui/forms/form-item";
import { FormLabel } from "../../../ui/forms/form-label";
import { FormMessage } from "../../../ui/forms/form-message";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { SingleSelector } from "../../../ui/single-select";
import { statusPartOptions, TypeOption } from "../../../../utils/value-for-select";
import { Form } from "../../../ui/forms/form";

interface UpdatePartProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  part: PartDto;
}

export function UpdatePart({ setOpen, part }: UpdatePartProps) {
  const { currentProject } = useProject();
  if (!currentProject) {
    return <div>Projet non trouvé</div>;
  }
  const form = useForm({
    resolver: zodResolver(updatePartSchema),
    defaultValues: {
      title: part.title,
      status: part.status,
    },
  });
  const { mutate, isPending: loading } = client.part.update.useMutation({
    onSuccess: () => {
      toast.success("Partie modifiée avec succès !");
      void queryClient.invalidateQueries({ queryKey: ["part.getAll"] });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        console.error("Fetch error:", error);
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    },
  });

  function onSubmit(data: UpdatePartDto) {
    mutate({ body: data, params: { id: part.id, projectId: currentProject?.id ?? "" } });
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
        form.reset();
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold tracking-tight">Ajouter une partie</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form className="flex flex-col gap-6 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Partie 1: Introduction" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <FormControl>
                  <SingleSelector
                    customDisplay={(item: TypeOption) => item.label}
                    customLabel={(item: TypeOption) => (
                      <span className="font-medium">{item.label}</span>
                    )}
                    value={statusPartOptions.find((t) => t.id === field.value)}
                    onChange={(value) => field.onChange(value?.id ?? null)}
                    placeholder="Sélectionner un statut"
                    data={statusPartOptions}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full flex flex-wrap gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Annuler
            </Button>
            <Button variant="blue" disabled={loading} className="min-w-45">
              {loading ? "Enregistrement..." : "Modifier la partie"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
