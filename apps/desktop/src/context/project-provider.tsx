import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ProjectDto } from "@papyrus/source";

type ProjectContextType = {
  currentProject: ProjectDto | null;
  // eslint-disable-next-line no-unused-vars
  setCurrentProject: (project: ProjectDto | null) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentProject, setCurrentProjectState] = useState<ProjectDto | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("current_project");
      if (raw) {
        const parsed = JSON.parse(raw) as ProjectDto;
        setCurrentProjectState(parsed);
      }
    } catch (e) {
      console.error("Failed to parse current_project from localStorage", e);
    }
  }, []);

  const setCurrentProject = (project: ProjectDto | null) => {
    try {
      if (project) {
        localStorage.setItem("current_project", JSON.stringify(project));
      } else {
        localStorage.removeItem("current_project");
      }
    } catch (e) {
      console.error("Failed to persist current_project to localStorage", e);
    }
    setCurrentProjectState(project);
  };

  const value: ProjectContextType = {
    currentProject,
    setCurrentProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
