import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardPage } from "../../../apps/desktop/src/components/dashboard/dashboard-page";
import { ChapterList } from "../../../apps/desktop/src/components/chapter/list-chapter";
import { MindMapPage } from "../../../apps/desktop/src/components/mindmap/mindmap-list";
import { Sidebar } from "../../../apps/desktop/src/components/sidebar";
import { SettingsTabsNotifications } from "../../../apps/desktop/src/components/settings/settings-tabs/settings-tabs-notifications";
import { Tabs } from "../../../apps/desktop/src/components/ui/tabs/tabs";
import { TooltipProvider } from "../../../apps/desktop/src/components/ui/tooltip";
import {
  chapterFixture,
  chapterWithoutPartFixture,
  dashboardFixture,
  mindmapFixture,
  projectFixture,
} from "../support/fixtures";

const navigateMock = jest.fn(() => Promise.resolve());
const useRouterStateMock = jest.fn();
const useOfflineListMock = jest.fn();
let mockCurrentProject: typeof projectFixture | null = projectFixture;
let mockDashboardBody: typeof dashboardFixture | undefined = dashboardFixture;
let mockDashboardLoading = false;
let mockGoalsList: Array<Record<string, unknown>> = [
  {
    id: "goal-1",
    title: "Objectif quotidien",
    current: 250,
    goals: 500,
    isOpen: true,
    deadline: "2026-07-15T23:59:00[Europe/Paris]",
  },
];
let mockHistoryList: Array<Record<string, unknown>> = [
  {
    type: "create",
    entity: "chapter",
    title: "Chapitre ajouté",
    date: "2026-07-14T12:00:00[Europe/Paris]",
  },
];

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values?.projectTitle
        ? `${key}:${values.projectTitle}`
        : values?.count !== undefined
          ? `${key}:${values.count}`
          : key,
  }),
}));

jest.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
  useRouterState: (options: { select: (state: unknown) => string }) => useRouterStateMock(options),
}));

jest.mock("../../../apps/desktop/src/context/project-provider", () => ({
  useProject: () => ({ currentProject: mockCurrentProject, setCurrentProject: jest.fn() }),
}));

jest.mock("../../../apps/desktop/src/context/auth-provider", () => ({
  useAuth: () => ({ clearAuth: jest.fn(), token: "token", user: { id: "user-1" } }),
}));

jest.mock("../../../apps/desktop/src/hooks/use-offline-list", () => ({
  useOfflineList: (options: unknown) => useOfflineListMock(options),
}));

jest.mock("../../../apps/desktop/src/utils/client/client", () => ({
  client: {
    dashboard: {
      get: {
        useQuery: () => ({
          data: mockDashboardBody ? { body: mockDashboardBody } : undefined,
          isLoading: mockDashboardLoading,
        }),
      },
    },
    goal: {
      getAll: {
        useQuery: () => ({
          data: {
            body: {
              data: mockGoalsList,
            },
          },
        }),
      },
    },
    history: {
      getAll: {
        useQuery: () => ({
          data: {
            body: {
              data: mockHistoryList,
            },
          },
        }),
      },
    },
    mindmap: {
      getAll: {
        useQuery: () => ({ data: { body: { data: [mindmapFixture], total: 1 } } }),
      },
    },
  },
}));

jest.mock("../../../apps/desktop/src/utils/filters/use-filter-dto", () => ({
  useFilterDto: () => ({ options: { page: 1, itemsPerPage: 20 } }),
}));

jest.mock("../../../apps/desktop/src/components/mindmap/actions/delete-mindmap", () => ({
  MindMapDeleteActions: () => <div>delete mindmap modal</div>,
}));

