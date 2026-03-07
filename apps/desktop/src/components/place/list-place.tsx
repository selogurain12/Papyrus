/* eslint-disable no-nested-ternary */
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { PlaceCard } from "./place-card";
import { PlaceDetail } from "./place-details";
import { CreatePlace } from "./actions/create-place";
import { useState } from "react";
import { PlaceDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { UpdatePlace } from "./actions/update-place";
import { PlaceDeleteActions } from "./actions/delete-place";
import { Input } from "../ui/input";
import { useFilterDto } from "../../utils/filters/use-filter-dto";

export function PlacesList() {
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
    <div>Loading...</div>;
  }

  const { data } = client.place.getAll.useQuery({
    queryKey: queryKeys.place.getAll({
      pathParams: { projectId: currentProject.id },
      query: { ...options },
    }),
    queryData: {
      params: { projectId: currentProject.id },
      query: { ...options },
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="">
          <h2 className="text-2xl font-bold text-foreground">Lieux</h2>
          <p className="text-md">Créez et gérez les lieux de votre univers</p>
        </div>
        <Button variant="blue" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau lieu
        </Button>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col gap-4 w-1/3">
          <Input
            placeholder="Rechercher un lieu..."
            onChange={(event) => setSearch(event.target.value)}
          />
          {data?.body?.data.map((place) => (
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
