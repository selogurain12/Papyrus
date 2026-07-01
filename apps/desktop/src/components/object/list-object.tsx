/* eslint-disable no-nested-ternary */
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ObjectCard } from "./object-card";
import { ObjectDetail } from "./object-details";
import { CreateObject } from "./actions/create-object";
import { useEffect, useState } from "react";
import { ObjectDto, queryKeys } from "@papyrus/source";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { UpdateObject } from "./actions/update-object";
import { ObjectDeleteActions } from "./actions/delete-object";
import { Input } from "../ui/input";
import { useFilterDto } from "../../utils/filters/use-filter-dto";
import { useTranslation } from "react-i18next";
import {
  openCreateObjectEvent,
  openDeleteSelectedObjectEvent,
  openEditSelectedObjectEvent,
} from "../../utils/shortcut-events";

// eslint-disable-next-line complexity
export function ObjectsList() {
  const { t } = useTranslation(["object/list-object", "common"]);
  const { currentProject } = useProject();
  const [objectSelected, setObjectSelected] = useState<ObjectDto | undefined>(undefined);
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

  const { data } = client.object.getAll.useQuery({
    queryKey: queryKeys.object.getAll({
      pathParams: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    }),
    queryData: {
      params: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    },
  });

  useEffect(() => {
    function handleOpenCreateObject() {
      setIsCreating(true);
      setIsUpdating(false);
      setObjectSelected(undefined);
    }

    window.addEventListener(openCreateObjectEvent, handleOpenCreateObject);

    return () => {
      window.removeEventListener(openCreateObjectEvent, handleOpenCreateObject);
    };
  }, []);

  useEffect(() => {
    function handleOpenEditSelectedObject() {
      if (objectSelected) {
        setIsCreating(false);
        setIsUpdating(true);
      }
    }

    function handleOpenDeleteSelectedObject() {
      if (objectSelected) {
        setIsDeleting(true);
      }
    }

    window.addEventListener(openEditSelectedObjectEvent, handleOpenEditSelectedObject);
    window.addEventListener(openDeleteSelectedObjectEvent, handleOpenDeleteSelectedObject);

    return () => {
      window.removeEventListener(openEditSelectedObjectEvent, handleOpenEditSelectedObject);
      window.removeEventListener(openDeleteSelectedObjectEvent, handleOpenDeleteSelectedObject);
    };
  }, [objectSelected]);

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
          {data?.body?.data.map((object) => (
            <ObjectCard
              key={object.id}
              object={object}
              onSelect={() => {
                setObjectSelected(object);
                setIsCreating(false);
              }}
              onEdit={() => {
                setObjectSelected(object);
                setIsUpdating(true);
              }}
              onDelete={() => {
                setObjectSelected(object);
                setIsDeleting(true);
              }}
            />
          ))}
        </div>

        <div className="flex-1 ml-6">
          {isCreating ? (
            <CreateObject onCancel={() => setIsCreating(false)} />
          ) : isUpdating && objectSelected ? (
            <UpdateObject object={objectSelected} onCancel={() => setIsUpdating(false)} />
          ) : (
            <ObjectDetail object={objectSelected} />
          )}
        </div>
        {isDeleting && objectSelected && (
          <ObjectDeleteActions
            object={objectSelected}
            open={isDeleting}
            setOpen={setIsDeleting}
            onClose={() => setIsDeleting(false)}
            clearSelection={() => setObjectSelected(undefined)}
          />
        )}
      </div>
    </div>
  );
}