jest.mock("../../../apps/desktop/src/routes/character/index.route", () => ({ characterRoute: { to: "/character" } }));
jest.mock("../../../apps/desktop/src/routes/chapter/index.route", () => ({ chapterRoute: { to: "/chapter" } }));
jest.mock("../../../apps/desktop/src/routes/place/index.route", () => ({ placeRoute: { to: "/place" } }));
jest.mock("../../../apps/desktop/src/routes/object/index.route", () => ({ objectRoute: { to: "/object" } }));
jest.mock("../../../apps/desktop/src/routes/event/index.route", () => ({ eventRoute: { to: "/event" } }));
jest.mock("../../../apps/desktop/src/routes/note/index.route", () => ({ noteRoute: { to: "/note" } }));
jest.mock("../../../apps/desktop/src/routes/research/index.route", () => ({ researchRoute: { to: "/research" } }));
jest.mock("../../../apps/desktop/src/routes/structure/index.routes", () => ({ structureRoute: { to: "/structure" } }));
jest.mock("../../../apps/desktop/src/routes/mindmap/index.route", () => ({
  mindmapRoute: { to: "/mindmap" },
  createMindmapRoute: { to: "/mindmap/create" },
  updateMindmapRoute: { to: "/mindmap/$id/update" },
  viewMindmapRoute: { to: "/mindmap/$id" },
}));
jest.mock("../../../apps/desktop/src/routes/export/index.route", () => ({ exportRoute: { to: "/export" } }));
jest.mock("../../../apps/desktop/src/routes/settings/index.route", () => ({ settingsRoute: { to: "/settings" } }));
jest.mock("../../../apps/desktop/src/routes/dashboard/index.route", () => ({ dashboardRoute: { to: "/dashboard" } }));
jest.mock("../../../apps/desktop/src/routes/goals/index.route", () => ({ goalsRoute: { to: "/goals" } }));
jest.mock("../../../apps/desktop/src/routes/index.routes", () => ({ indexRoute: { to: "/" } }));
jest.mock("../../../apps/desktop/src/routes/authentification/index.route", () => ({
  loginRoute: { to: "/login" },
  registerRoute: { to: "/register" },
}));

