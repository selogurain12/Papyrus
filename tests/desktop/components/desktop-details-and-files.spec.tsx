import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChapterDetail } from "../../../apps/desktop/src/components/chapter/chapter-details";
import { CharacterDetail } from "../../../apps/desktop/src/components/character/character-details";
import { EventDetail } from "../../../apps/desktop/src/components/event/event-details";
import { NoteDetails } from "../../../apps/desktop/src/components/notes/note-details";
import { ObjectDetail } from "../../../apps/desktop/src/components/object/object-details";
import { PlaceDetail } from "../../../apps/desktop/src/components/place/place-details";
import { ResearchCard } from "../../../apps/desktop/src/components/research/research-card";
import {
  chapterFixture,
  characterFixture,
  eventFixture,
  noteFixture,
  objectFixture,
  placeFixture,
  researchFixture,
} from "../support/fixtures";

const openMock = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values?.count !== undefined ? `${key}:${values.count}` : key,
  }),
}));

jest.mock("../../../apps/desktop/src/components/ui/pdf-viewer", () => ({
  PDFViewerModal: ({ isOpen, title }: { isOpen: boolean; title: string }) =>
    isOpen ? <div>PDF:{title}</div> : null,
}));

jest.mock("../../../apps/desktop/src/hooks/use-displayable-file-url", () => ({
  useDisplayableFileUrl: (url: string | null) => ({ displayUrl: url, isPreparing: false }),
}));

describe("desktop details and file viewers", () => {
  beforeEach(() => {
    openMock.mockClear();
    window.open = openMock;
  });

  it("renders domain details for characters, places, objects and events", () => {
    const { rerender } = render(<CharacterDetail character={characterFixture} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("sections.maritalStatus")).toBeInTheDocument();

    rerender(<PlaceDetail place={placeFixture} />);
    expect(screen.getByText("Citadelle Bleue")).toBeInTheDocument();
    expect(screen.getByText(/Tours de verre/u)).toBeInTheDocument();

    rerender(<ObjectDetail object={objectFixture} />);
    expect(screen.getByText("Boussole lunaire")).toBeInTheDocument();
    expect(screen.getByText(/Clé de l'intrigue/u)).toBeInTheDocument();

    rerender(<EventDetail event={eventFixture} />);
    expect(screen.getByText("Rencontre décisive")).toBeInTheDocument();
    expect(screen.getByText("Les héros se rencontrent.")).toBeInTheDocument();
  });

  it("converts chapter lexical content to readable text and exposes chapter actions", async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const onEditor = jest.fn();
    const onDelete = jest.fn();

    render(
      <ChapterDetail
        chapter={chapterFixture}
        onEdit={onEdit}
        onEditor={onEditor}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("Le contenu est lisible.")).toBeInTheDocument();
    expect(screen.queryByText(/"root"/u)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /openEditor/u }));
    await user.click(document.querySelector(".lucide-pencil-line")?.closest("button") as Element);
    await user.click(document.querySelector(".lucide-trash-2")?.closest("button") as Element);

    expect(onEditor).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("opens note PDFs inside the viewer and disables the file action when no file exists", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<NoteDetails note={noteFixture} />);

    await user.click(screen.getByRole("button", { name: "common:openExternal" }));
    expect(screen.getByText("PDF:Note de monde")).toBeInTheDocument();

    rerender(<NoteDetails note={{ ...noteFixture, linkFile: null }} />);
    expect(screen.getByRole("button", { name: "noFile" })).toBeDisabled();
  });

  it("opens note images in the image viewer and other files externally", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <NoteDetails note={{ ...noteFixture, linkFile: "file:///tmp/photo.png" }} />
    );

    await user.click(screen.getByRole("button", { name: "common:openExternal" }));
    expect(screen.getByRole("img", { name: "Note de monde" })).toHaveAttribute(
      "src",
      "file:///tmp/photo.png"
    );

    fireEvent.click(screen.getByText("openExternal").closest("button") as Element);
    expect(openMock).toHaveBeenCalledWith("file:///tmp/photo.png", "_blank", "noopener,noreferrer");

    rerender(<NoteDetails note={{ ...noteFixture, linkFile: "file:///tmp/archive.epub" }} />);
    await user.click(screen.getByRole("button", { name: "common:openExternal" }));
    expect(openMock).toHaveBeenCalledWith(
      "file:///tmp/archive.epub",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("opens research external links and routes PDF files to the embedded viewer", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ResearchCard research={researchFixture} openEditModal={jest.fn()} openDeleteModal={jest.fn()} />
    );

    await user.click(screen.getByRole("button", { name: "common:openExternal" }));
    expect(openMock).toHaveBeenCalledWith(
      "https://example.com/article",
      "_blank",
      "noopener,noreferrer"
    );

    rerender(
      <ResearchCard
        research={{ ...researchFixture, link: "file:///tmp/source.pdf" }}
        openEditModal={jest.fn()}
        openDeleteModal={jest.fn()}
      />
    );
    await user.click(screen.getByRole("button", { name: "common:openExternal" }));
    expect(screen.getByText("PDF:Article utile")).toBeInTheDocument();
  });

  it("supports research image previews, edit/delete actions and empty links", async () => {
    const user = userEvent.setup();
    const openEditModal = jest.fn();
    const openDeleteModal = jest.fn();
    const { rerender } = render(
      <ResearchCard
        research={{ ...researchFixture, type: "images", link: "file:///tmp/source.jpg" }}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />
    );

    await user.click(screen.getByRole("button", { name: "common:openExternal" }));
    expect(screen.getByRole("img", { name: "Article utile" })).toHaveAttribute(
      "src",
      "file:///tmp/source.jpg"
    );

    const actionButtons = document.querySelectorAll("button.p-1");
    fireEvent.click(actionButtons[0]);
    fireEvent.click(actionButtons[1]);
    expect(openEditModal).toHaveBeenCalledWith(expect.objectContaining({ id: "research-1" }));
    expect(openDeleteModal).toHaveBeenCalledWith(expect.objectContaining({ id: "research-1" }));

    rerender(
      <ResearchCard
        research={{ ...researchFixture, link: null }}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />
    );
    expect(screen.getByRole("button", { name: "noFile" })).toBeDisabled();
  });
});
