/* eslint-disable max-len */

import { Dispatch, SetStateAction, useState } from "react";
import { DialogContent } from "../../ui/dialogs/dialog-content";
import { DialogHeader } from "../../ui/dialogs/dialog-header";
import { DialogTitle } from "../../ui/dialogs/dialog-title";
import { Form } from "../../ui/forms/form";
import { FormField } from "../../ui/forms/form-field-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { FormItem } from "../../ui/forms/form-item";
import { FormLabel } from "../../ui/forms/form-label";
import { FormControl } from "../../ui/forms/form-control";
import { Input } from "../../ui/input";
import { FormMessage } from "../../ui/forms/form-message";
import { File } from "lucide-react";
import { CreateNoteDto, createNoteSchema } from "@papyrus/source";
import { Button } from "../../ui/button";
import { useProject } from "../../../context/project-provider";
import { Textarea } from "../../ui/textarea";
import { Separator } from "../../ui/separator";
import { FileUpload } from "../../ui/file-attachment";
import { clientFile } from "../../../utils/client/client-file";

interface CreateNoteFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateNoteForm({ setOpen }: CreateNoteFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { currentProject } = useProject();

  if (!currentProject) {
    toast.error("Projet non sélectionné");
    return null;
  }

  const form = useForm({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      project: currentProject,
      tags: [],
      linkFile: null,
    },
  });

  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();
  const { mutateAsync: createNote } = client.note.create.useMutation();

  async function onSubmit(data: CreateNoteDto) {
    if (!currentProject) return;

    setLoading(true);

    try {
      let fileUrl = data.linkFile ?? null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadFile({
          body: formData,
        });

        fileUrl = res.body.url;
      }

      await createNote({
        body: {
          ...data,
          linkFile: fileUrl,
        },
        params: { projectId: currentProject.id },
      });

      toast.success("Note créée avec succès");

      await queryClient.invalidateQueries({
        queryKey: ["note.getAll"],
      });

      form.reset();
      setFile(null);
      setOpen(false);
    } catch (error) {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index)
    );
  };

  return (
    <DialogContent
      className={
        "sm:max-w-[850px] sm:max-h-[90vh] bg-white p-6 sm:p-8 rounded-2xl " +
        "shadow-2xl border border-slate-200 overflow-y-auto"
      }
      onInteractOutside={(event) => {
        event.preventDefault();
        setOpen(false);
        form.reset();
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold tracking-tight">Ajouter une note</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form className="flex flex-col gap-6 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <File className="w-5 h-5" /> Informations de la note
          </h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Développement du personnage de Marcus" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    onChange={(note) => field.onChange(note.target.value || null)}
                    placeholder="Ex: Marcus est un personnage complexe avec un passé mystérieux..."
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Tags</FormLabel>
            <div className="flex gap-2 items-center">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ajouter un tag"
              />
              <Button type="button" variant="secondary" onClick={handleAddTag} className="h-[42px]">
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.watch("tags") || []).map((tag, i) => (
                <span
                  key={i}
                  className={
                    "flex items-center gap-1 px-2 py-1 rounded-full border border-slate-300 " +
                    "bg-slate-100 text-xs"
                  }
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(i)}
                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-slate-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold mb-1">Couleur</FormLabel>
                <FormControl>
                  <div className="flex gap-3 mt-1">
                    {["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"].map(
                      (color) => (
                        <button
                          type="button"
                          key={color}
                          onClick={() => field.onChange(color)}
                          className={`w-8 h-8 rounded-full border ${
                            field.value === color
                              ? "border-black ring-2 ring-offset-1 ring-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={color}
                        />
                      )
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full">
            <Separator className="my-2 bg-gray-300" />
            <FileUpload onFileSelected={(f) => setFile(f)} />
          </div>

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
            <Button variant="blue" disabled={loading} className="min-w-[180px]">
              {loading ? "Enregistrement..." : "Créer la note"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