describe("desktop pages and navigation", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    useOfflineListMock.mockReset();
    mockCurrentProject = projectFixture;
    mockDashboardBody = dashboardFixture;
    mockDashboardLoading = false;
    mockGoalsList = [
      {
        id: "goal-1",
        title: "Objectif quotidien",
        current: 250,
        goals: 500,
        isOpen: true,
        deadline: "2026-07-15T23:59:00[Europe/Paris]",
      },
    ];
    mockHistoryList = [
      {
        type: "create",
        entity: "chapter",
        title: "Chapitre ajouté",
        date: "2026-07-14T12:00:00[Europe/Paris]",
      },
    ];
    useRouterStateMock.mockImplementation((options) =>
      options.select({ location: { pathname: "/project/Projet%20test/chapter" } })
    );
  });

  it("shows dashboard fallback states for missing, loading and empty data", () => {
    mockCurrentProject = null;
    const { rerender } = render(<DashboardPage />);

    expect(screen.getByText("currentProjectMissing")).toBeInTheDocument();

    mockCurrentProject = projectFixture;
    mockDashboardBody = undefined;
    mockDashboardLoading = true;
    rerender(<DashboardPage />);

    expect(document.querySelectorAll(".bg-muted\\/40")).toHaveLength(4);

    mockDashboardLoading = false;
    mockDashboardBody = {
      summaryCards: [
        { label: "Label inconnu", value: 1, change: "stable", icon: "bookOpen", color: "blue" },
      ],
      progress: [{ label: "Progression inconnue", value: 120, target: 100, color: "green" }],
      writingStreak: {
        days: 0,
        progress: 0,
        currentWordCount: 0,
        targetWordCount: 1000,
      },
    } as typeof dashboardFixture;
    mockGoalsList = [
      {
        id: "goal-closed",
        title: "Objectif fermé",
        current: 0,
        goals: 100,
        isOpen: false,
        deadline: null,
      },
    ];
    mockHistoryList = [];
    rerender(<DashboardPage />);

    expect(screen.getByText("emptyGoals")).toBeInTheDocument();
    expect(screen.getByText("emptyActivity")).toBeInTheDocument();
    expect(screen.getByText("streakInactive")).toBeInTheDocument();
    expect(screen.getByText("Progression inconnue")).toBeInTheDocument();
  });

  it("shows dashboard stats and opens quick-create actions after navigation", async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("4500")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /quickActions.newCharacter/u }));
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/character",
        params: { name: "Projet test" },
      })
    );
  });

  it("lists chapters by part and keeps chapters without part in their own section", async () => {
    const user = userEvent.setup();
    const setSelectedChapter = jest.fn();
    useOfflineListMock.mockReturnValue({
      data: [chapterFixture, chapterWithoutPartFixture],
      total: 2,
    });

    const { rerender } = render(
      <ChapterList id="part-1" setSelectedChapter={setSelectedChapter} />
    );
    expect(screen.getByText("Chapitre visible")).toBeInTheDocument();
    expect(screen.queryByText("Chapitre sans partie")).not.toBeInTheDocument();

    await user.click(screen.getByText("Chapitre visible"));
    expect(setSelectedChapter).toHaveBeenCalledWith(chapterFixture);

    rerender(<ChapterList withoutPart setSelectedChapter={setSelectedChapter} />);
    expect(screen.getByText("Chapitre sans partie")).toBeInTheDocument();
    expect(screen.queryByText("Chapitre visible")).not.toBeInTheDocument();
  });

  it("shows offline mindmaps and navigates to create/view/update pages", async () => {
    const user = userEvent.setup();
    useOfflineListMock.mockReturnValue({ data: [mindmapFixture], total: 1 });

    render(<MindMapPage />);

    expect(screen.getByText("Carte personnages")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /createNew/u }));
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/mindmap/create",
      params: { name: "Projet test" },
    });

    await user.click(screen.getByRole("button", { name: "common:openExternal" }));
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/mindmap/$id",
      params: { name: "Projet test", id: "mindmap-1" },
    });

    await user.click(document.querySelector(".lucide-pencil")?.closest("button") as Element);
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/mindmap/$id/update",
      params: { name: "Projet test", id: "mindmap-1" },
    });

    await user.click(document.querySelector(".lucide-trash-2")?.closest("button") as Element);
    expect(screen.getByText("delete mindmap modal")).toBeInTheDocument();
  });

  it("marks the current sidebar section from the route instead of always dashboard", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Sidebar name="Projet test" />
      </TooltipProvider>
    );

    const chapterButton = screen.getByRole("button", { name: "menu.chapters" });
    const dashboardButton = screen.getByRole("button", { name: "menu.dashboard" });

    expect(chapterButton.className).toContain("bg-blue-50");
    expect(dashboardButton.className).not.toContain("bg-blue-50");

    await user.click(screen.getByRole("button", { name: "menu.settings" }));
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/settings",
      params: { name: "Projet test" },
    });
  });

  it("updates notification preferences from settings", async () => {
    const user = userEvent.setup();
    const updateSetting = jest.fn();

    render(
      <Tabs defaultValue="notifications">
        <SettingsTabsNotifications
          setting={{
            ...projectFixture.settings,
            enableNotifications: false,
            dailyReminder: true,
            goalReminder: true,
            backupReminder: true,
          }}
          updateSetting={updateSetting}
        />
      </Tabs>
    );

    await user.click(screen.getAllByRole("switch")[1]);
    expect(updateSetting).toHaveBeenCalledWith("dailyReminder", false);
  });

  it("handles unsupported and granted notification permissions", async () => {
    const user = userEvent.setup();
    const updateSetting = jest.fn();
    const originalNotification = window.Notification;

    Reflect.deleteProperty(window, "Notification");
    const { rerender } = render(
      <Tabs defaultValue="notifications">
        <SettingsTabsNotifications
          setting={{ ...projectFixture.settings, enableNotifications: false }}
          updateSetting={updateSetting}
        />
      </Tabs>
    );

    await user.click(screen.getAllByRole("switch")[0]);
    expect(updateSetting).toHaveBeenCalledWith("enableNotifications", false);

    Object.defineProperty(window, "Notification", {
      configurable: true,
      value: {
        permission: "granted",
        requestPermission: jest.fn(),
      },
    });

    rerender(
      <Tabs defaultValue="notifications">
        <SettingsTabsNotifications
          setting={{ ...projectFixture.settings, enableNotifications: false }}
          updateSetting={updateSetting}
        />
      </Tabs>
    );
    await user.click(screen.getAllByRole("switch")[0]);
    expect(updateSetting).toHaveBeenCalledWith("enableNotifications", true);

    Object.defineProperty(window, "Notification", {
      configurable: true,
      value: originalNotification,
    });
  });
});
