import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@tanstack/react-router", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../../apps/desktop/src/context/auth-provider", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../../apps/desktop/src/context/project-provider", () => ({
  useProject: jest.fn(),
}));

jest.mock("../../../../apps/desktop/src/context/query-client", () => ({
  queryClient: {
    clear: jest.fn(),
  },
}));

jest.mock("../../../../apps/desktop/src/routes/authentification/index.route", () => ({
  loginRoute: { to: "/login" },
}));

import { useNavigate } from "@tanstack/react-router";
import { LogoutButton } from "../../../../apps/desktop/src/components/authentification/logout-button";
import { useAuth } from "../../../../apps/desktop/src/context/auth-provider";
import { useProject } from "../../../../apps/desktop/src/context/project-provider";
import { queryClient } from "../../../../apps/desktop/src/context/query-client";

const mockClearAuth = jest.fn();
const mockNavigate = jest.fn(() => Promise.resolve());
const mockSetCurrentProject = jest.fn();
const mockUseAuth = jest.mocked(useAuth);
const mockUseNavigate = jest.mocked(useNavigate);
const mockUseProject = jest.mocked(useProject);
const mockQueryClientClear = jest.mocked(queryClient.clear);

describe("LogoutButton", () => {
  beforeEach(() => {
    mockClearAuth.mockReset();
    mockClearAuth.mockResolvedValue(undefined);
    mockQueryClientClear.mockClear();
    mockNavigate.mockClear();
    mockSetCurrentProject.mockClear();
    mockUseAuth.mockReturnValue({
      clearAuth: mockClearAuth,
      loading: false,
      setToken: jest.fn(),
      setUser: jest.fn(),
      token: "token",
      user: null,
    });
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseProject.mockReturnValue({
      currentProject: null,
      setCurrentProject: mockSetCurrentProject,
    });
  });

  it("clears session data and redirects to the login route", async () => {
    const user = userEvent.setup();

    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: "logout" }));

    await waitFor(() => expect(mockClearAuth).toHaveBeenCalledTimes(1));
    expect(mockSetCurrentProject).toHaveBeenCalledWith(null);
    expect(mockQueryClientClear).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
  });

  it("hides the label when requested and disables itself while logging out", async () => {
    const user = userEvent.setup();
    let resolveLogout: (() => void) | undefined;
    mockClearAuth.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveLogout = resolve;
      })
    );

    render(<LogoutButton showLabel={false} />);

    const button = screen.getByRole("button", { name: "logout" });

    expect(button).toHaveTextContent("");

    await user.click(button);

    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();

    await user.click(button);
    expect(mockClearAuth).toHaveBeenCalledTimes(1);

    resolveLogout?.();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" }));
  });
});
