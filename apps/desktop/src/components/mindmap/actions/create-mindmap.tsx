/* eslint-disable max-len */
import { useEffect, useRef } from "react";
import MindElixir from "mind-elixir";
import { createMindMapSchema } from "@papyrus/source";
import "mind-elixir/style.css";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { useProject } from "../../../context/project-provider";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useNavigate } from "@tanstack/react-router";
import { mindmapRoute } from "../../../routes/mindmap/index.route";
import { Button } from "../../ui/button";

export function CreateMindMap() {
  const mindRef = useRef<InstanceType<typeof MindElixir> | null>(null);
  const navigate = useNavigate();
  const { currentProject } = useProject();

  useEffect(() => {
    const instance = new MindElixir({
      el: "#map",
      direction: MindElixir.LEFT,
      draggable: true,
      contextMenu: true,
      toolBar: true,
      keypress: true,
    });

    instance.init(MindElixir.new("new topic"));

    mindRef.current = instance;
  }, []);

  const { mutate } = client.mindmap.create.useMutation({
    onSuccess: () => {
      toast.success("Carte mentale créée avec succès !");
      void queryClient.invalidateQueries({ queryKey: ["mindmap.getAll"] });
      void navigate({ to: mindmapRoute.to, params: { name: currentProject?.title ?? "" } });
    },
    onError: (error) => {
      if (isFetchError(error)) {
        console.error("Fetch error:", error);
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    },
  });

  async function handleSubmit() {
    if (!mindRef.current) {
      toast.error("MindElixir n'est pas initialisé.");
      return;
    }
    if (!currentProject) {
      toast.error("Aucun projet sélectionné.");
      return;
    }

    const data = mindRef.current.getData();
    const parsed = createMindMapSchema.safeParse({
      title: "Nouvelle carte mentale",
      project: currentProject,
      data,
    });

    if (!parsed.success) {
      toast.error("Veuillez remplir correctement les champs.");
      return;
    }

    mutate({
      body: {
        title: data.nodeData.topic,
        data,
        project: currentProject,
      },
      params: { projectId: currentProject.id },
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <form onSubmit={handleSubmit} className="rounded-xl">
          <h2 className="text-2xl font-semibold">Créer une carte mentale</h2>
        </form>
        <Button
          onClick={() =>
            navigate({ to: mindmapRoute.to, params: { name: currentProject?.title ?? "" } })
          }
          className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-gray-400 transition"
        >
          Retour
        </Button>
      </div>
      <div className="space-y-2">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4">Canvas interactif</h3>
          <div id="map" style={{ height: "500px", width: "100%" }} />
        </div>
      </div>
      <div className="mt-6 flex w-full">
        <Button
          onClick={handleSubmit}
          className="px-6 py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Créer la carte mentale
        </Button>
      </div>
    </div>
  );
}
