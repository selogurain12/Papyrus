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
import { UpdateObjectDto, updateObjectSchema, ObjectDto, ColorType } from "@papyrus/source";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "../../../context/auth-provider";
import { useProject } from "../../../context/project-provider";
import { useNavigate } from "@tanstack/react-router";
import { objectRoute } from "../../../routes/object/index.route";
import { SingleSelector } from "../../ui/single-select";
import { importanceOptions, objectTypeOptions, TypeOption } from "../../../utils/value-for-select";
import { useTranslation } from "react-i18next";
import { ColorPicker } from "../../ui/color-picker";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { updateOfflineEntity } from "../../../local-db/offline-entity-store";
import { FileUpload } from "../../ui/file-attachment";
import { clientFile } from "../../../utils/client/client-file";
import { saveLocalAttachment } from "../../../local-db/local-file-store";

interface UpdateObjectProps {
  onCancel?: () => void;
  object: ObjectDto;
}

export function UpdateObject({ onCancel, object }: UpdateObjectProps) {
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { t } = useTranslation(["object/actions/update-object", "common"]);
  const isOnline = useOnlineStatus();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(updateObjectSchema),
    defaultValues: {
      name: object.name,
      importance: object.importance,
      description: object.description,
      appearance: object.appearance,
      significance: object.significance,
      location: object.location,
      type: object.type,
      history: object.history,
      color: object.color,
      avatarLink: object.avatarLink ?? null,
    },
  });
  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();

  const { mutate } = client.object.update.useMutation({
    onSuccess: () => {
      toast.success(t("update.success"));
      void queryClient.invalidateQueries({
        queryKey: ["object.getAll"],
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

  async function onSubmit(data: UpdateObjectDto) {
    if (!user) {
      toast.error(t("common:errors.unauthenticated"));
      return;
    }

    if (!currentProject) {
      toast.error(t("common:currentProjectMissing"));
      return;
    }

    let avatarLink = data.avatarLink ?? object.avatarLink ?? null;

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
      await updateOfflineEntity<UpdateObjectDto, ObjectDto>(
        "objects",
        currentProject.id,
        object,
        payload
      );
      toast.success(t("update.success"));
      await queryClient.invalidateQueries({ queryKey: ["object.getAll"] });
      form.reset();
      setAvatarFile(null);
      onCancel?.();
      return;
    }

    mutate({
      body: payload,
      params: { projectId: currentProject.id, id: object.id },
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
          <h2 className="text-2xl font-bold mb-6">{t("update.title")}</h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-2">
              <FileUpload
                label={t("fields.avatar")}
                accept="image/*"
                maxSize={5}
                onFileSelected={(file) => {
                  setAvatarFile(file);
                  form.setValue(
                    "avatarLink",
                    file ? URL.createObjectURL(file) : (object.avatarLink ?? null)
                  );
                }}
              />
            </div>

            {/* NOM */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("placeholders.name")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.type")}</FormLabel>
                  <FormControl>
                    <SingleSelector
                      customDisplay={(item: TypeOption) => t(`types.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`types.${item.id}`)}</span>
                      )}
                      value={objectTypeOptions.find((t) => t.id === field.value)}
                      onChange={(value) => field.onChange(value?.id ?? null)}
                      placeholder={t("placeholders.type")}
                      data={objectTypeOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IMPORTANCE */}
            <FormField
              control={form.control}
              name="importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.importance")}</FormLabel>
                  <FormControl>
                    <SingleSelector
                      customDisplay={(item: TypeOption) => t(`importance.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`importance.${item.id}`)}</span>
                      )}
                      value={importanceOptions.find((i) => i.id === field.value)}
                      onChange={(value) => field.onChange(value?.id)}
                      placeholder={t("placeholders.importance")}
                      data={importanceOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LOCALISATION */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.location")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* COULEUR */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.color")}</FormLabel>
                  <FormControl>
                    <ColorPicker
                      className="mt-3"
                      value={field.value as ColorType | null | undefined}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("fields.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* APPARENCE */}
            <FormField
              control={form.control}
              name="appearance"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("fields.appearance")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SIGNIFICATION */}
            <FormField
              control={form.control}
              name="significance"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("fields.significance")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* HISTOIRE */}
            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("fields.history")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
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
                if (onCancel) onCancel();
                else {
                  void navigate({
                    to: objectRoute.to,
                    params: { name: "new" },
                  });
                }
              }}
            >
              {t("common:cancel")}
            </Button>

            <Button type="submit" variant="blue">
              {t("update.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
