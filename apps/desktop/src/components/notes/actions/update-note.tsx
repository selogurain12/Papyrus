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
import { File, FileIcon } from "lucide-react";
import { ColorType, NoteDto, UpdateNoteDto, updateNoteSchema } from "@papyrus/source";
import { Button } from "../../ui/button";
import { useProject } from "../../../context/project-provider";
import { Textarea } from "../../ui/textarea";
import { Separator } from "../../ui/separator";
import { FileUpload } from "../../ui/file-attachment";
import { clientFile } from "../../../utils/client/client-file";
import { useTranslation } from "react-i18next";
import { ColorPicker } from "../../ui/color-picker";

interface UpdateNoteFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  note: NoteDto;
}

export function UpdateNoteForm({ setOpen, note }: UpdateNoteFormProps) {
  const { t } = useTranslation(["notes/actions/update-note", "common"]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingLink, setExistingLink] = useState<string | null>(note.linkFile ?? null);

  const { currentProject } = useProject();

  if (!currentProject) {
    toast.error(t("common:projectNotSelected"));
    return null;
  }

  const form = useForm({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
      tags: note.tags,
      color: note.color,
      linkFile: note.linkFile,
    },
  });

  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();
  const { mutateAsync: updateNote } = client.note.update.useMutation();

  // eslint-disable-next-line complexity
  async function onSubmit(data: UpdateNoteDto) {
    if (!currentProject) return;

    setLoading(true);

    try {
      let fileUrl: string | null = existingLink ?? data.linkFile ?? note.linkFile ?? null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadFile({
          body: formData,
        });

        fileUrl = res.body.url;
      }
      if (!file && data.linkFile === undefined && existingLink === null) {
        fileUrl = null;
      }

      await updateNote({
        body: {
          ...data,
          linkFile: fileUrl,
        },
        params: { projectId: currentProject.id, id: note.id },
      });

      toast.success(t("update.success"));

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
        toast.error(t("common:error"));
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
        <DialogTitle className="text-3xl font-bold tracking-tight">{t("update.title")}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form className="flex flex-col gap-6 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <File className="w-5 h-5" /> {t("sections.info")}
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.title")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("placeholders.title")} />
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
                  <FormLabel>{t("fields.content")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(note) => field.onChange(note.target.value || null)}
                      placeholder={t("placeholders.content")}
                      rows={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>{t("fields.tags")}</FormLabel>
              <div className="flex gap-2 items-center">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder={t("placeholders.tag")}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  className="h-[42px]"
                >
                  {t("common:add")}
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
                  <FormLabel className="font-semibold mb-1">{t("fields.color")}</FormLabel>
                  <FormControl>
                    <ColorPicker
                      className="mt-3"
                      value={field.value as ColorType | null | undefined}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full">
            <Separator className="my-2 bg-gray-300" />
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
              {t("common:cancel")}
            </Button>
            <Button variant="blue" disabled={loading} className="min-w-[180px]">
              {loading ? t("common:saving") : t("update.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
