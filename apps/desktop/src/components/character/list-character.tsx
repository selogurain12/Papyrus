/* eslint-disable no-nested-ternary */
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { CharacterCard } from "./character-card";
import { CharacterDetail } from "./character-details";
import { CreateCharacter } from "./actions/create-character";
import { useState } from "react";
import { CharacterDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { UpdateCharacter } from "./actions/update-character";
import { CharacterDeleteActions } from "./actions/delete-character";
import { Input } from "../ui/input";
import { useFilterCharacterDto } from "../../utils/filters/use-filter-character";

// eslint-disable-next-line complexity
export function CharactersList() {
  const { currentProject } = useProject();
  const [characterSelected, setCharacterSelected] = useState<CharacterDto | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { options, setSearch } = useFilterCharacterDto({
    itemsPerPage: 20,
    page: 1,
    orderBy: { createdAt: "desc" },
  });

  const { data } = client.character.getAll.useQuery({
    queryKey: queryKeys.character.getAll({
      pathParams: { projectId: currentProject?.id || "" },
      query: { ...options },
    }),
    queryData: {
      params: { projectId: currentProject?.id || "" },
      query: { ...options },
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="">
          <h2 className="text-2xl font-bold text-foreground">Personnages</h2>
          <p className="text-md">Gérez les personnages de votre histoire</p>
        </div>
        <Button variant="blue" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau personnage
        </Button>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col gap-4 w-1/3">
          <Input
            placeholder="Rechercher un personnage..."
            onChange={(event) => setSearch(event.target.value)}
          />
          {data?.body?.data.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={() => {
                setCharacterSelected(character);
                setIsCreating(false);
              }}
              onEdit={() => {
                setCharacterSelected(character);
                setIsUpdating(true);
              }}
              onDelete={() => {
                setCharacterSelected(character);
                setIsDeleting(true);
              }}
            />
          ))}
        </div>

        <div className="flex-1 ml-6">
          {isCreating ? (
            <CreateCharacter onCancel={() => setIsCreating(false)} />
          ) : isUpdating && characterSelected ? (
            <UpdateCharacter character={characterSelected} onCancel={() => setIsUpdating(false)} />
          ) : (
            <CharacterDetail character={characterSelected} />
          )}
        </div>
        {isDeleting && characterSelected && (
          <CharacterDeleteActions
            character={characterSelected}
            open={isDeleting}
            setOpen={setIsDeleting}
            onClose={() => setIsDeleting(false)}
            clearSelection={() => setCharacterSelected(undefined)}
          />
        )}
      </div>
    </div>
  );
}
