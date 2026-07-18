/* eslint-disable max-lines */
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/forms/form";
import { FormField } from "../../ui/forms/form-field-context";
import { FormItem } from "../../ui/forms/form-item";
import { FormControl } from "../../ui/forms/form-control";
import { FormLabel } from "../../ui/forms/form-label";
import { FormMessage } from "../../ui/forms/form-message";
import { UpdatePlaceDto, updatePlaceSchema, PlaceDto, ColorType } from "@papyrus/source";
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
import { updateOfflineEntity } from "../../../local-db/offline-entity-store";

interface UpdatePlaceProps {
  onCancel?: () => void;
  place: PlaceDto;
}

export function UpdatePlace({ onCancel, place }: UpdatePlaceProps) {
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { t } = useTranslation(["place/actions/update-place", "common"]);
  const isOnline = useOnlineStatus();

  const form = useForm({
    resolver: zodResolver(updatePlaceSchema),
    defaultValues: {
      name: place.name,
      nickname: place.nickname,
      type: place.type,
      localisation: place.localisation,
      physicalDescription: place.physicalDescription,
      atmosphere: place.atmosphere,
      history: place.history,
      population: place.population,
      usages: place.usages,
      language: place.language,
      government: place.government,
      ressources: place.ressources,
      narrativeImportance: place.narrativeImportance,
      color: place.color,
    },
  });

  const { mutate } = client.place.update.useMutation({
    onSuccess: () => {
      toast.success(t("update.success"));
      void queryClient.invalidateQueries({
        queryKey: ["place.getAll"],
      });
      form.reset();
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

  async function onSubmit(data: UpdatePlaceDto) {
    if (!user) {
      toast.error(t("common:errors.unauthenticated"));
      return;
    }

    if (!currentProject) {
      toast.error(t("common:currentProjectMissing"));
      return;
    }

    if (!isOnline) {
      await updateOfflineEntity<UpdatePlaceDto, PlaceDto>("places", currentProject.id, place, data);
      toast.success(t("update.success"));
      await queryClient.invalidateQueries({ queryKey: ["place.getAll"] });
      form.reset();
      onCancel?.();
      return;
    }

    mutate({
      body: data,
      params: { projectId: currentProject.id, id: place.id },
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
            {/* NOM */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">{t("fields.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("placeholders.name")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SURNOM */}
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">{t("fields.nickname")}</FormLabel>
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

            {/* TYPE */}
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

            {/* LOCALISATION */}
            <FormField
              control={form.control}
              name="localisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">{t("fields.localisation")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* POPULATION */}
            <FormField
              control={form.control}
              name="population"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.population")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
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

            {/* IMPORTANCE */}
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

            {/* COULEUR */}
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

            {/* HISTOIRE */}
            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.history")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
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

            {/* DESCRIPTION */}
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

            {/* ATMOSPHERE */}
            <FormField
              control={form.control}
              name="atmosphere"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.atmosphere")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
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

            {/* LANGUES */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="col-span-2">
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

            {/* USAGES */}
            <FormField
              control={form.control}
              name="usages"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.visualDetails")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
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

            {/* GOUVERNEMENT */}
            <FormField
              control={form.control}
              name="government"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.government")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
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

            {/* RESSOURCES */}
            <FormField
              control={form.control}
              name="ressources"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold mb-1">{t("fields.ressources")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
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
              {t("update.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
