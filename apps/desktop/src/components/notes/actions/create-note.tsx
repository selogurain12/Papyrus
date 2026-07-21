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
import { ColorType, CreateNoteDto, NoteDto, createNoteSchema } from "@papyrus/source";
import { Button } from "../../ui/button";
import { useProject } from "../../../context/project-provider";
import { Textarea } from "../../ui/textarea";
import { Separator } from "../../ui/separator";
import { FileUpload } from "../../ui/file-attachment";
import { clientFile } from "../../../utils/client/client-file";
import { useTranslation } from "react-i18next";
import { ColorPicker } from "../../ui/color-picker";
import { Tag } from "../../ui/tag";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { createOfflineEntity } from "../../../local-db/offline-entity-store";
import { saveLocalAttachment } from "../../../local-db/local-file-store";

interface CreateNoteFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateNoteForm({ setOpen }: CreateNoteFormProps) {
  const { t } = useTranslation(["notes/actions/create-note", "common"]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const isOnline = useOnlineStatus();

  const { currentProject } = useProject();

  if (!currentProject) {
    toast.error(t("common:projectNotSelected"));
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

      if (!isOnline) {
        if (file) {
          fileUrl = await saveLocalAttachment(file);
        }

        await createOfflineEntity<CreateNoteDto, NoteDto>("notes", currentProject.id, {
          ...data,
          linkFile: fileUrl,
        });
        toast.success(t("common:offline.savedLocally"));
        await queryClient.invalidateQueries({ queryKey: ["note.getAll"] });
        form.reset();
        setFile(null);
        setOpen(false);
        return;
      }

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

      toast.success(t("create.success"));

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
        <DialogTitle className="text-3xl font-bold tracking-tight">{t("create.title")}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form className="flex flex-col gap-6 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Input {...field} id="create-note-title" placeholder={t("placeholders.title")} />
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
                    id="create-note-content"
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
            <Tag
              value={form.watch("tags")}
              onChange={(tags) => form.setValue("tags", tags)}
              placeholder={t("placeholders.tag")}
            />
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
              {t("common:cancel")}
            </Button>
            <Button variant="blue" disabled={loading} className="min-w-45">
              {loading ? t("common:saving") : t("create.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
