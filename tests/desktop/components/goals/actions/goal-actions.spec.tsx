import type { GoalDto, ProjectDto } from "@papyrus/source";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { CreateGoalForm } from "../../../../../apps/desktop/src/components/goals/actions/create-goal";
import { GoalDeleteActions } from "../../../../../apps/desktop/src/components/goals/actions/delete-goal";
import { UpdateGoalForm } from "../../../../../apps/desktop/src/components/goals/actions/update-goal";

const mockCreateMutate = jest.fn();
const mockUpdateMutate = jest.fn();
const mockDeleteMutate = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockCreateOfflineEntity = jest.fn();
const mockUpdateOfflineEntity = jest.fn();
const mockDeleteOfflineEntity = jest.fn();
const mockSetOpen = jest.fn();
const mockOnClose = jest.fn();
let mockCreateMutationConfig: { onSuccess?: () => void; onError?: (error: unknown) => void };
let mockUpdateMutationConfig: { onSuccess?: () => void; onError?: (error: unknown) => void };
let mockDeleteMutationConfig: { onSuccess?: () => void; onError?: (error: unknown) => void };

let mockIsOnline = true;
let mockCurrentProject: ProjectDto | null = null;

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, string>) =>
      values?.title ? `${key}:${values.title}` : key,
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@ts-rest/react-query/v5", () => ({
  isFetchError: () => false,
}));

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => async (values: unknown) => ({
    errors: {},
    values,
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: (...args: unknown[]) => mockInvalidateQueries(...args),
  }),
}));

jest.mock("../../../../../apps/desktop/src/context/project-provider", () => ({
  useProject: () => ({
    currentProject: mockCurrentProject,
  }),
}));

jest.mock("../../../../../apps/desktop/src/hooks/use-online-status", () => ({
  useOnlineStatus: () => mockIsOnline,
}));

jest.mock("../../../../../apps/desktop/src/context/query-client", () => ({
  queryClient: {
    invalidateQueries: (...args: unknown[]) => mockInvalidateQueries(...args),
  },
}));

jest.mock("../../../../../apps/desktop/src/utils/client/client", () => ({
  client: {
    goal: {
      create: {
        useMutation: (config: typeof mockCreateMutationConfig) => {
          mockCreateMutationConfig = config;
          return { mutate: (...args: unknown[]) => mockCreateMutate(...args) };
        },
      },
      softDelete: {
        useMutation: (config: typeof mockDeleteMutationConfig) => {
          mockDeleteMutationConfig = config;
          return { mutate: (...args: unknown[]) => mockDeleteMutate(...args) };
        },
      },
      update: {
        useMutation: (config: typeof mockUpdateMutationConfig) => {
          mockUpdateMutationConfig = config;
          return { mutate: (...args: unknown[]) => mockUpdateMutate(...args) };
        },
      },
    },
  },
}));

jest.mock("../../../../../apps/desktop/src/local-db/offline-entity-store", () => ({
  createOfflineEntity: (...args: unknown[]) => mockCreateOfflineEntity(...args),
  deleteOfflineEntity: (...args: unknown[]) => mockDeleteOfflineEntity(...args),
  updateOfflineEntity: (...args: unknown[]) => mockUpdateOfflineEntity(...args),
}));

jest.mock("../../../../../apps/desktop/src/components/ui/dialogs/dialog-content", () => ({
  DialogContent: ({
    children,
    onClose,
    onInteractOutside,
  }: {
    children: React.ReactNode;
    onClose?: () => void;
    onInteractOutside?: (event: { preventDefault: () => void }) => void;
  }) => (
    <section>
      {children}
      <button onClick={() => onInteractOutside?.({ preventDefault: jest.fn() })} type="button">
        outside
      </button>
      <button onClick={onClose} type="button">
        close
      </button>
    </section>
  ),
}));

