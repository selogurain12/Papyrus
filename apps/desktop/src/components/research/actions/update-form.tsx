/* eslint-disable max-lines */
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
import { BookOpen, FileText, Globe, Target, Video, Image, File as FileIcon } from "lucide-react";
import { ResearchDto, UpdateResearchDto, updateResearchSchema } from "@papyrus/source";
import { Button } from "../../ui/button";
import { useProject } from "../../../context/project-provider";
import { Textarea } from "../../ui/textarea";
import { Separator } from "../../ui/separator";
import { FileUpload } from "../../ui/file-attachment";
import { clientFile } from "../../../utils/client/client-file";

interface UpdateResearchFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  research: ResearchDto;
}

export function UpdateResearchForm({ setOpen, research }: UpdateResearchFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingLink, setExistingLink] = useState<string | null>(research.link ?? null);

  const { currentProject } = useProject();

  if (!currentProject) {
    toast.error("Projet non sélectionné");
    return null;
  }

  const form = useForm({
    resolver: zodResolver(updateResearchSchema),
    defaultValues: {
      title: research.title,
      type: research.type,
      link: research.link,
      sources: research.sources,
      description: research.description,
      tag: research.tag ?? [],
      note: research.note,
    },
  });

  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();
  const { mutateAsync: updateResearch } = client.research.update.useMutation();

  // eslint-disable-next-line complexity
  async function onSubmit(data: UpdateResearchDto) {
    if (!currentProject) return;
    setLoading(true);
    try {
      let fileUrl: string | null = existingLink ?? data.link ?? research.link ?? null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadFile({ body: formData });
        fileUrl = res.body.url;
      }

      if (!file && data.link === undefined && existingLink === null) {
        fileUrl = null;
      }

      await updateResearch({
        body: { ...data, link: fileUrl },
        params: { projectId: currentProject.id, id: research.id },
      });

      toast.success("Recherche modifiée avec succès");

      await queryClient.invalidateQueries({ queryKey: ["research.getAll"] });

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

  const type = form.watch("type");

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
          Modifier la recherche
        </DialogTitle>
        <p className="text-sm text-slate-500 mt-1">
          Modifie les informations et le fichier associé.
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
                        { value: "books", icon: BookOpen, label: "Livre" },
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
                    <Input {...field} value={field.value ?? ""} placeholder="Ex: Le Monde" />
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
                    <Textarea {...field} value={field.value ?? ""} placeholder="Résumé" rows={4} />
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

            {/* Existing file preview */}
            {existingLink && !file && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                <div className="flex items-center gap-3">
                  <FileIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {decodeURIComponent(existingLink.split("/").pop() || existingLink)}
                    </p>
                    <p className="text-xs text-gray-500">{existingLink}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(existingLink, "_blank")}
                  >
                    Ouvrir
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setExistingLink(null);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            )}

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
              {loading ? "Enregistrement..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
