import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePartDto, PartDto, createPartSchema } from "@papyrus/source";
import { useForm } from "react-hook-form";
import { useProject } from "../../../../context/project-provider";
import { isFetchError } from "@ts-rest/react-query/v5";
import { toast } from "sonner";
import { queryClient } from "../../../../context/query-client";
import { client } from "../../../../utils/client/client";
import { DialogContent } from "../../../ui/dialogs/dialog-content";
import { DialogHeader } from "../../../ui/dialogs/dialog-header";
import { Dispatch, SetStateAction } from "react";
import { DialogTitle } from "../../../ui/dialogs/dialog-title";
import { FormControl } from "../../../ui/forms/form-control";
import { FormField } from "../../../ui/forms/form-field-context";
import { FormItem } from "../../../ui/forms/form-item";
import { FormLabel } from "../../../ui/forms/form-label";
import { FormMessage } from "../../../ui/forms/form-message";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { SingleSelector } from "../../../ui/single-select";
import { statusPartOptions, TypeOption } from "../../../../utils/value-for-select";
import { Form } from "../../../ui/forms/form";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../../hooks/use-online-status";
import { createOfflineEntity } from "../../../../local-db/offline-entity-store";

interface CreatePartProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreatePart({ setOpen }: CreatePartProps) {
  const { t } = useTranslation("chapter/actions/part/create-part");
  const { currentProject } = useProject();
  const isOnline = useOnlineStatus();
  if (!currentProject) {
    return <div>{t("projectNotFound")}</div>;
  }
  const form = useForm({
    resolver: zodResolver(createPartSchema),
    defaultValues: {
      project: currentProject,
    },
  });
  const { mutate, isPending: loading } = client.part.create.useMutation({
    onSuccess: () => {
      toast.success(t("toasts.success"));
      void queryClient.invalidateQueries({ queryKey: ["part.getAll"] });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        console.error("Fetch error:", error);
        toast.error(error.message);
      } else {
        toast.success(t("toasts.success"));
      }
    },
  });

  async function onSubmit(data: CreatePartDto) {
    if (!currentProject) {
      return;
    }

    if (!isOnline) {
      await createOfflineEntity<CreatePartDto, PartDto>("parts", currentProject.id, data);
      toast.success(t("common:offline.savedLocally"));
      await queryClient.invalidateQueries({ queryKey: ["part.getAll"] });
      form.reset();
      setOpen(false);
      return;
    }

    mutate({ body: data, params: { projectId: currentProject?.id ?? "" } });
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
        <DialogTitle className="text-3xl font-bold tracking-tight">{t("title")}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form className="flex flex-col gap-6 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.title")}</FormLabel>
                <FormControl>
                  <Input {...field} id="title" placeholder={t("fields.titlePlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.status")}</FormLabel>
                <FormControl>
                  <SingleSelector
                    customDisplay={(item: TypeOption) => t(`fields.statusOptions.${item.id}`)}
                    customLabel={(item: TypeOption) => (
                      <span className="font-medium">{t(`fields.statusOptions.${item.id}`)}</span>
                    )}
                    value={statusPartOptions.find((t) => t.id === field.value)}
                    onChange={(value) => field.onChange(value?.id ?? null)}
                    placeholder={t("fields.statusPlaceholder")}
                    data={statusPartOptions}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full flex flex-wrap gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              {t("actions.cancel")}
            </Button>
            <Button variant="blue" isLoading={loading} className="min-w-45">
              {loading ? t("actions.loading") : t("actions.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
