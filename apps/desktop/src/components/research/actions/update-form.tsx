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
import { useTranslation } from "react-i18next";
import { Tag } from "../../ui/tag";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { updateOfflineEntity } from "../../../local-db/offline-entity-store";
import { saveLocalAttachment } from "../../../local-db/local-file-store";

interface UpdateResearchFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  research: ResearchDto;
}

export function UpdateResearchForm({ setOpen, research }: UpdateResearchFormProps) {
  const { t } = useTranslation(["research/actions/update-form", "common"]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingLink, setExistingLink] = useState<string | null>(research.link ?? null);
  const isOnline = useOnlineStatus();

  const { currentProject } = useProject();

  if (!currentProject) {
    toast.error(t("common:projectNotSelected"));
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
      let fileUrl: string | null =
        existingLink ?? (data.link?.trim() ? data.link : null) ?? research.link ?? null;

      if (!isOnline) {
        if (file) {
          fileUrl = await saveLocalAttachment(file);
        }

        await updateOfflineEntity<UpdateResearchDto, ResearchDto>(
          "research",
          currentProject.id,
          research,
          { ...data, link: fileUrl }
        );
        toast.success(t("update.success"));
        await queryClient.invalidateQueries({ queryKey: ["research.getAll"] });
        form.reset();
        setFile(null);
        setOpen(false);
        return;
      }

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

      toast.success(t("update.success"));

      await queryClient.invalidateQueries({ queryKey: ["research.getAll"] });

      form.reset();
      setFile(null);
      setOpen(false);
    } catch (error) {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("common:error"));
      }
    } finally {
      setLoading(false);
    }
  }

  const type = form.watch("type");

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
        <DialogTitle className="text-3xl font-bold tracking-tight">{t("update.title")}</DialogTitle>
        <p className="text-sm text-slate-500 mt-1">{t("update.subtitle")}</p>
      </DialogHeader>

      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> {t("sections.info")}
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.title")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="update-research-title"
                      placeholder={t("placeholders.title")}
                    />
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
                  <FormLabel>{t("fields.type")}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "articles", icon: FileText, label: t("types.article") },
                        { value: "links", icon: Globe, label: t("types.link") },
                        { value: "images", icon: Image, label: t("types.image") },
                        { value: "videos", icon: Video, label: t("types.video") },
                        { value: "books", icon: BookOpen, label: t("types.book") },
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
                  <FormLabel>{t("fields.link")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="update-research-link"
                      value={field.value ?? ""}
                      placeholder={t("placeholders.link")}
                    />
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
                  <FormLabel>{t("fields.sources")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="update-research-sources"
                      value={field.value ?? ""}
                      placeholder={t("placeholders.sources")}
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
              <Target className="w-5 h-5" /> {t("sections.details")}
            </h2>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="update-research-description"
                      value={field.value ?? ""}
                      placeholder={t("placeholders.description")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>{t("fields.tags")}</FormLabel>
              <div className="flex gap-2 items-center">
                <Tag
                  value={form.watch("tag")}
                  onChange={(tags) => form.setValue("tag", tags)}
                  placeholder={t("placeholders.tag")}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.note")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="update-research-note"
                      value={field.value ?? ""}
                      placeholder={t("placeholders.note")}
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
                    {t("common:openExternal")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setExistingLink(null);
                    }}
                  >
                    {t("common:delete")}
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
              {t("common:cancel")}
            </Button>
            <Button variant="blue" disabled={loading} className="min-w-45">
              {loading ? t("common:saving") : t("update.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
