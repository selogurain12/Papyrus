/* eslint-disable max-len */
import { ProjectDto } from "@papyrus/source";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { PencilLine, Trash2 } from "lucide-react";

interface ProjectCardProps {
  project: ProjectDto;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const progress = (100 * (project?.currentWordCount ?? 0)) / (project?.targetWordCount ?? 1);

  function statusColor(status: "planning" | "writing" | "editing" | "completed" | undefined) {
    switch (status) {
      case "planning":
        return (
          <div className="absolute top-2 right-2 bg-yellow-100 text-sm font-medium px-3 py-1 rounded-full">
            Planification
          </div>
        );
      case "writing":
        return (
          <div className="absolute top-2 right-2 bg-blue-100 text-sm font-medium px-3 py-1 rounded-full">
            Ecriture
          </div>
        );
      case "editing":
        return (
          <div className="absolute top-2 right-2 bg-purple-100 text-sm font-medium px-3 py-1 rounded-full">
            Edition
          </div>
        );
      case "completed":
        return (
          <div className="absolute top-2 right-2 bg-green-100 text-sm font-medium px-3 py-1 rounded-full">
            Terminé
          </div>
        );
    }
  }

  return (
    <Card className="rounded-xl overflow-hidden">
      <div className="relative w-full h-48">
        <img src="../../assets/book.jpg" alt="Event cover" className="w-full h-full object-cover" />

        {statusColor(project.status)}

        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
          <CardTitle className="text-white">{project.title}</CardTitle>
          <CardDescription className="text-gray-200">{project.genre}</CardDescription>
        </div>
      </div>

      <CardContent className="mt-4">
        <CardDescription>{project.description}</CardDescription>

        <Field className="w-full max-w-sm mt-4">
          <FieldLabel htmlFor="progress-upload">
            <span className="text-gray-600 text-sm">Progression</span>
            <span className="ml-auto text-gray-600 text-sm">{Math.round(progress)}%</span>
          </FieldLabel>

          <Progress value={progress} id="progress-upload" />

          <FieldLabel htmlFor="progress-upload">
            <span className="text-gray-500 text-xs">{project?.currentWordCount ?? 0} mots</span>
            <span className="ml-auto text-gray-500 text-xs">
              {project?.targetWordCount ?? 0} objectif
            </span>
          </FieldLabel>
        </Field>
        <div className="pt-3 w-full flex items-center gap-2">
          <PencilLine className="text-gray-500 w-4 h-4" onClick={onEdit} />
          <Trash2 className="text-gray-500 w-4 h-4" onClick={onDelete} />
          <Button className="text-xs rounded-xl" size="sm" variant="blue">
            Ouvrir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
