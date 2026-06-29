/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Dispatch, SetStateAction } from "react";
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
import { genre, languageOptions, TypeOption } from "../../../utils/value-for-select";
import { SingleSelector } from "../../ui/single-select";
import { BookOpen, Target } from "lucide-react";
import { DatePicker } from "../../ui/date-picker";
import { CreateProjectDto, createProjectSchema } from "@papyrus/source";
import { Button } from "../../ui/button";
import { useTranslation } from "react-i18next";

interface CreateProjectFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateProjectForm({ setOpen }: CreateProjectFormProps) {
  const { t } = useTranslation(["project/actions/create-form", "common"]);
  const { user } = useAuth();
  if (user === null) {
    toast.error(t("common:notConnected"));
    return null;
  }
  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      currentWordCount: 0,
      status: "planning",
      user,
    },
  });
  const { mutate } = client.project.create.useMutation({
    onSuccess: () => {
      toast.success(t("create.success"));
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
  function onSubmit(data: CreateProjectDto) {
    if (user === null) {
      toast.error("User is null");
      return;
    }
    mutate({
      body: {
        ...data,
      },
      params: { userId: user.id },
    });
  }

  return (
    <DialogContent
      className="overscroll-none sm:max-w-[800px] sm:max-h-[80%] bg-white p-8 max-h-4/5"
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
        <DialogTitle className="text-2xl">{t("create.title")}</DialogTitle>
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
                <div>
                  {field.value?.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}

                  <Input
                    placeholder={t("placeholders.tag")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newTag = e.currentTarget.value.trim();
                        if (newTag) {
                          field.onChange([...(field.value ?? []), newTag]);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                </div>
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
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {t("create.submit")}
      </Button>
    </DialogContent>
  );
}
