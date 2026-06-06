import { zodResolver } from "@hookform/resolvers/zod";
import { CreateChapterDto, createChapterSchema, PartDto, queryKeys } from "@papyrus/source";
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
import { Textarea } from "../../../ui/textarea";

interface CreateChapterProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateChapter({ setOpen }: CreateChapterProps) {
  const { currentProject } = useProject();
  if (!currentProject) {
    return <div>Projet non trouvé</div>;
  }
  const form = useForm({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      project: currentProject,
      content: "",
      resume: "",
      chapterNumber: 1,
      wordCount: 0,
      wordGoal: 500,
    },
  });

  const { data: parts } = client.part.getAll.useQuery({
    queryKey: queryKeys.part.getAll({
      pathParams: {
        projectId: currentProject?.id ?? "",
      },
    }),
    queryData: {
      params: { projectId: currentProject?.id ?? "" },
    },
  });
  const { mutate, isPending: loading } = client.chapter.create.useMutation({
    onSuccess: (response) => {
      toast.success("Chapitre créé avec succès !");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.getAll({
          pathParams: { projectId: currentProject?.id ?? "" },
        }),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.getByPart({
          pathParams: { projectId: currentProject?.id ?? "", partId: response.body.part.id },
        }),
      });
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

  function onSubmit(data: CreateChapterDto) {
    mutate({ body: data, params: { projectId: currentProject?.id ?? "" } });
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
        <DialogTitle className="text-3xl font-bold tracking-tight">Ajouter un chapitre</DialogTitle>
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
                  <Input {...field} placeholder="Ex: Chapitre 1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="part"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partie</FormLabel>
                <FormControl>
                  <SingleSelector<PartDto>
                    {...field}
                    value={field.value as PartDto}
                    onChange={field.onChange}
                    customDisplay={(item: PartDto) => item.title}
                    customLabel={(item: PartDto) => (
                      <span className="font-medium">{item.title}</span>
                    )}
                    placeholder="Sélectionner une partie"
                    data={parts?.body?.data ?? []}
                  />
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
                    {...field}
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
          <FormField
            control={form.control}
            name="chapterNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro du chapitre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="age"
                    type="number"
                    value={field.value ?? 0}
                    onChange={(event) => field.onChange(Number(event.target.value) || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wordGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objectif en mots</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="age"
                    type="number"
                    value={field.value ?? 0}
                    onChange={(event) => field.onChange(Number(event.target.value) || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Résumé</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value || null)}
                    id="outfit"
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
              {loading ? "Enregistrement..." : "Créer le chapitre"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
