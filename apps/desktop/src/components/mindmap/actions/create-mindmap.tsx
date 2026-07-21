/* eslint-disable max-len */
import { useEffect, useRef, useState } from "react";
import MindElixir from "mind-elixir";
import { CreateMindMapDto, MindMapDto, createMindMapSchema } from "@papyrus/source";
import "mind-elixir/style.css";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { useProject } from "../../../context/project-provider";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useNavigate } from "@tanstack/react-router";
import { mindmapRoute } from "../../../routes/mindmap/index.route";
import { Button } from "../../ui/button";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { createOfflineEntity } from "../../../local-db/offline-entity-store";
import { getEditableMindMapOptions } from "../mind-elixir-options";
import { MindMapGuideButton } from "../mindmap-guide";

export function CreateMindMap() {
  const { t, i18n } = useTranslation(["mindmap/actions/create-mindmap", "common"]);
  const mindRef = useRef<InstanceType<typeof MindElixir> | null>(null);
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const isOnline = useOnlineStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const mindMapOptions = getEditableMindMapOptions(i18n.language, t("newTopic"));
    const instance = new MindElixir({
      el: "#map",
      direction: MindElixir.LEFT,
      draggable: true,
      contextMenu: mindMapOptions.contextMenu,
      toolBar: true,
      keypress: true,
      newTopicName: mindMapOptions.newTopicName,
    });

    instance.init(MindElixir.new(t("newTopic")));

    mindRef.current = instance;

    return () => {
      instance.destroy();
      mindRef.current = null;
    };
  }, [i18n.language, t]);

  const { mutate, isPending } = client.mindmap.create.useMutation({
    onSuccess: () => {
      toast.success(t("create.success"));
      void queryClient.invalidateQueries({ queryKey: ["mindmap.getAll"] });
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
    const parsed = createMindMapSchema.safeParse({
      title: mindmapData.nodeData.topic,
      project: currentProject,
      data: mindmapData,
    });

    if (!parsed.success) {
      toast.error(t("invalidFields"));
      setIsSubmitting(false);
      return;
    }

    const body: CreateMindMapDto = parsed.data;

    if (!isOnline) {
      await createOfflineEntity<CreateMindMapDto, MindMapDto>("mindmaps", currentProject.id, body);
      toast.success(t("common:offline.savedLocally"));
      await queryClient.invalidateQueries({ queryKey: ["mindmap.getAll"] });
      void navigate({ to: mindmapRoute.to, params: { name: currentProject.title } });
      setIsSubmitting(false);
      return;
    }

    mutate(
      {
        body,
        params: { projectId: currentProject.id },
      },
      {
        onSettled: () => setIsSubmitting(false),
      }
    );
  }

  return (
    <div className="p-6">
      <div
        className="flex justify-between items-center mb-3"
        data-mindmap-guide="mindmap-editor-header"
      >
        <form onSubmit={handleSubmit} className="rounded-xl">
          <h2 className="text-2xl font-semibold">{t("create.title")}</h2>
        </form>
        <div className="flex gap-2">
          <MindMapGuideButton variant="editor" />
          <Button
            onClick={() =>
              navigate({ to: mindmapRoute.to, params: { name: currentProject?.title ?? "" } })
            }
            className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-gray-400 transition"
          >
            {t("common:backToProjects")}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4">{t("canvas")}</h3>
          <div
            id="map"
            data-mindmap-guide="mindmap-editor-canvas"
            style={{ height: "500px", width: "100%" }}
          />
        </div>
      </div>
      <div className="mt-6 flex w-full">
        <Button
          onClick={handleSubmit}
          data-mindmap-guide="mindmap-editor-save"
          isLoading={isSubmitting || isPending}
          className="px-6 py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t("create.submit")}
        </Button>
      </div>
    </div>
  );
}
