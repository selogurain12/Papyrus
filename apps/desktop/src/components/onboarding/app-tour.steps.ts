/* eslint-disable max-lines */
/* eslint-disable no-unused-vars */
import type { DriveStep } from "driver.js";

export type TourKind = "home" | "project";
export type ProjectSection =
  | "characters"
  | "chapters"
  | "dashboard"
  | "export"
  | "goals"
  | "mindMaps"
  | "notes"
  | "objects"
  | "places"
  | "research"
  | "settings"
  | "structure"
  | "timeline";

type Translate = (key: string) => string;

export interface TourConfig {
  buttonLabelKey: string;
  buttonTourTarget: string;
  completedKey: string;
  startEvent: string;
}

export type PapyrusDriveStep = DriveStep & {
  data?: {
    navigateSection?: ProjectSection;
  };
};

export const tourConfig: Record<TourKind, TourConfig> = {
  home: {
    completedKey: "papyrus.homeTour.completed",
    startEvent: "papyrus:start-home-tour",
    buttonTourTarget: "home-tour-button",
    buttonLabelKey: "tour.home.button",
  },
  project: {
    completedKey: "papyrus.projectTour.completed",
    startEvent: "papyrus:start-project-tour",
    buttonTourTarget: "app-tour-button",
    buttonLabelKey: "tour.project.button",
  },
};

function getTourSelector(name: string) {
  return `[data-tour="${name}"]`;
}

function buildStep(
  element: string,
  title: string,
  description: string,
  side: "top" | "right" | "bottom" | "left",
  align: "start" | "center" | "end" = "start"
): PapyrusDriveStep {
  return {
    element: getTourSelector(element),
    popover: { title, description, side, align },
  };
}

function buildNavigationStep(
  element: string,
  title: string,
  description: string,
  navigateSection: ProjectSection
): PapyrusDriveStep {
  return {
    ...buildStep(element, title, description, "right"),
    data: { navigateSection },
  };
}

export function getHomeTourSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep("home-brand", t("tour.home.brand.title"), t("tour.home.brand.description"), "bottom"),
    buildStep(
      "home-create-project",
      t("tour.home.createProject.title"),
      t("tour.home.createProject.description"),
      "bottom",
      "end"
    ),
    buildStep(
      "home-account",
      t("tour.home.account.title"),
      t("tour.home.account.description"),
      "bottom",
      "end"
    ),
    buildStep(
      "home-project-stats",
      t("tour.home.stats.title"),
      t("tour.home.stats.description"),
      "bottom"
    ),
    buildStep(
      "home-project-list",
      t("tour.home.projectList.title"),
      t("tour.home.projectList.description"),
      "top"
    ),
    buildStep(
      "home-project-card",
      t("tour.home.projectCard.title"),
      t("tour.home.projectCard.description"),
      "top"
    ),
    buildStep(
      "home-open-project",
      t("tour.home.openProject.title"),
      t("tour.home.openProject.description"),
      "top",
      "end"
    ),
    buildStep(
      "home-tour-button",
      t("tour.home.replay.title"),
      t("tour.home.replay.description"),
      "bottom",
      "end"
    ),
  ];
}

