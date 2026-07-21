/* eslint-disable max-len */
import { useEffect, useRef, useState } from "react";
import MindElixir, { MindElixirData } from "mind-elixir";
import "mind-elixir/style.css";
import { client } from "../../../utils/client/client";
import { MindMapDto, queryKeys, updateMindMapSchema } from "@papyrus/source";
import { useProject } from "../../../context/project-provider";
import { useNavigate } from "@tanstack/react-router";
import { mindmapRoute, updateMindmapRoute } from "../../../routes/mindmap/index.route";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { updateOfflineEntity } from "../../../local-db/offline-entity-store";
import { getLocalDatabaseApi } from "../../../local-db/renderer";
import { getEditableMindMapOptions } from "../mind-elixir-options";
import { MindMapGuideButton } from "../mindmap-guide";

// eslint-disable-next-line complexity
export function UpdateMindMap() {
  const { t, i18n } = useTranslation([
    "mindmap/actions/update-mindmap",
    "mindmap/actions/create-mindmap",
    "common",
  ]);
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { id } = updateMindmapRoute.useParams();
  const mindRef = useRef<InstanceType<typeof MindElixir> | null>(null);
  const isOnline = useOnlineStatus();
  const [cachedMindmap, setCachedMindmap] = useState<MindMapDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data } = client.mindmap.get.useQuery({
    queryKey: queryKeys.mindmap.get({ pathParams: { id, projectId: currentProject?.id ?? "" } }),
    queryData: {
      params: { projectId: currentProject?.id ?? "", id },
    },
  });

  const mindmap = cachedMindmap ?? data?.body;

  useEffect(() => {
    void getLocalDatabaseApi()
      .getEntity("mindmaps", id)
      .then((entity) => {
        setCachedMindmap(entity ? (entity.payload as unknown as MindMapDto) : null);
      })
      .catch((error) => {
        console.error("Unable to read cached mindmap", error);
      });
  }, [id]);

  useEffect(() => {
    if (!currentProject?.id || !data?.body) {
      return;
    }

    void getLocalDatabaseApi()
      .saveEntity({
        entityType: "mindmaps",
        id: data.body.id,
        serverId: data.body.id,
        projectId: currentProject.id,
        payload: JSON.parse(JSON.stringify(data.body)),
        syncStatus: "synced",
      })
      .then((entity) => {
        setCachedMindmap(entity.payload as unknown as MindMapDto);
      })
      .catch((error) => {
        console.error("Unable to cache mindmap", error);
      });
  }, [currentProject?.id, data?.body]);

  useEffect(() => {
    if (!mindmap) return;

    const mindMapOptions = getEditableMindMapOptions(
      i18n.language,
      t("mindmap/actions/create-mindmap:newTopic")
    );
    const instance = new MindElixir({
      el: "#viewer-map",
      direction: MindElixir.LEFT,
      draggable: true,
      contextMenu: mindMapOptions.contextMenu,
      toolBar: true,
      keypress: true,
      newTopicName: mindMapOptions.newTopicName,
    });

    instance.init(mindmap.data as MindElixirData);

    mindRef.current = instance;

    return () => {
      instance.destroy();
      mindRef.current = null;
    };
  }, [i18n.language, mindmap, t]);

  const { mutate, isPending } = client.mindmap.update.useMutation({
    onSuccess: (data) => {
      toast.success(t("update.success"));
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mindmap.getAll({ pathParams: { projectId: currentProject?.id ?? "" } }),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mindmap.get({
          pathParams: { projectId: currentProject?.id ?? "", id: data.body.id },
        }),
      });
      void navigate({ to: mindmapRoute.to, params: { name: currentProject?.title ?? "" } });
    },
    onError: (error) => {
      if (isFetchError(error)) {
        console.error("Fetch error:", error);
        toast.error(error.message);
      } else {
        toast.error(t("common:error"));
      }
    },
  });

  async function handleSubmit() {
    if (isSubmitting || isPending) return;
    setIsSubmitting(true);
    if (!mindRef.current) {
      toast.error(t("notInitialized"));
      setIsSubmitting(false);
      return;
    }
    if (!currentProject) {
      toast.error(t("common:projectNotSelected"));
      setIsSubmitting(false);
      return;
    }

    const mindmapData = mindRef.current.getData();
    const parsed = updateMindMapSchema.safeParse({
      title: mindmapData.nodeData.topic,
      project: currentProject,
      data: mindmapData,
    });

    if (!parsed.success) {
      toast.error(t("invalidFields"));
      setIsSubmitting(false);
      return;
    }

    const body = parsed.data;

    if (!isOnline && mindmap) {
      await updateOfflineEntity<typeof body, MindMapDto>(
        "mindmaps",
        currentProject.id,
        mindmap,
        body
      );
      toast.success(t("update.success"));
      await queryClient.invalidateQueries({
        queryKey: queryKeys.mindmap.getAll({ pathParams: { projectId: currentProject.id } }),
      });
      void navigate({ to: mindmapRoute.to, params: { name: currentProject.title } });
      setIsSubmitting(false);
      return;
    }

    mutate(
      {
        body,
        params: { projectId: currentProject.id, id },
      },
      {
        onSettled: () => setIsSubmitting(false),
      }
    );
  }

  if (!mindmap) return <div>{t("common:loading")}</div>;

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div
          className="flex justify-between items-center"
          data-mindmap-guide="mindmap-editor-header"
        >
          <h2 className="text-2xl font-semibold">{mindmap.title}</h2>
          <div className="flex gap-2">
            <MindMapGuideButton variant="editor" />
            <Button
              onClick={() =>
                void navigate({
                  to: mindmapRoute.to,
                  params: { name: currentProject?.title ?? "" },
                })
              }
              className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-gray-400 transition"
            >
              {t("common:close")}
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <div
            id="viewer-map"
            data-mindmap-guide="mindmap-editor-canvas"
            style={{ height: "500px", width: "100%" }}
          />
        </div>
        <div className="mt-6 flex w-full">
          <Button
            onClick={handleSubmit}
            data-mindmap-guide="mindmap-editor-save"
            isLoading={isSubmitting || isPending}
            className="px-6 py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t("update.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
