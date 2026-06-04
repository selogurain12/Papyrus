import { useEffect, useRef, useState } from "react";
import MindElixir from "mind-elixir";
import { createMindMapSchema } from "@papyrus/source";
import "mind-elixir/style.css";

export function CreateMindMap({ projectId, onCreated }) {
  const mindRef = useRef<InstanceType<typeof MindElixir> | null>(null);

  const [error, setError] = useState("");

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!mindRef.current) {
      setError("MindElixir n'est pas initialisé.");
      return;
    }

    const data = mindRef.current.getData();
    const parsed = createMindMapSchema.safeParse({
      project: { id: projectId },
      data,
    });

    if (!parsed.success) {
      setError("Veuillez remplir correctement les champs.");
      return;
    }

    const res = await fetch("/api/mindmaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      setError("Erreur lors de la création.");
      return;
    }

    const mindmap = await res.json();
    onCreated?.(mindmap);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Créer une carte mentale</h2>
        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Créer
        </button>
      </form>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-xl font-semibold mb-4">Canvas interactif</h3>
        <div id="map" style={{ height: "500px", width: "100%" }} />
      </div>
    </div>
  );
}
