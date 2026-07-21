/* eslint-disable no-nested-ternary */
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { CharacterCard } from "./character-card";
import { CharacterDetail } from "./character-details";
import { CreateCharacter } from "./actions/create-character";
import { useEffect, useState } from "react";
import { CharacterDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { UpdateCharacter } from "./actions/update-character";
import { CharacterDeleteActions } from "./actions/delete-character";
import { Input } from "../ui/input";
import { useFilterCharacterDto } from "../../utils/filters/use-filter-character";
import { useTranslation } from "react-i18next";
import {
  openCreateCharacterEvent,
  openDeleteSelectedCharacterEvent,
  openEditSelectedCharacterEvent,
} from "../../utils/shortcut-events";
import { useOfflineList } from "../../hooks/use-offline-list";

// eslint-disable-next-line complexity
export function CharactersList() {
  const { t } = useTranslation("character/list-character");
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
  const characters = useOfflineList({
    entityType: "characters",
    projectId: currentProject?.id,
    onlineData: data?.body,
    search: options.search,
  });

  useEffect(() => {
    function handleOpenCreateCharacter() {
      setIsCreating(true);
      setIsUpdating(false);
      setCharacterSelected(undefined);
    }

    window.addEventListener(openCreateCharacterEvent, handleOpenCreateCharacter);

    return () => {
      window.removeEventListener(openCreateCharacterEvent, handleOpenCreateCharacter);
    };
  }, []);

  useEffect(() => {
    function handleOpenEditSelectedCharacter() {
      if (characterSelected) {
        setIsCreating(false);
        setIsUpdating(true);
      }
    }

    function handleOpenDeleteSelectedCharacter() {
      if (characterSelected) {
        setIsDeleting(true);
      }
    }

    window.addEventListener(openEditSelectedCharacterEvent, handleOpenEditSelectedCharacter);
    window.addEventListener(openDeleteSelectedCharacterEvent, handleOpenDeleteSelectedCharacter);

    return () => {
      window.removeEventListener(openEditSelectedCharacterEvent, handleOpenEditSelectedCharacter);
      window.removeEventListener(
        openDeleteSelectedCharacterEvent,
        handleOpenDeleteSelectedCharacter
      );
    };
  }, [characterSelected]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6" data-tour="page-header">
        <div className="">
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="text-md">{t("subtitle")}</p>
        </div>
        <Button variant="blue" onClick={() => setIsCreating(true)} data-tour="page-create-action">
          <Plus className="w-4 h-4 mr-2" />
          {t("new")}
        </Button>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col gap-4 w-1/3" data-tour="page-list">
          <Input
            id="character-search"
            placeholder={t("search")}
            onChange={(event) => setSearch(event.target.value)}
          />
          {characters?.data.map((character) => (
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

        <div className="flex-1 ml-6" data-tour="page-detail">
          {isCreating ? (
            <CreateCharacter
              onCancel={() => setIsCreating(false)}
              onCreated={(character) => {
                setCharacterSelected(character);
              }}
            />
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
            onDeleted={(characterId) => {
              if (characterSelected?.id === characterId) {
                setCharacterSelected(undefined);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
