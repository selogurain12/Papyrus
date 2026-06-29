/* eslint-disable max-len */
import { useEffect, useRef } from "react";
import MindElixir, { MindElixirData } from "mind-elixir";
import "mind-elixir/style.css";
import { client } from "../../../utils/client/client";
import { queryKeys, updateMindMapSchema } from "@papyrus/source";
import { useProject } from "../../../context/project-provider";
import { useNavigate } from "@tanstack/react-router";
import { mindmapRoute, updateMindmapRoute } from "../../../routes/mindmap/index.route";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useTranslation } from "react-i18next";

export function UpdateMindMap() {
  const { t } = useTranslation(["mindmap/actions/update-mindmap", "common"]);
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { id } = updateMindmapRoute.useParams();
  const mindRef = useRef<InstanceType<typeof MindElixir> | null>(null);

  const { data } = client.mindmap.get.useQuery({
    queryKey: queryKeys.mindmap.get({ pathParams: { id, projectId: currentProject?.id ?? "" } }),
    queryData: {
      params: { projectId: currentProject?.id ?? "", id },
    },
  });

  const mindmap = data?.body;

  useEffect(() => {
    if (!mindmap) return;

    const instance = new MindElixir({
      el: "#viewer-map",
      direction: MindElixir.LEFT,
      draggable: true,
      contextMenu: true,
      toolBar: true,
      keypress: true,
    });

    instance.init(mindmap.data as MindElixirData);

    mindRef.current = instance;
  }, [mindmap]);

  const { mutate } = client.mindmap.update.useMutation({
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
    if (!mindRef.current) {
      toast.error(t("notInitialized"));
      return;
    }
    if (!currentProject) {
      toast.error(t("common:projectNotSelected"));
      return;
    }

    const data = mindRef.current.getData();
    const parsed = updateMindMapSchema.safeParse({
      title: t("newTitle"),
      project: currentProject,
      data,
    });

    if (!parsed.success) {
      toast.error(t("invalidFields"));
      return;
    }

    mutate({
      body: {
        title: data.nodeData.topic,
        data,
        project: currentProject,
      },
      params: { projectId: currentProject.id, id },
    });
  }

  if (!mindmap) return <div>{t("common:loading")}</div>;

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{mindmap.title}</h2>
          <Button
            onClick={() =>
              void navigate({ to: mindmapRoute.to, params: { name: currentProject?.title ?? "" } })
            }
            className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-gray-400 transition"
          >
            {t("common:close")}
          </Button>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <div id="viewer-map" style={{ height: "500px", width: "100%" }} />
        </div>
        <div className="mt-6 flex w-full">
          <Button
            onClick={handleSubmit}
            className="px-6 py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t("update.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
