/* eslint-disable no-nested-ternary */
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { EventDetail } from "./event-details";
import { CreateEvent } from "./actions/create-event";
import { useEffect, useState } from "react";
import { EventDto } from "@papyrus/source";
import { UpdateEvent } from "./actions/update-event";
import { EventDeleteActions } from "./actions/delete-event";
import { EventTimeline } from "./event-timeline";
import { useTranslation } from "react-i18next";
import {
  openCreateEventEvent,
  openDeleteSelectedEventEvent,
  openEditSelectedEventEvent,
} from "../../utils/shortcut-events";

export function EventsList() {
  const { t } = useTranslation("event/list-event");
  const [eventSelected, setEventSelected] = useState<EventDto | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function handleOpenCreateEvent() {
      setIsCreating(true);
      setIsUpdating(false);
      setEventSelected(undefined);
    }

    window.addEventListener(openCreateEventEvent, handleOpenCreateEvent);

    return () => {
      window.removeEventListener(openCreateEventEvent, handleOpenCreateEvent);
    };
  }, []);

  useEffect(() => {
    function handleOpenEditSelectedEvent() {
      if (eventSelected) {
        setIsCreating(false);
        setIsUpdating(true);
      }
    }

    function handleOpenDeleteSelectedEvent() {
      if (eventSelected) {
        setIsDeleting(true);
      }
    }

    window.addEventListener(openEditSelectedEventEvent, handleOpenEditSelectedEvent);
    window.addEventListener(openDeleteSelectedEventEvent, handleOpenDeleteSelectedEvent);

    return () => {
      window.removeEventListener(openEditSelectedEventEvent, handleOpenEditSelectedEvent);
      window.removeEventListener(openDeleteSelectedEventEvent, handleOpenDeleteSelectedEvent);
    };
  }, [eventSelected]);

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
        <div className="flex flex-col gap-4 w-2/4">
          <EventTimeline
            selectedEvent={eventSelected}
            setSelectedEvent={setEventSelected}
            setUpdating={setIsUpdating}
            setDeleting={setIsDeleting}
          />
        </div>

        <div className="flex-1 ml-6">
          {isCreating ? (
            <CreateEvent onCancel={() => setIsCreating(false)} />
          ) : isUpdating && eventSelected ? (
            <UpdateEvent event={eventSelected} onCancel={() => setIsUpdating(false)} />
          ) : (
            <EventDetail event={eventSelected} />
          )}
        </div>
        {isDeleting && eventSelected && (
          <EventDeleteActions
            event={eventSelected}
            open={isDeleting}
            setOpen={setIsDeleting}
            onClose={() => setIsDeleting(false)}
            clearSelection={() => setEventSelected(undefined)}
          />
        )}
      </div>
    </div>
  );
}
