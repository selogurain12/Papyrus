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
import { CreateObjectDto, createObjectSchema } from "@papyrus/source";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "../../../context/auth-provider";
import { useProject } from "../../../context/project-provider";
import { useNavigate } from "@tanstack/react-router";
import { objectRoute } from "../../../routes/object/index.route";
import { SingleSelector } from "../../ui/single-select";
import { importanceOptions, TypeOption, objectTypeOptions } from "../../../utils/value-for-select";

interface CreateObjectProps {
  onCancel?: () => void;
}

export function CreateObject({ onCancel }: CreateObjectProps) {
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();

  if (!currentProject) {
    return <div>Loading...</div>;
  }

  const form = useForm({
    resolver: zodResolver(createObjectSchema),
    defaultValues: {
      name: "",
      importance: "medium",
      description: null,
      appearance: null,
      significance: null,
      location: null,
      type: null,
      history: null,
      color: "blue",
      project: currentProject,
    },
  });

  const { mutate } = client.object.create.useMutation({
    onSuccess: () => {
      toast.success("Objet créé avec succès !");
      void queryClient.invalidateQueries({
        queryKey: ["object.getAll"],
      });
      form.reset();
      onCancel?.();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    },
  });

  function onSubmit(data: CreateObjectDto) {
    if (!user) {
      toast.error("Utilisateur non authentifié");
      return;
    }

    if (!currentProject) {
      toast.error("Projet introuvable");
      return;
    }

    mutate({
      body: data,
      params: { projectId: currentProject.id },
    });
  }

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
          <h2 className="text-2xl font-bold mb-6">Créer un nouveau objet</h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Café Le Métropolitain" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <SingleSelector
                      customDisplay={(item: TypeOption) => item.label}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{item.label}</span>
                      )}
                      value={objectTypeOptions.find((t) => t.id === field.value)}
                      onChange={(value) => field.onChange(value?.id ?? null)}
                      placeholder="Sélectionner un type"
                      data={objectTypeOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Importance */}
            <FormField
              control={form.control}
              name="importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importance narrative</FormLabel>
                  <FormControl>
                    <SingleSelector
                      customDisplay={(item: TypeOption) => item.label}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{item.label}</span>
                      )}
                      value={importanceOptions.find((i) => i.id === field.value)}
                      onChange={(value) => field.onChange(value?.id)}
                      placeholder="Sélectionner une importance"
                      data={importanceOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Localisation */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
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

            {/* Couleur */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <FormControl>
                    <div className="flex gap-3 mt-1">
                      {["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"].map(
                        (color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`w-8 h-8 rounded-full border ${
                              field.value === color
                                ? "border-black ring-2 ring-offset-1 ring-black"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      rows={4}
                      placeholder="Description générale du lieu"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Apparence */}
            <FormField
              control={form.control}
              name="appearance"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Apparence</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      rows={4}
                      placeholder="Architecture, décor..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Signification */}
            <FormField
              control={form.control}
              name="significance"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Importance dans l'histoire</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      rows={4}
                      placeholder="Pourquoi ce lieu est important"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Histoire */}
            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Histoire</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      rows={4}
                      placeholder="Origine, événements passés..."
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
                    to: objectRoute.to,
                    params: { name: "new" },
                  });
                }
              }}
            >
              Annuler
            </Button>

            <Button type="submit">Créer l'objet</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
