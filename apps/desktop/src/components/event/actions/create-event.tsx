/* eslint-disable max-lines */
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Form } from "../../ui/forms/form";
import { FormField } from "../../ui/forms/form-field-context";
import { FormControl } from "../../ui/forms/form-control";
import { FormItem } from "../../ui/forms/form-item";
import { FormMessage } from "../../ui/forms/form-message";
import { FormLabel } from "../../ui/forms/form-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEventSchema,
  CreateEventDto,
  EventDto,
  ChapterDto,
  queryKeys,
} from "@papyrus/source";
import { useAuth } from "../../../context/auth-provider";
import { useProject } from "../../../context/project-provider";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import { eventRoute } from "../../../routes/event/index.route";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { DateTimePicker } from "../../ui/date/datetime-picker";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { createOfflineEntity } from "../../../local-db/offline-entity-store";
import { Checkbox } from "../../ui/checkbox";
import { Field } from "../../ui/field";
import { useState } from "react";
import { SingleSelector } from "../../ui/single-select";
import { useOfflineList } from "../../../hooks/use-offline-list";

interface CreateEventProps {
  onCancel?: () => void;
}

export function CreateEvent({ onCancel }: CreateEventProps) {
  const { t } = useTranslation(["event/actions/create-event", "common"]);
  const user = useAuth();
  const { currentProject } = useProject();
  const defaultDate = fromDate(new Date(), getLocalTimeZone()).toString();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [selected, setSelected] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterDto | null>(null);
  if (!currentProject) {
    return <div>{t("projectNotFound")}</div>;
  }

  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: null,
      importance: null,
      location: null,
      additionalDetails: null,
      eventDate: defaultDate,
      project: currentProject!,
      chapter: null,
    },
  });

  const { data: chapters } = client.chapter.getAll.useQuery({
    queryKey: queryKeys.chapter.getAll({
      pathParams: {
        projectId: currentProject?.id ?? "",
      },
    }),
    queryData: {
      params: { projectId: currentProject?.id ?? "" },
    },
  });
  const cachedChapters = useOfflineList({
    entityType: "chapters",
    projectId: currentProject.id,
    onlineData: chapters?.body,
  });

  const { mutate } = client.event.create.useMutation({
    onSuccess: () => {
      toast.success(t("create.success"));
      void queryClient.invalidateQueries({ queryKey: ["event.getAll"] });
      form.reset();
      onCancel?.();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("common:error"));
      }
    },
  });

  if (!currentProject) return <div>{t("common:loading")}</div>;

  async function handleSubmit(data: CreateEventDto) {
    if (user === null) {
      toast.error(t("common:notConnected"));
      return;
    }
    if (currentProject === null) {
      toast.error(t("common:currentProjectMissing"));
      return;
    }
    const body: CreateEventDto = {
      ...data,
      chapter: selected ? selectedChapter : null,
    };

    if (!isOnline) {
      await createOfflineEntity<CreateEventDto, EventDto>("events", currentProject.id, body);
      toast.success(t("common:offline.savedLocally"));
      await queryClient.invalidateQueries({ queryKey: ["event.getAll"] });
      form.reset();
      onCancel?.();
      return;
    }

    mutate({
      body,
      params: { projectId: currentProject.id },
    });
  }

  return (
    <Card className="rounded-lg w-full h-fit flex flex-col">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(handleSubmit)(event);
          }}
          className="flex flex-col flex-1 overflow-y-auto p-6"
        >
          <h2 className="text-2xl font-bold mb-6">{t("create.title")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.title")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="create-event-title"
                        placeholder={t("placeholders.title")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("fields.date")}</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value ?? undefined}
                          changeValue={(v) => field.onChange(v)}
                          disabledRange={undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="importance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="importance">{t("fields.type")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ?? ""}
                        onValueChange={(value) => field.onChange(value)}
                        className="w-fit mt-3"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="critical" id="critical" />
                          <Label htmlFor="critical">{t("importance.critical")}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="important" id="important" />
                          <Label htmlFor="important">{t("importance.important")}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="action" id="action" />
                          <Label htmlFor="action">{t("importance.action")}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal">{t("importance.normal")}</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.additionalDetails")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="create-event-additional-details"
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
                        placeholder={t("placeholders.additionalDetails")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="create-event-description"
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
                        placeholder={t("placeholders.description")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.location")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="create-event-location"
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
                        placeholder={t("placeholders.location")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chapter"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-3">
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={selected === true}
                          id="isInChapter"
                          name="isInChapter"
                          onCheckedChange={(checked) => {
                            const nextSelected = checked === true;
                            setSelected(nextSelected);
                            if (!nextSelected) {
                              setSelectedChapter(null);
                              field.onChange(null);
                            }
                          }}
                        />
                        <Label htmlFor="isInChapter">{t("fields.chapterToggle")}</Label>
                      </Field>
                      {selected === true && (
                        <FormControl>
                          <SingleSelector<ChapterDto>
                            {...field}
                            value={(field.value ?? selectedChapter ?? undefined) as ChapterDto}
                            onChange={(chapter) => {
                              const nextChapter = chapter ?? null;
                              setSelectedChapter(nextChapter);
                              field.onChange(nextChapter);
                            }}
                            customDisplay={(item: ChapterDto) => item.title}
                            customLabel={(item: ChapterDto) => (
                              <span className="font-medium">{item.title}</span>
                            )}
                            placeholder={t("fields.chapterPlaceholder")}
                            data={cachedChapters?.data ?? []}
                          />
                        </FormControl>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                    to: eventRoute.to,
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

export default CreateEvent;
