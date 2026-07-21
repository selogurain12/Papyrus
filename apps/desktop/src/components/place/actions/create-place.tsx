/* eslint-disable max-lines */
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/forms/form";
import { FormField } from "../../ui/forms/form-field-context";
import { FormItem } from "../../ui/forms/form-item";
import { FormControl } from "../../ui/forms/form-control";
import { FormLabel } from "../../ui/forms/form-label";
import { FormMessage } from "../../ui/forms/form-message";
import { ColorType, CreatePlaceDto, PlaceDto, createPlaceSchema } from "@papyrus/source";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "../../../context/auth-provider";
import { useProject } from "../../../context/project-provider";
import { useNavigate } from "@tanstack/react-router";
import { placeRoute } from "../../../routes/place/index.route";
import { SingleSelector } from "../../ui/single-select";
import {
  importanceOptions,
  languageOptions,
  TypeOption,
  typeOptions,
} from "../../../utils/value-for-select";
import { useTranslation } from "react-i18next";
import { ColorPicker } from "../../ui/color-picker";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { createOfflineEntity } from "../../../local-db/offline-entity-store";
import { FileUpload } from "../../ui/file-attachment";
import { clientFile } from "../../../utils/client/client-file";
import { saveLocalAttachment } from "../../../local-db/local-file-store";

interface CreatePlaceProps {
  onCancel?: () => void;
}

export function CreatePlace({ onCancel }: CreatePlaceProps) {
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { t } = useTranslation(["place/actions/create-place", "common"]);
  const isOnline = useOnlineStatus();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  if (!currentProject) {
    return <div>{t("common:loading")}</div>;
  }

  const form = useForm({
    resolver: zodResolver(createPlaceSchema),
    defaultValues: {
      name: "",
      nickname: null,
      type: "",
      localisation: "",
      physicalDescription: null,
      atmosphere: null,
      history: null,
      population: null,
      usages: null,
      language: null,
      government: null,
      ressources: null,
      narrativeImportance: undefined,
      project: currentProject,
      color: "blue",
      avatarLink: null,
    },
  });
  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();

  const { mutate } = client.place.create.useMutation({
    onSuccess: () => {
      toast.success(t("create.success"));
      void queryClient.invalidateQueries({
        queryKey: ["place.getAll"],
      });
      form.reset();
      setAvatarFile(null);
      onCancel?.();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("common:errors.generic"));
      }
    },
  });

  async function onSubmit(data: CreatePlaceDto) {
    if (!user) {
      toast.error(t("common:errors.unauthenticated"));
      return;
    }

    if (!currentProject) {
      toast.error(t("common:currentProjectMissing"));
      return;
    }

    let avatarLink = data.avatarLink ?? null;

    if (avatarFile) {
      if (isOnline) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const res = await uploadFile({ body: formData });
        avatarLink = res.body.url;
      } else {
        avatarLink = await saveLocalAttachment(avatarFile);
      }
    }

    const payload = {
      ...data,
      avatarLink,
    };

    if (!isOnline) {
      await createOfflineEntity<CreatePlaceDto, PlaceDto>("places", currentProject.id, payload);
      toast.success(t("common:offline.savedLocally"));
      await queryClient.invalidateQueries({ queryKey: ["place.getAll"] });
      form.reset();
      setAvatarFile(null);
      onCancel?.();
      return;
    }

    mutate({
      body: payload,
      params: { projectId: currentProject.id },
    });
  }

  if (!currentProject) return <div>{t("common:loading")}</div>;

  return (
    <Card className="rounded-lg w-full h-full flex flex-col">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(onSubmit)(event);
          }}
          className="flex flex-col flex-1 overflow-y-auto p-6"
        >
          <h2 className="text-2xl font-bold mb-6">{t("create.title")}</h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-2">
              <FileUpload
                label={t("fields.avatar")}
                accept="image/*"
                maxSize={5}
                onFileSelected={(file) => {
                  setAvatarFile(file);
                  form.setValue("avatarLink", file ? URL.createObjectURL(file) : null);
                }}
              />
            </div>

            {/* Colonne 1 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">{t("fields.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} id="create-place-name" placeholder={t("placeholders.name")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">{t("fields.nickname")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="create-place-nickname"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      placeholder={t("placeholders.nickname")}
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
                  <FormLabel className="font-semibold mb-1">{t("fields.type")}</FormLabel>
                  <FormControl>
                    <SingleSelector
                      {...field}
                      customDisplay={(item: TypeOption) => t(`types.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`types.${item.id}`)}</span>
                      )}
                      value={typeOptions.find((type) => type.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder={t("placeholders.type")}
                      data={typeOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">{t("fields.localisation")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="create-place-localisation"
                      placeholder={t("placeholders.localisation")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">{t("fields.languages")}</FormLabel>
                  <FormControl>
                    <SingleSelector
                      {...field}
                      customDisplay={(item: TypeOption) => t(`languages.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`languages.${item.id}`)}</span>
                      )}
                      value={languageOptions.find((language) => language.id === field.value)}
                      onChange={(value) => field.onChange(value?.id ?? null)}
                      placeholder={t("placeholders.language")}
                      data={languageOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="narrativeImportance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">{t("fields.importance")}</FormLabel>
                  <FormControl>
                    <SingleSelector
                      {...field}
                      customDisplay={(item: TypeOption) => t(`importance.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`importance.${item.id}`)}</span>
                      )}
                      value={importanceOptions.find((type) => type.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder={t("placeholders.importance")}
                      data={importanceOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="col-span-2">
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

            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.history")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="create-place-history"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder={t("placeholders.history")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physicalDescription"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">
                    {t("fields.physicalDescription")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="create-place-physical-description"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder={t("placeholders.physicalDescription")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="atmosphere"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.atmosphere")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="create-place-atmosphere"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder={t("placeholders.atmosphere")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="population"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.population")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="create-place-population"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder={t("placeholders.population")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usages"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.visualDetails")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="create-place-usages"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder={t("placeholders.usages")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="government"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.government")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="create-place-government"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder={t("placeholders.government")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ressources"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.ressources")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="create-place-ressources"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder={t("placeholders.ressources")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                if (onCancel) {
                  onCancel();
                } else {
                  void navigate({
                    to: placeRoute.to,
                    params: { name: "new" },
                  });
                }
              }}
            >
              {t("common:cancel")}
            </Button>

            <Button type="submit" variant="blue">
              {t("create.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
