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
import { useAuth } from "../../../context/auth-provider";
import { FormItem } from "../../ui/forms/form-item";
import { FormLabel } from "../../ui/forms/form-label";
import { FormControl } from "../../ui/forms/form-control";
import { Input } from "../../ui/input";
import { FormMessage } from "../../ui/forms/form-message";
import { Textarea } from "../../ui/textarea";
import { genre, languageOptions, statusOptions, TypeOption } from "../../../utils/value-for-select";
import { SingleSelector } from "../../ui/single-select";
import { BookOpen, FileIcon, Target } from "lucide-react";
import { DatePicker } from "../../ui/date-picker";
import { ProjectDto, UpdateProjectDto, updateProjectSchema } from "@papyrus/source";
import { Button } from "../../ui/button";
import { useTranslation } from "react-i18next";
import { Tag } from "../../ui/tag";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { updateOfflineEntity } from "../../../local-db/offline-entity-store";
import { clientFile } from "../../../utils/client/client-file";
import { saveLocalAttachment } from "../../../local-db/local-file-store";
import { FileUpload } from "../../ui/file-attachment";
import { Separator } from "../../ui/separator";

interface UpdateProjectFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  project: ProjectDto;
}

export function UpdateProjectForm({ setOpen, project }: UpdateProjectFormProps) {
  const { t } = useTranslation(["project/actions/update-form", "common"]);
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  const [file, setFile] = useState<File | null>(null);
  const [existingLink, setExistingLink] = useState<string | null>(project.coverLink ?? null);
  if (user === null) {
    toast.error(t("common:notConnected"));
    return null;
  }
  const form = useForm<UpdateProjectDto>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      genre: project.genre,
      targetWordCount: project.targetWordCount,
      currentWordCount: project.currentWordCount,
      status: project.status,
      author: project.author,
      language: project.language,
      deadline: project.deadline,
      tags: project.tags,
      user,
    },
  });
  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();
  const { mutate, isPending } = client.project.update.useMutation({
    onSuccess: () => {
      toast.success(t("update.success"));
      void queryClient.invalidateQueries({
        queryKey: ["project.getAll"],
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("common:error"));
      }
    },
  });
  // eslint-disable-next-line complexity
  async function onSubmit(data: UpdateProjectDto) {
    if (user === null) {
      toast.error("User is null");
      return;
    }
    let fileUrl: string | null =
      existingLink ?? (data.coverLink?.trim() ? data.coverLink : null) ?? project.coverLink ?? null;

    if (!isOnline) {
      if (file) {
        fileUrl = await saveLocalAttachment(file);
      }
      await updateOfflineEntity<UpdateProjectDto, ProjectDto>("projects", user.id, project, {
        ...data,
        coverLink: fileUrl,
      });
      toast.success(t("update.success"));
      await queryClient.invalidateQueries({ queryKey: ["project.getAll"] });
      form.reset();
      setOpen(false);
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadFile({ body: formData });
      fileUrl = res.body.url;
    }

    if (!file && data.coverLink === undefined && existingLink === null) {
      fileUrl = null;
    }

    mutate({
      body: {
        ...data,
        coverLink: fileUrl,
      },
      params: { userId: user.id, id: project.id },
    });
  }

  return (
    <DialogContent
      className="overscroll-none sm:max-w-200 sm:max-h-[80%] bg-white p-8 max-h-4/5 overflow-y-scroll"
      onInteractOutside={(event) => {
        event.preventDefault();
        setOpen(false);
        form.reset();
      }}
      onClose={() => {
        setOpen(false);
        form.reset();
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-2xl">{t("update.title")}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          onReset={() => form.reset}
          onSubmit={(event) => {
            const theReturnedFunction = form.handleSubmit(onSubmit);
            void theReturnedFunction(event);
          }}
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              {" "}
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
              {t("sections.info")}
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="title">{t("fields.title")}</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      className="border border-gray-300 rounded-md p-2"
                      placeholder={t("fields.title")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="description">{t("fields.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder={t("fields.description")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="genre">{t("fields.genre")}</FormLabel>
                  <FormControl>
                    <SingleSelector<TypeOption>
                      {...field}
                      customDisplay={(item: TypeOption) => t(`genres.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`genres.${item.id}`)}</span>
                      )}
                      value={genre.find((genr) => genr.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder={t("placeholders.genre")}
                      data={genre}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="author">{t("fields.author")}</FormLabel>
                  <FormControl>
                    <Input
                      id="author"
                      placeholder={t("fields.author")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* --- Colonne 2 : Objectifs et paramètres --- */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              {t("sections.goals")}
            </h2>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="status">{t("fields.status")}</FormLabel>
                  <FormControl>
                    <SingleSelector<TypeOption>
                      {...field}
                      customDisplay={(item: TypeOption) => t(`status.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`status.${item.id}`)}</span>
                      )}
                      value={statusOptions.find((status) => status.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder={t("placeholders.status")}
                      data={statusOptions}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetWordCount"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="targetWordCount">{t("fields.targetWordCount")}</FormLabel>
                  <FormControl>
                    <Input
                      id="targetWordCount"
                      placeholder={t("fields.targetWordCount")}
                      {...field}
                      type="number"
                      onChange={(event) => {
                        field.onChange(Number(event.target.value));
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="language">{t("fields.language")}</FormLabel>
                  <FormControl>
                    <SingleSelector<TypeOption>
                      {...field}
                      customDisplay={(item: TypeOption) => t(`languages.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`languages.${item.id}`)}</span>
                      )}
                      value={languageOptions.find((lang) => lang.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder={t("placeholders.language")}
                      data={languageOptions}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mb-2 font-normal" htmlFor="deadline">
                    {t("fields.deadline")}
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      changeValue={field.onChange}
                      disabledRange={undefined}
                      placeholder={t("placeholders.date")}
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.tags")}</FormLabel>
                  <FormControl>
                    <Tag
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("placeholders.tag")}
                      maxTags={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-full">
            <Separator className="my-2 bg-gray-300" />

            <FormField
              control={form.control}
              name="author"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="author">{t("fields.cover")}</FormLabel>
                  <FormControl>
                    <>
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

                      <FileUpload onFileSelected={(file) => setFile(file)} accept="image/*" />
                    </>
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <Button
        onClick={() => {
          form.handleSubmit(onSubmit)();
        }}
        type="submit"
        isLoading={form.formState.isSubmitting || isPending}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {t("update.submit")}
      </Button>
    </DialogContent>
  );
}
