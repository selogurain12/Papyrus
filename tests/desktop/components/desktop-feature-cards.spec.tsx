import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterCard } from "../../../apps/desktop/src/components/character/character-card";
import { PlaceCard } from "../../../apps/desktop/src/components/place/place-card";
import { ObjectCard } from "../../../apps/desktop/src/components/object/object-card";
import { NoteCard } from "../../../apps/desktop/src/components/notes/note-card";
import { ProjectCard } from "../../../apps/desktop/src/components/project/project-card";
import {
  characterFixture,
  noteFixture,
  objectFixture,
  placeFixture,
  projectFixture,
} from "../support/fixtures";

const navigateMock = jest.fn(() => Promise.resolve());
const setCurrentProjectMock = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values?.count !== undefined ? `${key}:${values.count}` : key,
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

describe("desktop feature cards", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    setCurrentProjectMock.mockClear();
  });

  it("selects, edits and deletes a character from the card", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <CharacterCard
        character={characterFixture}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByText("Ada Lovelace"));
    expect(onSelect).toHaveBeenCalledWith(characterFixture);

    await user.click(document.querySelector(".lucide-pencil-line") as Element);
    await user.click(document.querySelector(".lucide-trash-2") as Element);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("selects places and objects without triggering selection from action buttons", async () => {
    const user = userEvent.setup();
    const onPlaceSelect = jest.fn();
    const onObjectSelect = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const { rerender } = render(
      <PlaceCard
        place={placeFixture}
        onSelect={onPlaceSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByText("Citadelle Bleue"));
    expect(onPlaceSelect).toHaveBeenCalledWith(placeFixture);

    await user.click(document.querySelector(".lucide-pencil-line") as Element);
    expect(onEdit).toHaveBeenCalledTimes(1);

    rerender(
      <ObjectCard
        object={objectFixture}
        onSelect={onObjectSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByText("Boussole lunaire"));
    expect(onObjectSelect).toHaveBeenCalledWith(objectFixture);

    await user.click(document.querySelector(".lucide-trash-2") as Element);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("selects notes and renders their tags", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    render(<NoteCard note={noteFixture} onSelect={onSelect} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText("monde")).toBeInTheDocument();
    await user.click(screen.getByText("Note de monde"));
    expect(onSelect).toHaveBeenCalledWith(noteFixture);
  });

  it("opens a project and stores it as the current project", async () => {
    const user = userEvent.setup();

    render(<ProjectCard project={projectFixture} onEdit={jest.fn()} onDelete={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: "card.open" }));
    expect(setCurrentProjectMock).toHaveBeenCalledWith(projectFixture);
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/project/$name",
      params: { name: "Projet test" },
    });
  });
});
