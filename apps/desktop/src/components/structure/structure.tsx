/* eslint-disable max-lines */
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
import {
  queryKeys,
  StructureDto,
  UpdateStructureDto,
  updateStructureSchema,
} from "@papyrus/source";
import { useProject } from "../../context/project-provider";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { queryClient } from "../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { openEditStructureEvent } from "../../utils/shortcut-events";
import { useOnlineStatus } from "../../hooks/use-online-status";
import { getLocalDatabaseApi } from "../../local-db/renderer";
import type { JsonValue } from "../../local-db/types";
import { notifyLocalEntityChanged } from "../../local-db/offline-entity-store";

const structureEntityType = "structures";

function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}

function toStructure(value: JsonValue): StructureDto {
  return value as unknown as StructureDto;
}

// eslint-disable-next-line complexity
export function StructurePage() {
  const { t } = useTranslation(["structure/structure", "common"]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cachedStructure, setCachedStructure] = useState<StructureDto | null>(null);
  const { currentProject } = useProject();
  const isOnline = useOnlineStatus();
  const { data, isLoading } = client.structure.get.useQuery({
    queryKey: queryKeys.structure.get({
      pathParams: { projectId: currentProject?.id || "", id: currentProject?.structure.id || "" },
    }),
    queryData: {
      params: { projectId: currentProject?.id || "", id: currentProject?.structure.id || "" },
    },
    enabled: Boolean(currentProject?.id && currentProject?.structure.id),
  });
  const structure = cachedStructure ?? data?.body;
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
    if (!structure) return;
    form.reset({
      premise: structure.premise,
      genre: structure.genre,
      theme: structure.theme,
      structure: structure.structure,
      objectives: structure.objectives,
    });
  }, [form, structure]);

  useEffect(() => {
    if (!currentProject?.structure.id) {
      return;
    }

    void getLocalDatabaseApi()
      .getEntity(structureEntityType, currentProject.structure.id)
      .then((entity) => {
        setCachedStructure(entity ? toStructure(entity.payload) : null);
      })
      .catch((error) => {
        console.error("Unable to read cached structure", error);
      });
  }, [currentProject?.structure.id]);

  useEffect(() => {
    if (!currentProject?.id || !data?.body) {
      return;
    }

    void getLocalDatabaseApi()
      .saveEntity({
        entityType: structureEntityType,
        id: data.body.id,
        serverId: data.body.id,
        projectId: currentProject.id,
        payload: toJsonValue(data.body),
        syncStatus: "synced",
      })
      .then((entity) => setCachedStructure(toStructure(entity.payload)))
      .catch((error) => {
        console.error("Unable to cache structure", error);
      });
  }, [currentProject?.id, data?.body]);

  useEffect(() => {
    function handleOpenEditStructure() {
      setIsUpdating(true);
    }

    window.addEventListener(openEditStructureEvent, handleOpenEditStructure);

    return () => {
      window.removeEventListener(openEditStructureEvent, handleOpenEditStructure);
    };
  }, []);

  const { mutate: updateStructure } = client.structure.update.useMutation({
    onSuccess: () => {
      toast.success(t("success"));
      void queryClient.invalidateQueries({
        queryKey: ["structure.get"],
      });
      setIsUpdating(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(t("error", { message: error.message }));
      } else {
        toast.error(t("unknownError"));
      }
    },
  });

  if (isLoading && !structure) {
    return <div>{t("common:loading")}</div>;
  }
  if (!structure) {
    return <div>{t("notFound")}</div>;
  }
  const currentStructure = structure;
  async function onSubmit(data: UpdateStructureDto) {
    if (currentProject === null) {
      toast.error(t("common:currentProjectMissing"));
      return;
    }
    if (!isOnline) {
      const nextStructure = {
        ...currentStructure,
        ...data,
      };

      await getLocalDatabaseApi().saveEntity({
        entityType: structureEntityType,
        id: currentStructure.id,
        serverId: currentStructure.id,
        projectId: currentProject.id,
        payload: toJsonValue(nextStructure),
        operation: "update",
      });
      setCachedStructure(nextStructure);
      notifyLocalEntityChanged(structureEntityType);
      toast.success(t("common:offline.savedLocally"));
      setIsUpdating(false);
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
      <div data-tour="page-header">
        <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>
      <div>
        <Tabs defaultValue="concept" className="w-full mt-6">
          <TabsList className="w-full gap-6 p-1" data-tour="structure-tabs">
            <TabsTrigger
              value="concept"
              variant="blue"
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/3"
            >
              <Lightbulb />
              {t("tabs.concept")}
            </TabsTrigger>
            <TabsTrigger
              value="plan"
              variant="blue"
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/3"
            >
              <Map />
              {t("tabs.plan")}
            </TabsTrigger>
            <TabsTrigger
              value="objectifs"
              variant="blue"
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/3"
            >
              <Target />
              {t("tabs.objectives")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="concept" className="mt-4" data-tour="structure-content">
            <Card className="p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg mb-2">{t("mainConcept")}</h3>
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
              <p>{t("premise")}</p>
              <Input
                id="structure-premise"
                placeholder={t("placeholders.premise")}
                className="mb-4"
                value={form.watch("premise") ?? ""}
                onChange={(event) => {
                  form.setValue("premise", event.target.value);
                }}
                disabled={!isUpdating}
              />
              <p>{t("genre")}</p>
              <Input
                id="structure-genre"
                placeholder={t("placeholders.genre")}
                className="mb-4"
                value={form.watch("genre") ?? ""}
                onChange={(event) => {
                  form.setValue("genre", event.target.value);
                }}
                disabled={!isUpdating}
              />
              <p>{t("theme")}</p>
              <Input
                id="structure-theme"
                placeholder={t("placeholders.theme")}
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
                <h3 className="text-lg font-semibold mb-2">{t("tabs.plan")}</h3>
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
              <p>{t("structure")}</p>
              <Input
                id="structure-plan"
                placeholder={t("placeholders.structure")}
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
                <h3 className="text-lg font-semibold mb-2">{t("tabs.objectives")}</h3>
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
                        id={`structure-objective-${index}`}
                        placeholder={t("objective", { index: index + 1 })}
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
                        {t("common:delete")}
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
                    {t("addObjective")}
                  </Button>
                </div>
              ) : null}
              {!isUpdating && (
                <ul className="list-disc list-inside mb-4">
                  {currentStructure.objectives?.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              )}
              {!isUpdating &&
              (currentStructure.objectives === null || currentStructure.objectives.length === 0) ? (
                <p>{t("emptyObjectives")}</p>
              ) : null}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
