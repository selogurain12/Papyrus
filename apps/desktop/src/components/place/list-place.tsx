/* eslint-disable no-nested-ternary */
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { PlaceCard } from "./place-card";
import { PlaceDetail } from "./place-details";
import { CreatePlace } from "./actions/create-place";
import { useEffect, useState } from "react";
import { PlaceDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { UpdatePlace } from "./actions/update-place";
import { PlaceDeleteActions } from "./actions/delete-place";
import { Input } from "../ui/input";
import { useFilterDto } from "../../utils/filters/use-filter-dto";
import { useTranslation } from "react-i18next";
import {
  openCreatePlaceEvent,
  openDeleteSelectedPlaceEvent,
  openEditSelectedPlaceEvent,
} from "../../utils/shortcut-events";
import { useOfflineList } from "../../hooks/use-offline-list";

// eslint-disable-next-line complexity
export function PlacesList() {
  const { t } = useTranslation(["place/list-place", "common"]);
  const { currentProject } = useProject();
  const [placeSelected, setPlaceSelected] = useState<PlaceDto | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { options, setSearch } = useFilterDto({
    itemsPerPage: 20,
    page: 1,
    orderBy: { createdAt: "desc" },
  });
  if (!currentProject) {
    <div>{t("common:loading")}</div>;
  }

  const { data } = client.place.getAll.useQuery({
    queryKey: queryKeys.place.getAll({
      pathParams: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    }),
    queryData: {
      params: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    },
  });
  const places = useOfflineList({
    entityType: "places",
    projectId: currentProject?.id,
    onlineData: data?.body,
    search: options.search,
  });

  useEffect(() => {
    function handleOpenCreatePlace() {
      setIsCreating(true);
      setIsUpdating(false);
      setPlaceSelected(undefined);
    }

    window.addEventListener(openCreatePlaceEvent, handleOpenCreatePlace);

    return () => {
      window.removeEventListener(openCreatePlaceEvent, handleOpenCreatePlace);
    };
  }, []);

  useEffect(() => {
    function handleOpenEditSelectedPlace() {
      if (placeSelected) {
        setIsCreating(false);
        setIsUpdating(true);
      }
    }

    function handleOpenDeleteSelectedPlace() {
      if (placeSelected) {
        setIsDeleting(true);
      }
    }

    window.addEventListener(openEditSelectedPlaceEvent, handleOpenEditSelectedPlace);
    window.addEventListener(openDeleteSelectedPlaceEvent, handleOpenDeleteSelectedPlace);

    return () => {
      window.removeEventListener(openEditSelectedPlaceEvent, handleOpenEditSelectedPlace);
      window.removeEventListener(openDeleteSelectedPlaceEvent, handleOpenDeleteSelectedPlace);
    };
  }, [placeSelected]);

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
          <Input placeholder={t("search")} onChange={(event) => setSearch(event.target.value)} />
          {places?.data.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onSelect={() => {
                setPlaceSelected(place);
                setIsCreating(false);
              }}
              onEdit={() => {
                setPlaceSelected(place);
                setIsUpdating(true);
              }}
              onDelete={() => {
                setPlaceSelected(place);
                setIsDeleting(true);
              }}
            />
          ))}
        </div>

        <div className="flex-1 ml-6">
          {isCreating ? (
            <CreatePlace onCancel={() => setIsCreating(false)} />
          ) : isUpdating && placeSelected ? (
            <UpdatePlace place={placeSelected} onCancel={() => setIsUpdating(false)} />
          ) : (
            <PlaceDetail place={placeSelected} />
          )}
        </div>
        {isDeleting && placeSelected && (
          <PlaceDeleteActions
            place={placeSelected}
            open={isDeleting}
            setOpen={setIsDeleting}
            onClose={() => setIsDeleting(false)}
            clearSelection={() => setPlaceSelected(undefined)}
          />
        )}
      </div>
    </div>
  );
}
