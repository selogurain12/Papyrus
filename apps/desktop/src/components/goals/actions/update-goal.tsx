/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isFetchError } from "@ts-rest/react-query/v5";
import { GoalDto, UpdateGoalDto, updateGoalSchema } from "@papyrus/source";
import { Calendar, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DialogContent } from "../../ui/dialogs/dialog-content";
import { DialogHeader } from "../../ui/dialogs/dialog-header";
import { DialogTitle } from "../../ui/dialogs/dialog-title";
import { Form } from "../../ui/forms/form";
import { FormField } from "../../ui/forms/form-field-context";
import { client } from "../../../utils/client/client";
import { queryClient } from "../../../context/query-client";
import { FormItem } from "../../ui/forms/form-item";
import { FormLabel } from "../../ui/forms/form-label";
import { FormControl } from "../../ui/forms/form-control";
import { Input } from "../../ui/input";
import { FormMessage } from "../../ui/forms/form-message";
import { Textarea } from "../../ui/textarea";
import { TypeOption, unitOptions } from "../../../utils/value-for-select";
import { SingleSelector } from "../../ui/single-select";
import { Button } from "../../ui/button";
import { useProject } from "../../../context/project-provider";
import { DatePicker } from "../../ui/date-picker";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { updateOfflineEntity } from "../../../local-db/offline-entity-store";

interface UpdateGoalFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  goal: GoalDto;
}

export function UpdateGoalForm({ setOpen, goal }: UpdateGoalFormProps) {
  const { t } = useTranslation("goals/actions/update-goal");
  const { currentProject } = useProject();
  const isOnline = useOnlineStatus();
  if (!currentProject) {
    toast.error(t("toast.projectNotSelected"));
    return null;
  }
  const form = useForm({
    resolver: zodResolver(updateGoalSchema),
    defaultValues: {
      isOpen: true,
      title: goal.title,
      description: goal.description,
      type: goal.type,
      deadline: goal.deadline,
      current: goal.current,
      unit: goal.unit,
      goals: goal.goals,
      status: goal.status,
    },
  });
  const { mutate } = client.goal.update.useMutation({
    onSuccess: () => {
      toast.success(t("toast.updateSuccess"));
      void queryClient.invalidateQueries({
        queryKey: ["goal.getAll"],
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("toast.error"));
      }
    },
  });
  async function onSubmit(data: UpdateGoalDto) {
    if (!currentProject) {
      toast.error(t("toast.projectNotSelected"));
      return;
    }
    if (!isOnline) {
      await updateOfflineEntity<UpdateGoalDto, GoalDto>("goals", currentProject.id, goal, data);
      toast.success(t("toast.updateSuccess"));
      await queryClient.invalidateQueries({ queryKey: ["goal.getAll"] });
      form.reset();
      setOpen(false);
      return;
    }

    mutate({
      body: {
        ...data,
      },
      params: { projectId: currentProject.id, id: goal.id },
    });
  }

  return (
    <DialogContent
      className="overscroll-none sm:max-w-125 sm:max-h-[80%] bg-white p-8 max-h-4/5"
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
        <DialogTitle className="text-2xl">{t("title")}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col gap-6 mt-4 w-full"
          onReset={() => form.reset}
          onSubmit={(event) => {
            const theReturnedFunction = form.handleSubmit(onSubmit);
            void theReturnedFunction(event);
          }}
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full">
                <FormLabel htmlFor="type">{t("fields.type")}</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {[
                      { value: "daily", icon: Calendar, label: t("types.daily") },
                      { value: "weekly", icon: Calendar, label: t("types.weekly") },
                      { value: "monthly", icon: Calendar, label: t("types.monthly") },
                      { value: "project", icon: Target, label: t("types.project") },
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
                            onChange={() => {
                              field.onChange(option.value);
                            }}
                            className="sr-only"
                          />
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage className="mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel htmlFor="title">{t("fields.title")}</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    placeholder={t("placeholders.title")}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage className="mt-1" />
              </FormItem>
            )}
          />

          <div className="flex gap-3 w-full">
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start w-full">
                  <FormLabel htmlFor="goals">{t("fields.goals")}</FormLabel>
                  <FormControl>
                    <Input
                      id="goals"
                      type="number"
                      placeholder="500"
                      {...field}
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(Number(event.target.value) || null);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start w-full">
                  <FormLabel htmlFor="author">{t("fields.unit")}</FormLabel>
                  <FormControl>
                    <SingleSelector<TypeOption>
                      {...field}
                      customDisplay={(item: TypeOption) => t(`units.${item.id}`)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(`units.${item.id}`)}</span>
                      )}
                      value={unitOptions.find((lang) => lang.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      data={unitOptions}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
          </div>
          {form.watch("type") === undefined ||
            (form.watch("type") !== "daily" && (
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="deadline">{t("fields.deadline")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        changeValue={(date) => {
                          field.onChange(date);
                        }}
                        disabledRange={undefined}
                        placeholder={t("fields.deadline")}
                        value={field.value ?? undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel htmlFor="description">{t("fields.description")}</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder={t("placeholders.description")}
                    rows={4}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage className="mt-1" />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex gap-3 w-full">
        <Button
          variant="outline"
          className="w-1/2"
          onClick={() => {
            form.reset();
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={() => {
            void form.handleSubmit(onSubmit)();
          }}
          type="submit"
          variant="blue"
          className="text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
        >
          {t("submit")}
        </Button>
      </div>
    </DialogContent>
  );
}
