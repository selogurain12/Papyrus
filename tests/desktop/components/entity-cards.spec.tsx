import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterCard } from "../../../apps/desktop/src/components/character/character-card";
import { ObjectCard } from "../../../apps/desktop/src/components/object/object-card";
import { PlaceCard } from "../../../apps/desktop/src/components/place/place-card";
import { ProjectCard } from "../../../apps/desktop/src/components/project/project-card";
import {
  characterFixture,
  objectFixture,
  placeFixture,
  projectFixture,
} from "../support/fixtures";

const navigateMock = jest.fn(() => Promise.resolve());
const setCurrentProjectMock = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values?.count !== undefined
        ? `${key}:${values.count}`
        : values?.importance
          ? `${key}:${values.importance}`
          : key,
  }),
}));

jest.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

jest.mock("../../../apps/desktop/src/context/project-provider", () => ({
  useProject: () => ({ setCurrentProject: setCurrentProjectMock }),
}));

jest.mock("../../../apps/desktop/src/routes/project/index.route", () => ({
  projectHomeRoute: { to: "/project/$name" },
}));

describe("entity cards", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    setCurrentProjectMock.mockClear();
  });

  it("renders project cover and status variants and opens the selected project", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ProjectCard
        project={{ ...projectFixture, coverLink: "https://example.com/cover.jpg", status: "planning" }}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(screen.getByRole("img", { name: "card.coverAlt" })).toHaveAttribute(
      "src",
      "https://example.com/cover.jpg"
    );
    expect(screen.getByText("common:status.planning")).toBeInTheDocument();

    rerender(<ProjectCard project={{ ...projectFixture, status: "editing" }} onDelete={jest.fn()} onEdit={jest.fn()} />);
    expect(screen.getByText("common:status.editing")).toBeInTheDocument();

    rerender(
      <ProjectCard project={{ ...projectFixture, status: "completed" }} onDelete={jest.fn()} onEdit={jest.fn()} />
    );
    expect(screen.getByText("common:status.completed")).toBeInTheDocument();

    rerender(
      <ProjectCard
        project={{ ...projectFixture, status: undefined, targetWordCount: undefined }}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
      />
    );
    await user.click(screen.getByRole("button", { name: "card.open" }));

    expect(setCurrentProjectMock).toHaveBeenCalledWith(expect.objectContaining({ id: "project-1" }));
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/project/$name",
      params: { name: "Projet test" },
    });
  });

  it("renders character avatar fallback and image variants", () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <CharacterCard
        character={{ ...characterFixture, avatarLink: null, color: undefined }}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText("Ada Lovelace"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "character-1" }));

    rerender(
      <CharacterCard
        character={{ ...characterFixture, avatarLink: "file:///avatar.png", role: "inventor" }}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveAttribute(
      "src",
      "file:///avatar.png"
    );
    expect(screen.getByText("roles.inventor")).toBeInTheDocument();
  });

  it("renders object and place card variants and keeps action clicks local", () => {
    const onSelect = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const { rerender } = render(
      <ObjectCard
        object={{
          ...objectFixture,
          avatarLink: "file:///object.png",
          color: undefined,
          importance: "unknown",
        }}
        onDelete={onDelete}
        onEdit={onEdit}
        onSelect={onSelect}
      />
    );

    expect(screen.getByRole("img", { name: "Boussole lunaire" })).toHaveAttribute(
      "src",
      "file:///object.png"
    );
    expect(screen.getByText("labels.importance:importance.unknown")).toBeInTheDocument();

    fireEvent.click(document.querySelector(".lucide-pencil-line") as Element);
    fireEvent.click(document.querySelector(".lucide-trash-2") as Element);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    rerender(
      <PlaceCard
        place={{
          ...placeFixture,
          avatarLink: "file:///place.png",
          color: undefined,
          narrativeImportance: "unknown",
          type: ["city", "castle"],
        }}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSelect={onSelect}
      />
    );

    expect(screen.getByRole("img", { name: "Citadelle Bleue" })).toHaveAttribute(
      "src",
      "file:///place.png"
    );
    expect(screen.getByText("types.city • types.castle")).toBeInTheDocument();
  });
});
