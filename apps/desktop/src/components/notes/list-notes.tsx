import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { NoteDto, queryKeys } from "@papyrus/source";
import { Dialog } from "../ui/dialogs/dialog";
import { CreateNoteForm } from "./actions/create-note";
import { UpdateNoteForm } from "./actions/update-note";
import { NoteDeleteActions } from "./actions/delete-note";
import { client } from "../../utils/client/client";
import { useFilterDto } from "../../utils/filters/use-filter-dto";
import { useProject } from "../../context/project-provider";
import { NoteCard } from "./note-card";
import NoteDetails from "./note-details";
import { useTranslation } from "react-i18next";
import {
  openCreateNoteEvent,
  openDeleteSelectedNoteEvent,
  openEditSelectedNoteEvent,
} from "../../utils/shortcut-events";
import { useOfflineList } from "../../hooks/use-offline-list";

// eslint-disable-next-line complexity
export function NotesList() {
  const { t } = useTranslation("notes/list-notes");
  const [notesSelected, setNotesSelected] = useState<NoteDto | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentProject } = useProject();
  const { options } = useFilterDto({
    itemsPerPage: 20,
    page: 1,
    orderBy: { createdAt: "desc" },
  });

  const { data } = client.note.getAll.useQuery({
    queryKey: queryKeys.note.getAll({
      pathParams: { projectId: currentProject?.id || "" },
      query: { ...options },
    }),
    queryData: {
      params: { projectId: currentProject?.id || "" },
      query: { ...options },
    },
  });
  const notes = useOfflineList({
    entityType: "notes",
    projectId: currentProject?.id,
    onlineData: data?.body,
    search: options.search,
  });

  useEffect(() => {
    function handleOpenCreateNote() {
      setIsCreating(true);
      setIsUpdating(false);
      setNotesSelected(undefined);
    }

    window.addEventListener(openCreateNoteEvent, handleOpenCreateNote);

    return () => {
      window.removeEventListener(openCreateNoteEvent, handleOpenCreateNote);
    };
  }, []);

  useEffect(() => {
    function handleOpenEditSelectedNote() {
      if (notesSelected) {
        setIsCreating(false);
        setIsUpdating(true);
      }
    }

    function handleOpenDeleteSelectedNote() {
      if (notesSelected) {
        setIsDeleting(true);
      }
    }

    window.addEventListener(openEditSelectedNoteEvent, handleOpenEditSelectedNote);
    window.addEventListener(openDeleteSelectedNoteEvent, handleOpenDeleteSelectedNote);

    return () => {
      window.removeEventListener(openEditSelectedNoteEvent, handleOpenEditSelectedNote);
      window.removeEventListener(openDeleteSelectedNoteEvent, handleOpenDeleteSelectedNote);
    };
  }, [notesSelected]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="">
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="text-md">{t("subtitle")}</p>
        </div>
        <Button variant="blue" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("new")}
        </Button>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col gap-4 w-1/3">
          {notes?.data.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onSelect={() => {
                setNotesSelected(note);
                setIsCreating(false);
              }}
              onEdit={() => {
                setNotesSelected(note);
                setIsUpdating(true);
              }}
              onDelete={() => {
                setNotesSelected(note);
                setIsDeleting(true);
              }}
            />
          ))}
        </div>
        {notesSelected && (
          <div className="flex-1 ml-6">
            <NoteDetails note={notesSelected} />
          </div>
        )}

        {isCreating && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <CreateNoteForm setOpen={setIsCreating} />
          </Dialog>
        )}
        {isUpdating && notesSelected && (
          <Dialog open={Boolean(isUpdating)} onOpenChange={() => setIsUpdating(false)}>
            <UpdateNoteForm setOpen={() => setIsUpdating(false)} note={notesSelected} />
          </Dialog>
        )}

        {isDeleting && notesSelected && (
          <NoteDeleteActions
            open={Boolean(isDeleting)}
            setOpen={(open) => (open ? null : setIsDeleting(false))}
            note={notesSelected}
            clearSelection={() => setIsDeleting(false)}
          />
        )}
      </div>
    </div>
  );
}
