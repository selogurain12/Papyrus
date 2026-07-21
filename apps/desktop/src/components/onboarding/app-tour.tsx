/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef } from "react";
import { HelpCircle } from "lucide-react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useRouterState } from "@tanstack/react-router";

import { Button } from "../ui/button";
import { characterRoute } from "../../routes/character/index.route";
import { chapterRoute } from "../../routes/chapter/index.route";
import { dashboardRoute } from "../../routes/dashboard/index.route";
import { eventRoute } from "../../routes/event/index.route";
import { exportRoute } from "../../routes/export/index.route";
import { goalsRoute } from "../../routes/goals/index.route";
import { mindmapRoute } from "../../routes/mindmap/index.route";
import { noteRoute } from "../../routes/note/index.route";
import { objectRoute } from "../../routes/object/index.route";
import { placeRoute } from "../../routes/place/index.route";
import { researchRoute } from "../../routes/research/index.route";
import { settingsRoute } from "../../routes/settings/index.route";
import { structureRoute } from "../../routes/structure/index.routes";
import {
  getHomeTourSteps,
  getProjectPageTourSteps,
  getProjectTourSteps,
  ProjectSection,
  tourConfig,
  TourKind,
} from "./app-tour.steps";

function startTour(
  kind: TourKind,
  t: ReturnType<typeof useTranslation>["t"],
  navigateToSection: (section: ProjectSection) => void,
  currentSection: ProjectSection,
  isContextualTour: boolean
) {
  const config = tourConfig[kind];
  let steps = getHomeTourSteps(t);

  if (kind === "project") {
    steps = isContextualTour ? getProjectPageTourSteps(currentSection, t) : getProjectTourSteps(t);
  }

  const driverObj = driver({
    animate: true,
    duration: 450,
    showProgress: true,
    skipMissingElement: true,
    allowClose: true,
    overlayOpacity: 0.55,
    stagePadding: 8,
    stageRadius: 8,
    nextBtnText: t("next"),
    prevBtnText: t("previous"),
    doneBtnText: t("finish"),
    progressText: t("tour.progress"),
    steps,
    onNextClick: (_element, step, options) => {
      const section = step.data?.navigateSection as ProjectSection | undefined;

      if (!section) {
        options.driver.moveNext();
        return;
      }

      navigateToSection(section);
      window.setTimeout(() => options.driver.moveNext(), 450);
    },
    onDestroyed: () => {
      localStorage.setItem(config.completedKey, "true");
    },
  });

  driverObj.drive();
}

function AppTourController({ kind, projectName }: { kind: TourKind; projectName?: string }) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hasStarted = useRef(false);
  const config = tourConfig[kind];
  const currentSection = getCurrentProjectSection(pathname);

  const navigateToSection = useCallback(
    (section: ProjectSection) => {
      if (!projectName) return;

      const params = { name: projectName };
      const actions: Record<ProjectSection, () => void> = {
        characters: () => void navigate({ to: characterRoute.to, params }),
        chapters: () => void navigate({ to: chapterRoute.to, params }),
        dashboard: () => void navigate({ to: dashboardRoute.to, params }),
        export: () => void navigate({ to: exportRoute.to, params }),
        goals: () => void navigate({ to: goalsRoute.to, params }),
        mindMaps: () => void navigate({ to: mindmapRoute.to, params }),
        notes: () => void navigate({ to: noteRoute.to, params }),
        objects: () => void navigate({ to: objectRoute.to, params }),
        places: () => void navigate({ to: placeRoute.to, params }),
        research: () => void navigate({ to: researchRoute.to, params }),
        settings: () => void navigate({ to: settingsRoute.to, params }),
        structure: () => void navigate({ to: structureRoute.to, params }),
        timeline: () => void navigate({ to: eventRoute.to, params }),
      };

      actions[section]();
    },
    [navigate, projectName]
  );

  const launchFullTour = useCallback(() => {
    startTour(kind, t, navigateToSection, currentSection, false);
  }, [currentSection, kind, navigateToSection, t]);

  const launchContextualTour = useCallback(() => {
    startTour(kind, t, navigateToSection, currentSection, true);
  }, [currentSection, kind, navigateToSection, t]);

  useEffect(() => {
    function handleStartTour() {
      launchContextualTour();
    }

    window.addEventListener(config.startEvent, handleStartTour);

    return () => window.removeEventListener(config.startEvent, handleStartTour);
  }, [config.startEvent, launchContextualTour]);

  useEffect(() => {
    if (hasStarted.current || localStorage.getItem(config.completedKey) === "true") return;

    hasStarted.current = true;
    const timeoutId = window.setTimeout(() => launchFullTour(), 700);

    return () => window.clearTimeout(timeoutId);
  }, [config.completedKey, launchFullTour]);

  return null;
}

function getCurrentProjectSection(pathname: string): ProjectSection {
  const projectPath = pathname.split("/project/")[1] ?? "";
  const activeSegment = projectPath.split("/").filter(Boolean)[1] ?? "";
  const sections: Record<string, ProjectSection> = {
    "": "dashboard",
    character: "characters",
    chapter: "chapters",
    event: "timeline",
    export: "export",
    goals: "goals",
    mindmap: "mindMaps",
    note: "notes",
    object: "objects",
    place: "places",
    research: "research",
    settings: "settings",
    structure: "structure",
  };

  return sections[activeSegment] ?? "dashboard";
}

function TourButton({ kind }: { kind: TourKind }) {
  const { t } = useTranslation("common");
  const config = tourConfig[kind];

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-tour={config.buttonTourTarget}
      onClick={() => window.dispatchEvent(new Event(config.startEvent))}
      title={t(config.buttonLabelKey)}
    >
      <HelpCircle className="h-4 w-4" />
    </Button>
  );
}

export function HomeTour() {
  return <AppTourController kind="home" />;
}

export function AppTour({ projectName }: { projectName: string }) {
  return <AppTourController kind="project" projectName={projectName} />;
}

export function HomeTourButton() {
  return <TourButton kind="home" />;
}

export function AppTourButton() {
  return <TourButton kind="project" />;
}
