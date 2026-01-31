import { useState } from "react";
import { Dialog } from "../ui/dialogs/dialog";
import { ProjectCard } from "./project-card";
import { useAuth } from "../../context/auth-provider";
import { ProjectDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { UpdateProjectForm } from "./actions/update-form";
import { ProjectDeleteActions } from "./actions/delete-modal";
import { toast } from "sonner";

export function ListProject() {
  const { user } = useAuth();
  if (user === null) {
    toast.error("Utilisateur non connecté");
    return null;
  }

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  const { data } = client.project.getAll.useQuery({
    queryKey: queryKeys.project.getAll({
      pathParams: { userId: user.id },
    }),
    queryData: {
      params: { userId: user.id },
    },
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-3">
        {data?.body?.data?.map((project) => (
          <ProjectCard
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
    </>
  );
}
