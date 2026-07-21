import { useState } from "react";
import { Dialog } from "../ui/dialogs/dialog";
import { ProjectCard } from "./project-card";
import { useAuth } from "../../context/auth-provider";
import { ProjectDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { UpdateProjectForm } from "./actions/update-form";
import { ProjectDeleteActions } from "./actions/delete-modal";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useOfflineList } from "../../hooks/use-offline-list";
import { Card } from "../ui/card";
import { BookOpen, Edit3, FolderOpen, Star } from "lucide-react";

export function ListProject() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  if (user === null) {
    toast.error(t("notConnected"));
    return null;
  }
  const userId = user.id;

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  const { data } = client.project.getAll.useQuery({
    queryKey: queryKeys.project.getAll({
      pathParams: { userId },
    }),
    queryData: {
      params: { userId },
    },
  });
  const projects = useOfflineList({
    entityType: "projects",
    projectId: userId,
    onlineData: data?.body,
  });

  const totalWordCount = data?.body.data.reduce(
    (sum, project) => sum + (project.currentWordCount ?? 0),
    0
  );

  const completedProjects = data?.body.data.filter(
    (project) => project.status === "completed"
  ).length;
  const activeProjects = data?.body.data.filter((project) => project.status === "writing").length;

  return (
    <div>
      <div className="gap-3 flex pb-8" data-tour="home-project-stats">
        <Card className="p-3 flex w-1/4">
          <div className="justify-between w-full flex items-center">
            <div>
              <p className="text-sm text-gray-600">{t("stats.totalProjects")}</p>
              <p className="text-3xl font-bold text-gray-900">{data?.body.total}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-3 flex w-1/4">
          <div className="justify-between w-full flex items-center">
            <div>
              <p className="text-sm text-gray-600">{t("stats.writtenWords")}</p>
              <p className="text-3xl font-bold text-gray-900">{totalWordCount}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-3 flex w-1/4">
          <div className="justify-between w-full flex items-center">
            <div>
              <p className="text-sm text-gray-600">{t("status.writing")}</p>
              <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
            </div>
            <Edit3 className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-3 flex w-1/4">
          <div className="justify-between w-full flex items-center">
            <div>
              <p className="text-sm text-gray-600">{t("status.completed")}</p>
              <p className="text-3xl font-bold text-gray-900">{completedProjects}</p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-3"
        data-tour="home-project-list"
      >
        {projects?.data.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={() => {
              setSelectedProject(project);
              setOpen(true);
            }}
            onDelete={() => {
              setSelectedProject(project);
              setOpenDelete(true);
            }}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {selectedProject && (
          <UpdateProjectForm key={selectedProject.id} project={selectedProject} setOpen={setOpen} />
        )}
      </Dialog>
      {selectedProject && (
        <ProjectDeleteActions
          key={selectedProject.id}
          project={selectedProject}
          setOpen={setOpenDelete}
          open={openDelete}
        />
      )}
    </div>
  );
}
