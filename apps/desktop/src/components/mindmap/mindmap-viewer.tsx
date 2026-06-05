import { useEffect, useRef } from "react";
import MindElixir, { MindElixirData } from "mind-elixir";
import "mind-elixir/style.css";
import { client } from "../../utils/client/client";
import { queryKeys } from "@papyrus/source";
import { useProject } from "../../context/project-provider";
import { useNavigate } from "@tanstack/react-router";
import { mindmapRoute, viewMindmapRoute } from "../../routes/mindmap/index.route";
import { Button } from "../ui/button";

export function MindMapViewer() {
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { id } = viewMindmapRoute.useParams();
  const mindRef = useRef<InstanceType<typeof MindElixir> | null>(null);

  const { data } = client.mindmap.get.useQuery({ 
    queryKey: queryKeys.mindmap.get({pathParams: { id, projectId: currentProject?.id ?? "" }}),
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
      draggable: false,
      contextMenu: false,
      toolBar: false,
      keypress: false,
    });

    instance.init(mindmap.data as MindElixirData);

    mindRef.current = instance;
  }, [mindmap]);

  if (!mindmap) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{mindmap.title}</h2>
          <Button
            onClick={() => void navigate({ to: mindmapRoute.to, params: { name: currentProject?.title ?? "" } })}
            className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-gray-400 transition"
          >
            Fermer
          </Button>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <div id="viewer-map" style={{ height: "500px", width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
