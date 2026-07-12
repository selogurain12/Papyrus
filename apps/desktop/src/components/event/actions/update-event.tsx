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
import { updateEventSchema, UpdateEventDto, EventDto } from "@papyrus/source";
import { useAuth } from "../../../context/auth-provider";
import { useProject } from "../../../context/project-provider";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { eventRoute } from "../../../routes/event/index.route";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { DateTimePicker } from "../../ui/date/datetime-picker";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { updateOfflineEntity } from "../../../local-db/offline-entity-store";

interface UpdateEventProps {
  event: EventDto;
  onCancel?: () => void;
}

// eslint-disable-next-line complexity
export function UpdateEvent({ event, onCancel }: UpdateEventProps) {
  const { t } = useTranslation(["event/actions/update-event", "common"]);
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const form = useForm({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: event?.title ?? undefined,
      description: event?.description ?? null,
      importance: event?.importance ?? null,
      location: event?.location ?? null,
      additionalDetails: event?.additionalDetails ?? null,
      eventDate: event?.eventDate ?? undefined,
    },
  });

  const { mutate } = client.event.update.useMutation({
    onSuccess: () => {
      toast.success(t("update.success"));
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
  if (!event) return <div>{t("select.title")}</div>;

  async function handleSubmit(data: UpdateEventDto) {
    if (user === null) {
      toast.error(t("common:notConnected"));
      return;
    }
    if (currentProject === null) {
      toast.error(t("common:currentProjectMissing"));
      return;
    }
    if (!isOnline) {
      await updateOfflineEntity<UpdateEventDto, EventDto>("events", currentProject.id, event, data);
      toast.success(t("update.success"));
      await queryClient.invalidateQueries({ queryKey: ["event.getAll"] });
      form.reset();
      onCancel?.();
      return;
    }

    mutate({ body: data, params: { projectId: currentProject.id, id: event.id } });
  }

  return (
    <Card className="rounded-lg w-full h-full flex flex-col">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(handleSubmit)(event);
          }}
          className="flex flex-col flex-1 overflow-y-auto p-6"
        >
          <h2 className="text-2xl font-bold mb-6">{t("update.title")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.title")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
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
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
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
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
                      />
                    </FormControl>
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

            <Button type="submit">{t("update.submit")}</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}

export default UpdateEvent;
