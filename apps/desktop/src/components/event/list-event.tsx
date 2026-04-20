/* eslint-disable no-nested-ternary */
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { EventDetail } from "./event-details";
import { CreateEvent } from "./actions/create-event";
import { useState } from "react";
import { EventDto } from "@papyrus/source";
import { UpdateEvent } from "./actions/update-event";
import { EventDeleteActions } from "./actions/delete-event";
import { EventTimeline } from "./event-timeline";

export function EventsList() {
  const [eventSelected, setEventSelected] = useState<EventDto | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="">
          <h2 className="text-2xl font-bold text-foreground">Chronologie</h2>
          <p className="text-md">Gérez les événements de votre histoire</p>
        </div>
        <Button variant="blue" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel événement
        </Button>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col gap-4 w-2/4">
          <EventTimeline
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
