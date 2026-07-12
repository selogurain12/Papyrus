/* eslint-disable max-len */
import { GitBranch, Pencil, Plus, Trash2 } from "lucide-react";
import { useProject } from "../../context/project-provider";
import { Button } from "../ui/button";
import { useState } from "react";
import { client } from "../../utils/client/client";
import { MindMapDto, queryKeys } from "@papyrus/source";
import { useFilterDto } from "../../utils/filters/use-filter-dto";
import { useNavigate } from "@tanstack/react-router";
import {
  createMindmapRoute,
  updateMindmapRoute,
  viewMindmapRoute,
} from "../../routes/mindmap/index.route";
import { MindMapDeleteActions } from "./actions/delete-mindmap";
import { useTranslation } from "react-i18next";
import { useOfflineList } from "../../hooks/use-offline-list";

// eslint-disable-next-line complexity
export function MindMapPage() {
  const { t } = useTranslation(["mindmap/mindmap-list", "common"]);
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [mindmapsSelected, setMindmapsSelected] = useState<MindMapDto | undefined>(undefined);

  const { options } = useFilterDto({
    itemsPerPage: 20,

    orderBy: {
      title: "desc",
    },

    page: 1,
  });

  const { data } = client.mindmap.getAll.useQuery({
    queryKey: queryKeys.mindmap.getAll({
      pathParams: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    }),
    queryData: {
      query: options,
      params: { projectId: currentProject?.id ?? "" },
    },
  });
  const mindmaps = useOfflineList({
    entityType: "mindmaps",
    projectId: currentProject?.id,
    onlineData: data?.body,
    search: options.search,
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
      <p className="text-gray-600">{t("subtitle")}</p>

      <div className="mt-6 bg-blue-100 p-4 rounded-lg text-center items-center justify-center flex flex-col border border-blue-300">
        <GitBranch className="w-10 h-10 text-blue-600 mb-2" />
        <p className="font-bold">{t("canvas")}</p>
        <p className="text-sm text-gray-500 mt-1">{t("canvasDescription")}</p>

        <Button
          className="mt-4"
          variant="blue"
          onClick={() => {
            void navigate({
              to: createMindmapRoute.to,
              params: { name: currentProject?.title ?? "" },
            });
          }}
        >
          <Plus /> {t("createNew")}
        </Button>
      </div>

      {mindmaps?.total !== 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold">{t("yourMaps")}</h3>

          {mindmaps?.data?.map((mindmap) => (
            <div
              key={mindmap.id}
              className="p-4 border border-gray-300 rounded-lg bg-white shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{mindmap.title}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hover:bg-gray-300"
                  onClick={() =>
                    void navigate({
                      to: viewMindmapRoute.to,
                      params: { name: currentProject?.title ?? "", id: mindmap.id },
                    })
                  }
                >
                  <span className="h-4 leading-4">{t("common:openExternal")}</span>
                </Button>
                <Button
                  variant="outline"
                  className="hover:bg-gray-300"
                  onClick={() =>
                    void navigate({
                      to: updateMindmapRoute.to,
                      params: { name: currentProject?.title ?? "", id: mindmap.id },
                    })
                  }
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hover:bg-gray-300"
                  onClick={() => {
                    setMindmapsSelected(mindmap);
                    setIsDeleting(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isDeleting && mindmapsSelected && (
        <MindMapDeleteActions
          open={Boolean(isDeleting)}
          setOpen={(open) => (open ? null : setIsDeleting(false))}
          mindmap={mindmapsSelected}
          clearSelection={() => setIsDeleting(false)}
        />
      )}
    </div>
  );
}
