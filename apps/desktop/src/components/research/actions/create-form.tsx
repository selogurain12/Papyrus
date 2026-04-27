/* eslint-disable max-len */
/* eslint-disable max-lines */
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
import { Book, BookOpen, FileText, Globe, Target, Video, Image } from "lucide-react";
import { CreateResearchDto, createResearchSchema } from "@papyrus/source";
import { Button } from "../../ui/button";
import { useProject } from "../../../context/project-provider";
import { Textarea } from "../../ui/textarea";
import { Separator } from "../../ui/separator";
import { FileUpload } from "../../ui/file-attachment";
import { clientFile } from "../../../utils/client/client-file";

interface CreateResearchFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateResearchForm({ setOpen }: CreateResearchFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { currentProject } = useProject();

  if (!currentProject) {
    toast.error("Projet non sélectionné");
    return null;
  }

  const form = useForm({
    resolver: zodResolver(createResearchSchema),
    defaultValues: {
      project: currentProject,
      tag: [],
    },
  });

  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();
  const { mutateAsync: createResearch } = client.research.create.useMutation();

  const type = form.watch("type");

  async function onSubmit(data: CreateResearchDto) {
    if (!currentProject) return;

    setLoading(true);

    try {
      let fileUrl = data.link;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadFile({
          body: formData,
        });

        fileUrl = res.body.url;
      }

      await createResearch({
        body: {
          ...data,
          link: fileUrl,
        },
        params: { projectId: currentProject.id },
      });

      toast.success("Recherche créée avec succès");

      await queryClient.invalidateQueries({
        queryKey: ["research.getAll"],
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
      const currentTags = form.getValues("tag") || [];
      form.setValue("tag", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues("tag") || [];
    form.setValue(
      "tag",
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
        <DialogTitle className="text-3xl font-bold tracking-tight">
          Ajouter une recherche
        </DialogTitle>
        <p className="text-sm text-slate-500 mt-1">
          Complète les informations pour enregistrer la ressource.
        </p>
      </DialogHeader>

      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Informations
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Étude de marché Paris 2026" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "articles", icon: FileText, label: "Article" },
                        { value: "links", icon: Globe, label: "Lien" },
                        { value: "images", icon: Image, label: "Image" },
                        { value: "videos", icon: Video, label: "Vidéo" },
                        { value: "books", icon: Book, label: "Livre" },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <label
                            key={option.value}
                            className={
                              "flex items-center gap-2 rounded-lg border p-2 text-sm cursor-pointer " +
                              (field.value === option.value
                                ? "border-blue-500 bg-blue-50 font-semibold"
                                : "border-slate-300 bg-white")
                            }
                          >
                            <input
                              type="radio"
                              value={option.value}
                              checked={field.value === option.value}
                              onChange={() => field.onChange(option.value)}
                              className="sr-only"
                            />
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source(s)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Ex: Le Monde, Wikipédia"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" /> Détails
            </h2>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Résumé ou note de cadrage"
                      rows={4}
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  className="h-[42px]"
                >
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.watch("tag") || []).map((tag, i) => (
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
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Note interne"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full">
            <Separator className="my-2 bg-gray-300" />
            {type !== "links" && <FileUpload onFileSelected={(f) => setFile(f)} />}
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
              {loading ? "Enregistrement..." : "Créer la recherche"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
