/* eslint-disable max-len */
import { ProjectDto } from "@papyrus/source";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { projectHomeRoute } from "../../routes/project/index.route";
import { useProject } from "../../context/project-provider";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  project: ProjectDto;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { t } = useTranslation(["project/project-card", "common"]);
  const navigate = useNavigate();
  const { setCurrentProject } = useProject();
  const progress = (100 * (project?.currentWordCount ?? 0)) / (project?.targetWordCount ?? 1);

  function statusColor(status: "planning" | "writing" | "editing" | "completed" | undefined) {
    switch (status) {
      case "planning":
        return (
          <div className="absolute top-2 right-2 bg-yellow-100 text-sm font-medium px-3 py-1 rounded-full">
            {t("common:status.planning")}
          </div>
        );
      case "writing":
        return (
          <div className="absolute top-2 right-2 bg-blue-100 text-sm font-medium px-3 py-1 rounded-full">
            {t("common:status.writing")}
          </div>
        );
      case "editing":
        return (
          <div className="absolute top-2 right-2 bg-purple-100 text-sm font-medium px-3 py-1 rounded-full">
            {t("common:status.editing")}
          </div>
        );
      case "completed":
        return (
          <div className="absolute top-2 right-2 bg-green-100 text-sm font-medium px-3 py-1 rounded-full">
            {t("common:status.completed")}
          </div>
        );
    }
  }

  return (
    <Card className="rounded-xl overflow-hidden">
      <div className="relative w-full h-48">
        <img
          src={`${project.coverLink}`}
          alt={t("card.coverAlt")}
          className="w-full h-full object-cover"
        />

        {statusColor(project.status)}

        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
          <CardTitle className="text-white">{project.title}</CardTitle>
          <CardDescription className="text-gray-200">
            {t(`genres.${project.genre}`, { defaultValue: project.genre })}
          </CardDescription>
        </div>
      </div>

      <CardContent className="mt-4">
        <CardDescription>{project.description}</CardDescription>

        <Field className="w-full max-w-sm mt-4">
          <FieldLabel htmlFor="progress-upload">
            <span className="text-gray-600 text-sm">{t("card.progress")}</span>
            <span className="ml-auto text-gray-600 text-sm">{Math.round(progress)}%</span>
          </FieldLabel>

          <Progress value={progress} id="progress-upload" />

          <FieldLabel htmlFor="progress-upload">
            <span className="text-gray-500 text-xs">
              {t("common:words", { count: project?.currentWordCount ?? 0 })}
            </span>
            <span className="ml-auto text-gray-500 text-xs">
              {t("common:wordGoal", { count: project?.targetWordCount ?? 0 })}
            </span>
          </FieldLabel>
        </Field>
        <div className="pt-3 w-full flex items-center gap-2">
          <PencilLine className="text-gray-500 w-4 h-4" onClick={onEdit} />
          <Trash2 className="text-gray-500 w-4 h-4" onClick={onDelete} />
          <Button
            className="text-xs rounded-xl"
            size="sm"
            variant="blue"
            onClick={() => {
              setCurrentProject(project);
              void navigate({ to: projectHomeRoute.to, params: { name: project.title } });
            }}
          >
            {t("card.open")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
