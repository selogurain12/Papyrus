import {
  CharacterDto,
  EventDto,
  NoteDto,
  ObjectDto,
  PlaceDto,
  queryKeys,
  ResearchDto,
} from "@papyrus/source";

import { useOfflineList } from "../../../hooks/use-offline-list";
import { client } from "../../../utils/client/client";

const referenceQuery = { page: 1, itemsPerPage: 100 };

export function useChapterReferenceData(projectId: string, enabled: boolean) {
  const { data: charactersData } = client.character.getAll.useQuery({
    queryKey: queryKeys.character.getAll({
      pathParams: { projectId },
      query: referenceQuery,
    }),
    queryData: {
      params: { projectId },
      query: referenceQuery,
    },
    enabled,
  });
  const { data: placesData } = client.place.getAll.useQuery({
    queryKey: queryKeys.place.getAll({
      pathParams: { projectId },
      query: referenceQuery,
    }),
    queryData: {
      params: { projectId },
      query: referenceQuery,
    },
    enabled,
  });
  const { data: objectsData } = client.object.getAll.useQuery({
    queryKey: queryKeys.object.getAll({
      pathParams: { projectId },
      query: referenceQuery,
    }),
    queryData: {
      params: { projectId },
      query: referenceQuery,
    },
    enabled,
  });
  const { data: researchData } = client.research.getAll.useQuery({
    queryKey: queryKeys.research.getAll({
      pathParams: { projectId },
      query: referenceQuery,
    }),
    queryData: {
      params: { projectId },
      query: referenceQuery,
    },
    enabled,
  });
  const { data: notesData } = client.note.getAll.useQuery({
    queryKey: queryKeys.note.getAll({
      pathParams: { projectId },
      query: referenceQuery,
    }),
    queryData: {
      params: { projectId },
      query: referenceQuery,
    },
    enabled,
  });
  const { data: eventsData } = client.event.getAll.useQuery({
    queryKey: queryKeys.event.getAll({
      query: referenceQuery,
    }),
    queryData: {
      params: { projectId },
      query: referenceQuery,
    },
    enabled,
  });

  return {
    characters: useOfflineList<CharacterDto>({
      entityType: "characters",
      projectId,
      onlineData: charactersData?.body,
    }),
    places: useOfflineList<PlaceDto>({
      entityType: "places",
      projectId,
      onlineData: placesData?.body,
    }),
    objects: useOfflineList<ObjectDto>({
      entityType: "objects",
      projectId,
      onlineData: objectsData?.body,
    }),
    research: useOfflineList<ResearchDto>({
      entityType: "research",
      projectId,
      onlineData: researchData?.body,
    }),
    notes: useOfflineList<NoteDto>({
      entityType: "notes",
      projectId,
      onlineData: notesData?.body,
    }),
    events: useOfflineList<EventDto>({
      entityType: "events",
      projectId,
      onlineData: eventsData?.body,
    }),
  };
}