export function getProjectTourSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep("brand", t("tour.project.brand.title"), t("tour.project.brand.description"), "right"),
    buildStep(
      "current-project",
      t("tour.project.currentProject.title"),
      t("tour.project.currentProject.description"),
      "right"
    ),
    buildStep(
      "navigation",
      t("tour.project.navigation.title"),
      t("tour.project.navigation.description"),
      "right"
    ),
    buildStep(
      "nav-dashboard",
      t("tour.project.navDashboard.title"),
      t("tour.project.navDashboard.description"),
      "right"
    ),
    buildStep(
      "nav-characters",
      t("tour.project.navCharacters.title"),
      t("tour.project.navCharacters.description"),
      "right"
    ),
    buildStep(
      "nav-chapters",
      t("tour.project.navChapters.title"),
      t("tour.project.navChapters.description"),
      "right"
    ),
    buildStep(
      "nav-research",
      t("tour.project.navResearch.title"),
      t("tour.project.navResearch.description"),
      "right"
    ),
    buildStep(
      "nav-goals",
      t("tour.project.navGoals.title"),
      t("tour.project.navGoals.description"),
      "right"
    ),
    buildStep(
      "header",
      t("tour.project.header.title"),
      t("tour.project.header.description"),
      "bottom"
    ),
    buildStep(
      "dashboard-summary",
      t("tour.project.dashboardSummary.title"),
      t("tour.project.dashboardSummary.description"),
      "bottom"
    ),
    buildStep(
      "dashboard-goals",
      t("tour.project.dashboardGoals.title"),
      t("tour.project.dashboardGoals.description"),
      "top"
    ),
    buildStep(
      "dashboard-progress",
      t("tour.project.dashboardProgress.title"),
      t("tour.project.dashboardProgress.description"),
      "top"
    ),
    buildStep(
      "dashboard-activity",
      t("tour.project.dashboardActivity.title"),
      t("tour.project.dashboardActivity.description"),
      "top"
    ),
    buildStep(
      "dashboard-quick-actions",
      t("tour.project.quickActions.title"),
      t("tour.project.quickActions.description"),
      "top"
    ),
    buildStep(
      "dashboard-streak",
      t("tour.project.writingStreak.title"),
      t("tour.project.writingStreak.description"),
      "top"
    ),
    ...getProjectSectionSteps(t),
    buildStep(
      "page-content",
      t("tour.project.pageContent.title"),
      t("tour.project.pageContent.description"),
      "left"
    ),
    buildStep(
      "app-tour-button",
      t("tour.project.replay.title"),
      t("tour.project.replay.description"),
      "bottom",
      "end"
    ),
  ];
}

export function getProjectPageTourSteps(section: ProjectSection, t: Translate): PapyrusDriveStep[] {
  if (section === "dashboard") {
    return withReplay(
      [
        buildStep(
          "dashboard-intro",
          t("tour.project.sections.dashboard.title"),
          t("tour.project.sections.dashboard.description"),
          "bottom"
        ),
        buildStep(
          "dashboard-summary",
          t("tour.project.dashboardSummary.title"),
          t("tour.project.dashboardSummary.description"),
          "bottom"
        ),
        buildStep(
          "dashboard-goals",
          t("tour.project.dashboardGoals.title"),
          t("tour.project.dashboardGoals.description"),
          "top"
        ),
        buildStep(
          "dashboard-progress",
          t("tour.project.dashboardProgress.title"),
          t("tour.project.dashboardProgress.description"),
          "top"
        ),
        buildStep(
          "dashboard-activity",
          t("tour.project.dashboardActivity.title"),
          t("tour.project.dashboardActivity.description"),
          "top"
        ),
        buildStep(
          "dashboard-quick-actions",
          t("tour.project.quickActions.title"),
          t("tour.project.quickActions.description"),
          "top"
        ),
        buildStep(
          "dashboard-streak",
          t("tour.project.writingStreak.title"),
          t("tour.project.writingStreak.description"),
          "top"
        ),
      ],
      t
    );
  }

  const pageSteps: Record<ProjectSection, PapyrusDriveStep[]> = {
    characters: getCardListPageSteps("characters", t),
    chapters: getChapterPageSteps(t),
    dashboard: [],
    export: getExportPageSteps(t),
    goals: getGoalsPageSteps(t),
    mindMaps: getMindMapPageSteps(t),
    notes: getCardListPageSteps("notes", t),
    objects: getCardListPageSteps("objects", t),
    places: getCardListPageSteps("places", t),
    research: getResearchPageSteps(t),
    settings: getSettingsPageSteps(t),
    structure: getStructurePageSteps(t),
    timeline: getTimelinePageSteps(t),
  };

  return withReplay(
    [
      buildStep(
        getNavigationTarget(section),
        t(`tour.project.sections.${section}.title`),
        t(`tour.project.sections.${section}.description`),
        "right"
      ),
      ...pageSteps[section],
    ],
    t
  );
}

function withReplay(steps: PapyrusDriveStep[], t: Translate): PapyrusDriveStep[] {
  return [
    ...steps,
    buildStep(
      "app-tour-button",
      t("tour.project.replay.title"),
      t("tour.project.replay.description"),
      "bottom",
      "end"
    ),
  ];
}

