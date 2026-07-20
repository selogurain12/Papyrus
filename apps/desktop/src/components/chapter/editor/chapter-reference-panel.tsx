/* eslint-disable complexity */
import { CharacterDto, EventDto, NoteDto, ObjectDto, PlaceDto, ResearchDto } from "@papyrus/source";
import { CalendarDays, FileSearch, MapPin, Package, StickyNote, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CharacterDetail } from "../../character/character-details";
import { EventDetail } from "../../event/event-details";
import NoteDetails from "../../notes/note-details";
import { ObjectDetail } from "../../object/object-details";
import { PlaceDetail } from "../../place/place-details";
import { ReferenceType } from "./chapter-editor.types";
import { ReferenceList } from "./reference-list";
import { ReferenceTypeButton } from "./reference-type-button";
import { ResearchReferenceDetail } from "./research-reference-detail";
import { useChapterReferenceData } from "./use-chapter-reference-data";

interface ChapterReferencePanelProps {
  projectId: string;
}

export function ChapterReferencePanel({ projectId }: ChapterReferencePanelProps) {
  const { t } = useTranslation(["chapter/chapter-editor", "common"]);
  const [referenceType, setReferenceType] = useState<ReferenceType>("characters");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterDto>();
  const [selectedPlace, setSelectedPlace] = useState<PlaceDto>();
  const [selectedObject, setSelectedObject] = useState<ObjectDto>();
  const [selectedResearch, setSelectedResearch] = useState<ResearchDto>();
  const [selectedNote, setSelectedNote] = useState<NoteDto>();
  const [selectedEvent, setSelectedEvent] = useState<EventDto>();
  const { characters, places, objects, research, notes, events } = useChapterReferenceData(
    projectId,
    true
  );

  return (
    <aside className="flex min-h-0 flex-col border-l border-slate-200 pl-4">
      <h2 className="text-lg font-semibold text-slate-900">{t("references.title")}</h2>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <ReferenceTypeButton
          icon={<Users className="h-4 w-4" />}
          isActive={referenceType === "characters"}
          label={t("references.characters")}
          onClick={() => setReferenceType("characters")}
        />
        <ReferenceTypeButton
          icon={<MapPin className="h-4 w-4" />}
          isActive={referenceType === "places"}
          label={t("references.places")}
          onClick={() => setReferenceType("places")}
        />
        <ReferenceTypeButton
          icon={<Package className="h-4 w-4" />}
          isActive={referenceType === "objects"}
          label={t("references.objects")}
          onClick={() => setReferenceType("objects")}
        />
        <ReferenceTypeButton
          icon={<FileSearch className="h-4 w-4" />}
          isActive={referenceType === "research"}
          label={t("references.research")}
          onClick={() => setReferenceType("research")}
        />
        <ReferenceTypeButton
          icon={<StickyNote className="h-4 w-4" />}
          isActive={referenceType === "notes"}
          label={t("references.notes")}
          onClick={() => setReferenceType("notes")}
        />
        <ReferenceTypeButton
          icon={<CalendarDays className="h-4 w-4" />}
          isActive={referenceType === "events"}
          label={t("references.events")}
          onClick={() => setReferenceType("events")}
        />
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        {referenceType === "characters" && (
          <ReferenceList<CharacterDto>
            emptyLabel={t("references.empty")}
            items={characters?.data ?? []}
            getLabel={(character) =>
              `${character.firstName} ${character.lastName}`.trim() || t("references.untitled")
            }
            selectedId={selectedCharacter?.id}
            onSelect={(character) => setSelectedCharacter(character)}
          />
        )}
        {referenceType === "places" && (
          <ReferenceList<PlaceDto>
            emptyLabel={t("references.empty")}
            items={places?.data ?? []}
            getLabel={(place) => place.name || t("references.untitled")}
            selectedId={selectedPlace?.id}
            onSelect={(place) => setSelectedPlace(place)}
          />
        )}
        {referenceType === "objects" && (
          <ReferenceList<ObjectDto>
            emptyLabel={t("references.empty")}
            items={objects?.data ?? []}
            getLabel={(object) => object.name || t("references.untitled")}
            selectedId={selectedObject?.id}
            onSelect={(object) => setSelectedObject(object)}
          />
        )}
        {referenceType === "research" && (
          <ReferenceList<ResearchDto>
            emptyLabel={t("references.empty")}
            items={research?.data ?? []}
            getLabel={(researchItem) => researchItem.title || t("references.untitled")}
            selectedId={selectedResearch?.id}
            onSelect={(researchItem) => setSelectedResearch(researchItem)}
          />
        )}
        {referenceType === "notes" && (
          <ReferenceList<NoteDto>
            emptyLabel={t("references.empty")}
            items={notes?.data ?? []}
            getLabel={(note) => note.title || t("references.untitled")}
            selectedId={selectedNote?.id}
            onSelect={(note) => setSelectedNote(note)}
          />
        )}
        {referenceType === "events" && (
          <ReferenceList<EventDto>
            emptyLabel={t("references.empty")}
            items={events?.data ?? []}
            getLabel={(event) => event.title || t("references.untitled")}
            selectedId={selectedEvent?.id}
            onSelect={(event) => setSelectedEvent(event)}
          />
        )}

        <div className="mt-4">
          {referenceType === "characters" && <CharacterDetail character={selectedCharacter} />}
          {referenceType === "places" && <PlaceDetail place={selectedPlace} />}
          {referenceType === "objects" && <ObjectDetail object={selectedObject} />}
          {referenceType === "research" && <ResearchReferenceDetail research={selectedResearch} />}
          {referenceType === "notes" && selectedNote && <NoteDetails note={selectedNote} />}
          {referenceType === "events" && <EventDetail event={selectedEvent} />}
        </div>
      </div>
    </aside>
  );
}
