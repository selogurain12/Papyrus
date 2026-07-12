import { useEffect, useRef, useState } from "react";
import MindElixir, { MindElixirData } from "mind-elixir";
import "mind-elixir/style.css";
import { client } from "../../utils/client/client";
import { MindMapDto, queryKeys } from "@papyrus/source";
import { useProject } from "../../context/project-provider";
import { useNavigate } from "@tanstack/react-router";
import { mindmapRoute, viewMindmapRoute } from "../../routes/mindmap/index.route";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import { getLocalDatabaseApi } from "../../local-db/renderer";

export function MindMapViewer() {
  const { t } = useTranslation("common");
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { id } = viewMindmapRoute.useParams();
  const mindRef = useRef<InstanceType<typeof MindElixir> | null>(null);
  const [cachedMindmap, setCachedMindmap] = useState<MindMapDto | null>(null);

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

    const instance = new MindElixir({
      el: "#viewer-map",
      direction: MindElixir.LEFT,
      draggable: false,
      contextMenu: false,
      toolBar: false,
      keypress: false,
    });

    instance.init(mindmap.data as MindElixirData);

    mindRef.current = instance;
  }, [mindmap]);

  if (!mindmap) return <div>{t("loading")}</div>;

  async function download() {
    const blob = await mindRef.current?.exportPng(false);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mindmap?.title}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{mindmap.title}</h2>
          <div className="gap-2 flex">
            <Button
              onClick={download}
              className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-gray-400 transition"
            >
              <Download />
            </Button>
            <Button
              onClick={() =>
                void navigate({
                  to: mindmapRoute.to,
                  params: { name: currentProject?.title ?? "" },
                })
              }
              className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-gray-400 transition"
            >
              {t("close")}
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <div id="viewer-map" style={{ height: "500px", width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
