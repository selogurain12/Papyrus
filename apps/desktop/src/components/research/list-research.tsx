import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { queryKeys, ResearchDto } from "@papyrus/source";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Search as SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { ResearchCard } from "./research-card";
import { CreateResearchForm } from "./actions/create-form";
import { UpdateResearchForm } from "./actions/update-form";
import { ResearchDeleteActions } from "./actions/delete-research";
import { Dialog } from "../ui/dialogs/dialog";
import { useFilterResearchDto } from "../../utils/filters/use-filter-research";
import { useTranslation } from "react-i18next";
import { openCreateResearchEvent } from "../../utils/shortcut-events";
import { useOfflineList } from "../../hooks/use-offline-list";

const categories = ["all", "articles", "links", "images", "videos", "books"];

// eslint-disable-next-line complexity
export function ListResearch() {
  const { t } = useTranslation(["research/list-research", "common"]);
  const { currentProject } = useProject();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<ResearchDto | null>(null);
  const [isDeleting, setIsDeleting] = useState<ResearchDto | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { options, setSearch, setType } = useFilterResearchDto({
    itemsPerPage: 20,
    page: 1,
    orderBy: { createdAt: "desc" },
  });

  const { data } = client.research.getAll.useQuery({
    queryKey: queryKeys.research.getAll({
      pathParams: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    }),
    queryData: {
      params: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    },
    enabled: Boolean(currentProject?.id),
  });
  const researchList = useOfflineList({
    entityType: "research",
    projectId: currentProject?.id,
    onlineData: data?.body,
    search: options.search,
  });

  useEffect(() => {
    function handleOpenCreateResearch() {
      setIsCreating(true);
      setIsUpdating(null);
      setIsDeleting(null);
    }

    window.addEventListener(openCreateResearchEvent, handleOpenCreateResearch);

    return () => {
      window.removeEventListener(openCreateResearchEvent, handleOpenCreateResearch);
    };
  }, []);

  const emptyResearchClassName =
    "col-span-full rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500";

  if (!currentProject) {
    return (
      <div className="min-h-75 flex items-center justify-center text-gray-500">
        {t("common:loading")}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        data-tour="page-header"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button variant="blue" onClick={() => setIsCreating(true)} data-tour="page-create-action">
          <Plus className="w-4 h-4 mr-2" />
          {t("new")}
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 mb-6" data-tour="page-filters">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <Input
              id="research-search"
              type="search"
              placeholder={t("searchPlaceholder")}
              onChange={(event) => setSearch(event.target.value)}
              value={options.search ?? ""}
              className="border-none focus:ring-0"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setType(
                  category === "all"
                    ? undefined
                    : (category as "articles" | "links" | "images" | "videos" | "books")
                );
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                activeCategory === category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-tour="page-list">
        {researchList?.data.length === 0 ? (
          <div className={emptyResearchClassName}>{t("empty")}</div>
        ) : (
          researchList?.data.map((research) => (
            <ResearchCard
              key={research.id}
              research={research}
              openEditModal={(item) => setIsUpdating(item)}
              openDeleteModal={(item) => setIsDeleting(item)}
            />
          ))
        )}
      </div>

      {isCreating && (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <CreateResearchForm setOpen={setIsCreating} />
        </Dialog>
      )}

      {isUpdating && (
        <Dialog open={Boolean(isUpdating)} onOpenChange={() => setIsUpdating(null)}>
          <UpdateResearchForm setOpen={() => setIsUpdating(null)} research={isUpdating} />
        </Dialog>
      )}

      {isDeleting && (
        <ResearchDeleteActions
          open={Boolean(isDeleting)}
          setOpen={(open) => (open ? null : setIsDeleting(null))}
          research={isDeleting}
          clearSelection={() => setIsDeleting(null)}
        />
      )}
    </div>
  );
}