jest.mock("../../../../../apps/desktop/src/components/ui/dialogs/dialog-header", () => ({
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("../../../../../apps/desktop/src/components/ui/dialogs/dialog-title", () => ({
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

jest.mock("../../../../../apps/desktop/src/components/ui/date-picker", () => ({
  DatePicker: ({ changeValue, placeholder }: { changeValue: (value: string) => void; placeholder: string }) => (
    <button
      onClick={() => changeValue("2026-07-14T23:59:00[Europe/Paris]")}
      type="button"
    >
      {placeholder}
    </button>
  ),
}));

jest.mock("../../../../../apps/desktop/src/components/ui/single-select", () => ({
  SingleSelector: ({
    data,
    onChange,
    value,
  }: {
    data: Array<{ id: string; name?: string }>;
    onChange?: (value: { id: string; name?: string } | undefined) => void;
    value?: { id: string };
  }) => (
    <select
      aria-label="unit-selector"
      onChange={(event) => onChange?.(data.find((item) => item.id === event.target.value))}
      value={value?.id ?? ""}
    >
      {data.map((item) => (
        <option key={item.id} value={item.id}>
          {item.id}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("../../../../../apps/desktop/src/components/ui/alert-dialog/alert-dialog", () => ({
  AlertDialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div>{children}</div> : null,
}));

jest.mock("../../../../../apps/desktop/src/components/ui/alert-dialog/alert-dialog-content", () => ({
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
}));

jest.mock("../../../../../apps/desktop/src/components/ui/alert-dialog/alert-dialog-header", () => ({
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("../../../../../apps/desktop/src/components/ui/alert-dialog/alert-dialog-title", () => ({
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

jest.mock("../../../../../apps/desktop/src/components/ui/alert-dialog/alert-dialog-description", () => ({
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

jest.mock("../../../../../apps/desktop/src/components/ui/alert-dialog/alert-dialog-footer", () => ({
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("../../../../../apps/desktop/src/components/ui/alert-dialog/motion/cancel-wrapper.motion", () => ({
  MotionAlertDialogCancelWrapper: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} type="button">
      cancel
    </button>
  ),
}));

jest.mock("../../../../../apps/desktop/src/components/ui/alert-dialog/motion/action-wrapper.motion", () => ({
  MotionAlertDialogActionWrapper: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} type="button">
      Confirmer
    </button>
  ),
}));

const project = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Papyrus",
  description: null,
  genre: "Fantasy",
  author: "Lora",
  language: "fr",
  deadline: null,
  targetWordCount: 100000,
  currentWordCount: 0,
  status: "writing",
  tags: [],
  user: {
    id: "22222222-2222-4222-8222-222222222222",
    firstName: "Lora",
    lastName: "Seguin",
    email: "lora@example.com",
    password: "secret123",
    createdAt: new Date("2026-07-14T00:00:00.000Z"),
  },
  settings: {
    id: "33333333-3333-4333-8333-333333333333",
    language: "fr",
    autoSave: true,
    autoSaveInterval: 5,
    dailyWordCountGoal: 1000,
    theme: "light",
    compactMode: false,
    fontSize: "medium",
    fontFamily: "system",
    showLineNumbers: false,
    focusMode: true,
    spellcheck: true,
    shortcuts: [],
    enableNotifications: true,
    dailyReminder: true,
    goalReminder: true,
    backupReminder: true,
    enableAutoBackup: true,
    backupFrequency: "daily",
    exportFormat: "json",
    showStatistics: true,
    trackWritingTime: true,
    saveHistory: true,
  },
  structure: {
    id: "44444444-4444-4444-8444-444444444444",
    premise: null,
    genre: null,
    theme: null,
    structure: null,
    objectives: null,
  },
} as ProjectDto;

const goal = {
  id: "55555555-5555-4555-8555-555555555555",
  type: "weekly",
  title: "Ancien objectif",
  goals: 500,
  unit: "words",
  deadline: null,
  description: "Ancienne description",
  status: "warning",
  project,
  isOpen: true,
  current: 10,
} as GoalDto;

describe("goal action forms", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentProject = project;
    mockIsOnline = true;
    mockCreateOfflineEntity.mockResolvedValue(goal);
    mockUpdateOfflineEntity.mockResolvedValue(goal);
    mockDeleteOfflineEntity.mockResolvedValue(undefined);
    mockInvalidateQueries.mockResolvedValue(undefined);
    mockCreateMutationConfig = {};
    mockUpdateMutationConfig = {};
    mockDeleteMutationConfig = {};
  });

  it("creates a goal online from the create form", async () => {
    const user = userEvent.setup();

    render(<CreateGoalForm setOpen={mockSetOpen} />);

    await user.click(screen.getByLabelText("types.daily"));
    await user.type(screen.getByLabelText("fields.title"), "Objectif quotidien");
    await user.clear(screen.getByLabelText("fields.goals"));
    await user.type(screen.getByLabelText("fields.goals"), "800");
    await user.type(screen.getByLabelText("fields.description"), "Ecrire tous les jours");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledWith({
        body: expect.objectContaining({
          current: 0,
          description: "Ecrire tous les jours",
          goals: 800,
          isOpen: true,
          title: "Objectif quotidien",
          type: "daily",
          unit: "words",
        }),
        params: { projectId: project.id },
      });
    });
  });

  it("creates a non daily goal with a deadline", async () => {
    const user = userEvent.setup();

    render(<CreateGoalForm setOpen={mockSetOpen} />);

    await user.click(screen.getByLabelText("types.weekly"));
    await user.click(screen.getByRole("button", { name: "fields.deadline" }));
    await user.type(screen.getByLabelText("fields.title"), "Objectif semaine");
    await user.clear(screen.getByLabelText("fields.goals"));
    await user.type(screen.getByLabelText("fields.goals"), "1200");
    await user.type(screen.getByLabelText("fields.description"), "Avec deadline");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledWith({
        body: expect.objectContaining({
          deadline: "2026-07-14T23:59:00[Europe/Paris]",
          type: "weekly",
        }),
        params: { projectId: project.id },
      });
    });
  });

  it("handles create success and missing project states", async () => {
    const user = userEvent.setup();
    render(<CreateGoalForm setOpen={mockSetOpen} />);

    act(() => {
      mockCreateMutationConfig.onSuccess?.();
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["goal.getAll"] });
    expect(mockSetOpen).toHaveBeenCalledWith(false);

    await user.click(screen.getByRole("button", { name: "close" }));
    expect(mockSetOpen).toHaveBeenCalledWith(false);
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(mockSetOpen).toHaveBeenCalledWith(false);

    mockCreateMutationConfig.onError?.({});
    expect(toast.error).toHaveBeenCalledWith("toast.error");
  });

  it("does not render the create form without a project", () => {
    mockCurrentProject = null;
    render(<CreateGoalForm setOpen={mockSetOpen} />);

    expect(screen.queryByText("title")).not.toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("toast.projectNotSelected");
  });

  it("creates a goal locally when offline and closes the dialog", async () => {
    const user = userEvent.setup();
    mockIsOnline = false;

    render(<CreateGoalForm setOpen={mockSetOpen} />);

    await user.click(screen.getByLabelText("types.daily"));
    await user.type(screen.getByLabelText("fields.title"), "Objectif hors ligne");
    await user.clear(screen.getByLabelText("fields.goals"));
    await user.type(screen.getByLabelText("fields.goals"), "300");
    await user.type(screen.getByLabelText("fields.description"), "Disponible hors ligne");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(mockCreateOfflineEntity).toHaveBeenCalledWith(
        "goals",
        project.id,
        expect.objectContaining({
          goals: 300,
          title: "Objectif hors ligne",
        })
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  it("shows existing values and updates a goal online", async () => {
    const user = userEvent.setup();

    render(<UpdateGoalForm goal={goal} setOpen={mockSetOpen} />);

    expect(screen.getByLabelText("fields.title")).toHaveValue("Ancien objectif");
    expect(screen.getByLabelText("fields.goals")).toHaveValue(500);

    await user.clear(screen.getByLabelText("fields.title"));
    await user.type(screen.getByLabelText("fields.title"), "Nouvel objectif");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledWith({
        body: expect.objectContaining({
          title: "Nouvel objectif",
        }),
        params: { id: goal.id, projectId: project.id },
      });
    });
  });

  it("handles update success and missing project states", () => {
    render(<UpdateGoalForm goal={goal} setOpen={mockSetOpen} />);

    act(() => {
      mockUpdateMutationConfig.onSuccess?.();
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["goal.getAll"] });
    expect(mockSetOpen).toHaveBeenCalledWith(false);
    mockUpdateMutationConfig.onError?.({});
    expect(toast.error).toHaveBeenCalledWith("toast.error");
  });

  it("does not render the update form without a project", () => {
    mockCurrentProject = null;
    render(<UpdateGoalForm goal={goal} setOpen={mockSetOpen} />);

    expect(screen.queryByDisplayValue("Ancien objectif")).not.toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("toast.projectNotSelected");
  });

  it("updates a goal locally when offline", async () => {
    const user = userEvent.setup();
    mockIsOnline = false;

    render(<UpdateGoalForm goal={goal} setOpen={mockSetOpen} />);

    await user.clear(screen.getByLabelText("fields.goals"));
    await user.type(screen.getByLabelText("fields.goals"), "900");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(mockUpdateOfflineEntity).toHaveBeenCalledWith(
        "goals",
        project.id,
        goal,
        expect.objectContaining({ goals: 900 })
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  it("deletes a goal online after confirmation", async () => {
    const user = userEvent.setup();

    render(
      <GoalDeleteActions goal={goal} onClose={mockOnClose} open={true} setOpen={mockSetOpen} />
    );

    expect(screen.getByText("description:Ancien objectif")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirmer" }));

    expect(mockDeleteMutate).toHaveBeenCalledWith({
      params: { id: goal.id, projectId: project.id },
    });

    act(() => {
      mockDeleteMutationConfig.onSuccess?.();
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["goal.getAll"] });
    expect(mockOnClose).toHaveBeenCalled();
    mockDeleteMutationConfig.onError?.({});
    expect(toast.error).toHaveBeenCalledWith("toast.error");
  });

  it("deletes a goal locally when offline", async () => {
    const user = userEvent.setup();
    mockIsOnline = false;

    render(
      <GoalDeleteActions goal={goal} onClose={mockOnClose} open={true} setOpen={mockSetOpen} />
    );

    await user.click(screen.getByRole("button", { name: "Confirmer" }));

    await waitFor(() => {
      expect(mockDeleteOfflineEntity).toHaveBeenCalledWith("goals", goal.id);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("closes or hides the delete dialog without deleting", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <GoalDeleteActions goal={goal} onClose={mockOnClose} open={true} setOpen={mockSetOpen} />
    );

    await user.click(screen.getByRole("button", { name: "cancel" }));

    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(mockDeleteMutate).not.toHaveBeenCalled();

    rerender(
      <GoalDeleteActions goal={goal} onClose={mockOnClose} open={false} setOpen={mockSetOpen} />
    );

    expect(screen.queryByText("description:Ancien objectif")).not.toBeInTheDocument();
  });

  it("does not render the delete dialog without a project", () => {
    mockCurrentProject = null;

    render(
      <GoalDeleteActions goal={goal} onClose={mockOnClose} open={true} setOpen={mockSetOpen} />
    );

    expect(screen.queryByText("description:Ancien objectif")).not.toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("toast.projectNotSelected");
  });
});
