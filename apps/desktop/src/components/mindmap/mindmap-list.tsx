/* eslint-disable max-len */
import { GitBranch, Plus } from "lucide-react";
import { useProject } from "../../context/project-provider";
import { Button } from "../ui/button";
import { CreateMindMap } from "./create-mindmap";
import { useState } from "react";

export function MindMapPage() {
  const { currentProject } = useProject();
  const [showCreator, setShowCreator] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cartes mentales</h2>
      <p className="text-gray-600">
        Créez et organisez vos idées visuellement avec des cartes mentales.
      </p>

      {!showCreator && (
        <div className="mt-6 bg-blue-100 p-4 rounded-lg text-center items-center justify-center flex flex-col border border-blue-300">
          <GitBranch className="w-10 h-10 text-blue-600 mb-2" />
          <p className="font-bold">Canvas interactif</p>
          <p className="text-sm text-gray-500 mt-1">
            Créez vos cartes mentales sur un canvas blanc où vous pouvez librement organiser vos
            idées.
          </p>

          <Button className="mt-4" variant="blue" onClick={() => setShowCreator(true)}>
            <Plus /> Créer une nouvelle carte mentale
          </Button>
        </div>
      )}

      {showCreator && (
        <div className="mt-4">
          <CreateMindMap
            projectId={currentProject?.id}
            onCreated={() => {
              setShowCreator(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
