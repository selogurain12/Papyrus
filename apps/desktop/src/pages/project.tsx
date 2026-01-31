/* eslint-disable max-len */
import { BookOpen, CircleUserRound, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { loginRoute } from "../routes/authentification/index.route";
import { useState } from "react";
import { Dialog } from "../components/ui/dialogs/dialog";
import { CreateProjectForm } from "../components/project/actions/create-form";
import { ListProject } from "../components/project/list-project";

export function ProjectPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="w-full border-b border-gray-200 p-4 bg-gray-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full px-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-secondary-900">Projet Papyrus</h1>
              <p className="text-secondary-500 text-sm">
                Gérez vos documents efficacement avec Papyrus.
              </p>
            </div>
          </div>

          <div className="flex text-right gap-2 items-center">
            <Button
              variant="blue"
              className="transition-colors shadow-sm"
              onClick={() => setOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau projet
            </Button>

            <Button variant="ghost" onClick={() => navigate({ to: loginRoute.to })}>
              <CircleUserRound className="w-8 h-8 font-light" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <CreateProjectForm setOpen={setOpen} />
      </Dialog>

      <div className="mx-[15%] mt-6">
        <ListProject />
      </div>
    </div>
  );
}