function getCardListPageSteps(section: ProjectSection, t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t(`tour.project.pageParts.${section}.header.title`),
      t(`tour.project.pageParts.${section}.header.description`),
      "bottom"
    ),
    buildStep(
      "page-create-action",
      t(`tour.project.pageParts.${section}.create.title`),
      t(`tour.project.pageParts.${section}.create.description`),
      "bottom",
      "end"
    ),
    buildStep(
      "page-list",
      t(`tour.project.pageParts.${section}.list.title`),
      t(`tour.project.pageParts.${section}.list.description`),
      "right"
    ),
    buildStep(
      "page-detail",
      t(`tour.project.pageParts.${section}.detail.title`),
      t(`tour.project.pageParts.${section}.detail.description`),
      "left"
    ),
  ];
}

function getResearchPageSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t("tour.project.pageParts.research.header.title"),
      t("tour.project.pageParts.research.header.description"),
      "bottom"
    ),
    buildStep(
      "page-create-action",
      t("tour.project.pageParts.research.create.title"),
      t("tour.project.pageParts.research.create.description"),
      "bottom",
      "end"
    ),
    buildStep(
      "page-filters",
      t("tour.project.pageParts.research.filters.title"),
      t("tour.project.pageParts.research.filters.description"),
      "bottom"
    ),
    buildStep(
      "page-list",
      t("tour.project.pageParts.research.list.title"),
      t("tour.project.pageParts.research.list.description"),
      "top"
    ),
  ];
}

function getTimelinePageSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t("tour.project.pageParts.timeline.header.title"),
      t("tour.project.pageParts.timeline.header.description"),
      "bottom"
    ),
    buildStep(
      "page-create-action",
      t("tour.project.pageParts.timeline.create.title"),
      t("tour.project.pageParts.timeline.create.description"),
      "bottom",
      "end"
    ),
    buildStep(
      "timeline-list",
      t("tour.project.pageParts.timeline.list.title"),
      t("tour.project.pageParts.timeline.list.description"),
      "right"
    ),
    buildStep(
      "timeline-detail",
      t("tour.project.pageParts.timeline.detail.title"),
      t("tour.project.pageParts.timeline.detail.description"),
      "left"
    ),
  ];
}

function getChapterPageSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t("tour.project.pageParts.chapters.header.title"),
      t("tour.project.pageParts.chapters.header.description"),
      "bottom"
    ),
    buildStep(
      "chapter-actions",
      t("tour.project.pageParts.chapters.actions.title"),
      t("tour.project.pageParts.chapters.actions.description"),
      "bottom",
      "end"
    ),
    buildStep(
      "chapter-overview",
      t("tour.project.pageParts.chapters.overview.title"),
      t("tour.project.pageParts.chapters.overview.description"),
      "bottom"
    ),
    buildStep(
      "chapter-tree",
      t("tour.project.pageParts.chapters.tree.title"),
      t("tour.project.pageParts.chapters.tree.description"),
      "right"
    ),
    buildStep(
      "chapter-detail",
      t("tour.project.pageParts.chapters.detail.title"),
      t("tour.project.pageParts.chapters.detail.description"),
      "left"
    ),
  ];
}

function getStructurePageSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t("tour.project.pageParts.structure.header.title"),
      t("tour.project.pageParts.structure.header.description"),
      "bottom"
    ),
    buildStep(
      "structure-tabs",
      t("tour.project.pageParts.structure.tabs.title"),
      t("tour.project.pageParts.structure.tabs.description"),
      "bottom"
    ),
    buildStep(
      "structure-content",
      t("tour.project.pageParts.structure.content.title"),
      t("tour.project.pageParts.structure.content.description"),
      "top"
    ),
  ];
}

function getMindMapPageSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t("tour.project.pageParts.mindMaps.header.title"),
      t("tour.project.pageParts.mindMaps.header.description"),
      "bottom"
    ),
    buildStep(
      "mindmap-canvas",
      t("tour.project.pageParts.mindMaps.canvas.title"),
      t("tour.project.pageParts.mindMaps.canvas.description"),
      "bottom"
    ),
    buildStep(
      "mindmap-list",
      t("tour.project.pageParts.mindMaps.list.title"),
      t("tour.project.pageParts.mindMaps.list.description"),
      "top"
    ),
  ];
}

function getGoalsPageSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t("tour.project.pageParts.goals.header.title"),
      t("tour.project.pageParts.goals.header.description"),
      "bottom"
    ),
    buildStep(
      "page-create-action",
      t("tour.project.pageParts.goals.create.title"),
      t("tour.project.pageParts.goals.create.description"),
      "bottom",
      "end"
    ),
    buildStep(
      "goals-stats",
      t("tour.project.pageParts.goals.stats.title"),
      t("tour.project.pageParts.goals.stats.description"),
      "bottom"
    ),
    buildStep(
      "goals-filters",
      t("tour.project.pageParts.goals.filters.title"),
      t("tour.project.pageParts.goals.filters.description"),
      "bottom"
    ),
    buildStep(
      "goals-active",
      t("tour.project.pageParts.goals.active.title"),
      t("tour.project.pageParts.goals.active.description"),
      "top"
    ),
    buildStep(
      "goals-completed",
      t("tour.project.pageParts.goals.completed.title"),
      t("tour.project.pageParts.goals.completed.description"),
      "top"
    ),
  ];
}

function getExportPageSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t("tour.project.pageParts.export.header.title"),
      t("tour.project.pageParts.export.header.description"),
      "bottom"
    ),
    buildStep(
      "export-formats",
      t("tour.project.pageParts.export.formats.title"),
      t("tour.project.pageParts.export.formats.description"),
      "right"
    ),
    buildStep(
      "export-preview",
      t("tour.project.pageParts.export.preview.title"),
      t("tour.project.pageParts.export.preview.description"),
      "left"
    ),
    buildStep(
      "export-options",
      t("tour.project.pageParts.export.options.title"),
      t("tour.project.pageParts.export.options.description"),
      "top"
    ),
  ];
}

function getSettingsPageSteps(t: Translate): PapyrusDriveStep[] {
  return [
    buildStep(
      "page-header",
      t("tour.project.pageParts.settings.header.title"),
      t("tour.project.pageParts.settings.header.description"),
      "bottom"
    ),
    buildStep(
      "settings-actions",
      t("tour.project.pageParts.settings.actions.title"),
      t("tour.project.pageParts.settings.actions.description"),
      "bottom",
      "end"
    ),
    buildStep(
      "settings-tabs",
      t("tour.project.pageParts.settings.tabs.title"),
      t("tour.project.pageParts.settings.tabs.description"),
      "right"
    ),
    buildStep(
      "settings-panel",
      t("tour.project.pageParts.settings.panel.title"),
      t("tour.project.pageParts.settings.panel.description"),
      "left"
    ),
  ];
}

function getProjectSectionSteps(t: Translate): PapyrusDriveStep[] {
  const sections: Array<[string, ProjectSection]> = [
    ["nav-characters", "characters"],
    ["nav-places", "places"],
    ["nav-objects", "objects"],
    ["nav-chapters", "chapters"],
    ["nav-research", "research"],
    ["nav-timeline", "timeline"],
    ["nav-structure", "structure"],
    ["nav-mind-maps", "mindMaps"],
    ["nav-notes", "notes"],
    ["nav-goals", "goals"],
    ["nav-export", "export"],
    ["nav-settings", "settings"],
  ];

  return sections.flatMap(([target, section]) => [
    buildNavigationStep(
      target,
      t(`tour.project.sections.${section}.openTitle`),
      t(`tour.project.sections.${section}.openDescription`),
      section
    ),
    buildStep(
      "page-content",
      t(`tour.project.sections.${section}.title`),
      t(`tour.project.sections.${section}.description`),
      "left"
    ),
  ]);
}

function getNavigationTarget(section: ProjectSection) {
  const targets: Record<ProjectSection, string> = {
    characters: "nav-characters",
    chapters: "nav-chapters",
    dashboard: "nav-dashboard",
    export: "nav-export",
    goals: "nav-goals",
    mindMaps: "nav-mind-maps",
    notes: "nav-notes",
    objects: "nav-objects",
    places: "nav-places",
    research: "nav-research",
    settings: "nav-settings",
    structure: "nav-structure",
    timeline: "nav-timeline",
  };

  return targets[section];
}
