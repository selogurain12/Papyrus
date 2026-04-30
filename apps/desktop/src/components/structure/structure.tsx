/* eslint-disable max-len */
import { Tabs } from "../ui/tabs/tabs";
import { TabsContent } from "../ui/tabs/tab-content";
import { TabsList } from "../ui/tabs/tab-list";
import { TabsTrigger } from "../ui/tabs/tab-trigger";
import { Lightbulb, Map, Target, Save, Pencil } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { client } from "../../utils/client/client";
import { queryKeys, UpdateStructureDto, updateStructureSchema } from "@papyrus/source";
import { useProject } from "../../context/project-provider";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { queryClient } from "../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// eslint-disable-next-line complexity
export function StructurePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentProject } = useProject();
  const { data, isLoading } = client.structure.get.useQuery({
    queryKey: queryKeys.structure.get({
      pathParams: { projectId: currentProject?.id || "", id: currentProject?.structure.id || "" },
    }),
    queryData: {
      params: { projectId: currentProject?.id || "", id: currentProject?.structure.id || "" },
    },
  });
  const form = useForm<UpdateStructureDto>({
    resolver: zodResolver(updateStructureSchema),
    defaultValues: {
      premise: "",
      genre: "",
      theme: "",
      structure: "",
      objectives: [],
    },
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      premise: data.body.premise,
      genre: data.body.genre,
      theme: data.body.theme,
      structure: data.body.structure,
      objectives: data.body.objectives,
    });
  }, [data, form]);
  const { mutate: updateStructure } = client.structure.update.useMutation({
    onSuccess: () => {
      toast.success("Structure mise à jour avec succès");
      void queryClient.invalidateQueries({
        queryKey: ["structure.get"],
      });
      setIsUpdating(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(`Erreur lors de la mise à jour de la structure: ${error.message}`);
      } else {
        toast.error("Une erreur inconnue est survenue lors de la mise à jour de la structure");
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>Structure not found</div>;
  }
  function onSubmit(data: UpdateStructureDto) {
    if (currentProject === null) {
      toast.error("Current project is null");
      return;
    }
    updateStructure({
      params: { projectId: currentProject.id, id: currentProject.structure.id },
      body: {
        premise: data.premise,
        genre: data.genre,
        theme: data.theme,
        structure: data.structure,
        objectives: data.objectives,
      },
    });
  }
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Structure du roman</h2>
      <p className="text-gray-600">
        Définissez les fondations de votre histoire en organisant les éléments clés de votre récit.
        Créez une structure solide pour guider votre écriture et capturer l'essence de votre roman.
      </p>
      <div>
        <Tabs defaultValue="concept" className="w-full mt-6">
          <TabsList className="w-full gap-6 p-1">
            <TabsTrigger
              value="concept"
              variant="orange"
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/3"
            >
              <Lightbulb />
              Concept
            </TabsTrigger>
            <TabsTrigger
              value="plan"
              variant="orange"
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/3"
            >
              <Map />
              Plan narratif
            </TabsTrigger>
            <TabsTrigger
              value="objectifs"
              variant="orange"
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/3"
            >
              <Target />
              Objectifs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="concept" className="mt-4">
            <Card className="p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg mb-2">Concept principal</h3>
                <Button
                  variant="transparent"
                  className={`border rounded-lg ${isUpdating ? "bg-green-600 hover:bg-green-700" : ""}`}
                  size="sm"
                  onClick={() => {
                    if (isUpdating) {
                      void form.handleSubmit(onSubmit)();
                    } else {
                      setIsUpdating(true);
                    }
                  }}
                >
                  {isUpdating ? <Save className="text-white" /> : <Pencil />}
                </Button>
              </div>
              <p>Prémisse</p>
              <Input
                placeholder="Ex: Un détective enquête sur une série de meurtres mystérieux dans une ville sombre..."
                className="mb-4"
                value={form.watch("premise") ?? ""}
                onChange={(event) => {
                  form.setValue("premise", event.target.value);
                }}
                disabled={!isUpdating}
              />
              <p>Genre</p>
              <Input
                placeholder="Ex: Thriller, science-fiction, romance, fantasy, etc."
                className="mb-4"
                value={form.watch("genre") ?? ""}
                onChange={(event) => {
                  form.setValue("genre", event.target.value);
                }}
                disabled={!isUpdating}
              />
              <p>Thème</p>
              <Input
                placeholder="Ex: La lutte entre le bien et le mal, la rédemption, la nature humaine..."
                value={form.watch("theme") ?? ""}
                onChange={(event) => {
                  form.setValue("theme", event.target.value);
                }}
                disabled={!isUpdating}
              />
            </Card>
          </TabsContent>
          <TabsContent value="plan" className="mt-4">
            <Card className="p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold mb-2">Plan narratif</h3>
                <Button
                  variant="transparent"
                  className={`border rounded-lg ${isUpdating ? "bg-green-600 hover:bg-green-700" : ""}`}
                  size="sm"
                  onClick={() => {
                    if (isUpdating) {
                      void form.handleSubmit(onSubmit)();
                    } else {
                      setIsUpdating(true);
                    }
                  }}
                >
                  {isUpdating ? <Save /> : <Pencil />}
                </Button>
              </div>
              <p>Structure</p>
              <Input
                placeholder="Ex: Introduction, développement, climax, résolution..."
                className="mb-4"
                value={form.watch("structure") ?? ""}
                onChange={(event) => {
                  form.setValue("structure", event.target.value);
                }}
                disabled={!isUpdating}
              />
            </Card>
          </TabsContent>
          <TabsContent value="objectifs" className="mt-4">
            <Card className="p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold mb-2">Objectifs</h3>
                <Button
                  variant="transparent"
                  className={`border rounded-lg ${isUpdating ? "bg-green-600 hover:bg-green-700" : ""}`}
                  size="sm"
                  onClick={() => {
                    if (isUpdating) {
                      void form.handleSubmit(onSubmit)();
                    } else {
                      setIsUpdating(true);
                    }
                  }}
                >
                  {isUpdating ? <Save /> : <Pencil />}
                </Button>
              </div>
              {isUpdating ? (
                <div className="flex flex-col gap-2">
                  {form.watch("objectives")?.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Objectif ${index + 1}`}
                        value={objective}
                        onChange={(event) => {
                          const newObjectives = [...(form.watch("objectives") ?? [])];
                          newObjectives[index] = event.target.value;
                          form.setValue("objectives", newObjectives);
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newObjectives = [...(form.watch("objectives") ?? [])];
                          newObjectives.splice(index, 1);
                          form.setValue("objectives", newObjectives);
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newObjectives = [...(form.watch("objectives") ?? []), ""];
                      form.setValue("objectives", newObjectives);
                    }}
                  >
                    Ajouter un objectif
                  </Button>
                </div>
              ) : null}
              {!isUpdating && (
                <ul className="list-disc list-inside mb-4">
                  {data.body.objectives?.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              )}
              {!isUpdating &&
              (data.body.objectives === null || data.body.objectives.length === 0) ? (
                <p>Aucun objectif défini pour le moment.</p>
              ) : null}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
