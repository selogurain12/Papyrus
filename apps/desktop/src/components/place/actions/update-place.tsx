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
import { UpdatePlaceDto, updatePlaceSchema, PlaceDto } from "@papyrus/source";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "../../../context/auth-provider";
import { useProject } from "../../../context/project-provider";
import { useNavigate } from "@tanstack/react-router";
import { placeRoute } from "../../../routes/place/index.route";
import { SingleSelector } from "../../ui/single-select";
import { importanceOptions, TypeOption, typeOptions } from "../../../utils/value-for-select";

interface UpdatePlaceProps {
  onCancel?: () => void;
  place: PlaceDto;
}

export function UpdatePlace({ onCancel, place }: UpdatePlaceProps) {
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();

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
      toast.success("Lieu modifié avec succès !");
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
        toast.error("Une erreur est survenue");
      }
    },
  });

  function onSubmit(data: UpdatePlaceDto) {
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
      params: { projectId: currentProject.id, id: place.id },
    });
  }

  if (!currentProject) return <div>Loading...</div>;

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
          <h2 className="text-2xl font-bold mb-6">Modifier le lieu</h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* NOM */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">Nom du lieu *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Café Le Métropolitain" />
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
                  <FormLabel className="font-semibold mb-1">Surnom</FormLabel>
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
                  <FormLabel className="font-semibold mb-1">Type de lieu *</FormLabel>
                  <FormControl>
                    <SingleSelector
                      {...field}
                      customDisplay={(item: TypeOption) => item.label}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{item.label}</span>
                      )}
                      value={typeOptions.find((type) => type.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder="Sélectionner un type"
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
                  <FormLabel className="font-semibold mb-1">Localisation</FormLabel>
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
                <FormItem>
                  <FormLabel className="font-semibold mb-1">Personnages présents</FormLabel>
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

            {/* IMPORTANCE */}
            <FormField
              control={form.control}
              name="narrativeImportance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold mb-1">Importance narrative</FormLabel>
                  <FormControl>
                    <SingleSelector
                      {...field}
                      customDisplay={(item: TypeOption) => item.label}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{item.label}</span>
                      )}
                      value={importanceOptions.find((type) => type.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder="Sélectionner une importance"
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
                  <FormLabel className="font-semibold mb-1">Couleur</FormLabel>
                  <FormControl>
                    <div className="flex gap-3 mt-1">
                      {["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"].map(
                        (color) => (
                          <button
                            type="button"
                            key={color}
                            onClick={() => field.onChange(color)}
                            className={`w-8 h-8 rounded-full border ${
                              field.value === color
                                ? "border-black ring-2 ring-offset-1 ring-black"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={color}
                          />
                        )
                      )}
                    </div>
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
                  <FormLabel className="font-semibold mb-1">Histoire</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder="Passé, origine..."
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
                  <FormLabel className="font-semibold mb-1">Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder="Description générale..."
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
                  <FormLabel className="font-semibold mb-1">Atmosphère</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder="Ambiance, sensations..."
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
                  <FormLabel className="font-semibold mb-1">Langues</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder="Langues parlées..."
                      rows={4}
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
                  <FormLabel className="font-semibold mb-1">Détails visuels</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder="Architecture, décor..."
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
                  <FormLabel className="font-semibold mb-1">Gouvernement</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder="Type de gouvernement, dirigeants..."
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
                  <FormLabel className="font-semibold mb-1">Ressources</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value || null)}
                      placeholder="Ressources naturelles, économiques, stratégiques..."
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
              Annuler
            </Button>

            <Button type="submit">Modifier le lieu</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
