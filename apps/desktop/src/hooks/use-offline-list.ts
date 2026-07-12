import type { ListResult } from "@papyrus/source";
import { useEffect, useMemo, useState } from "react";

import {
  cacheEntityList,
  filterCachedList,
  getCachedEntityList,
  localEntityChangedEvent,
} from "../local-db/offline-entity-store";
import { useOnlineStatus } from "./use-online-status";

interface UseOfflineListInput<Data extends { id: string }> {
  entityType: string;
  projectId?: string | null;
  onlineData?: ListResult<Data>;
  search?: string | null;
}

export function useOfflineList<Data extends { id: string }>({
  entityType,
  projectId,
  onlineData,
  search,
}: UseOfflineListInput<Data>) {
  const isOnline = useOnlineStatus();
  const [cachedData, setCachedData] = useState<ListResult<Data> | null>(null);

  useEffect(() => {
    if (!projectId) {
      setCachedData(null);
      return;
    }

    let isMounted = true;

    void getCachedEntityList<Data>(entityType, projectId)
      .then((nextCachedData) => {
        if (isMounted) {
          setCachedData(nextCachedData);
        }
      })
      .catch((error) => {
        console.error(`Unable to read cached ${entityType}`, error);
      });

    return () => {
      isMounted = false;
    };
  }, [entityType, projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    const cacheProjectId = projectId;

    function handleLocalEntityChanged(event: Event) {
      const customEvent = event as CustomEvent<{ entityType?: string }>;

      if (customEvent.detail?.entityType !== entityType) {
        return;
      }

      void getCachedEntityList<Data>(entityType, cacheProjectId).then(setCachedData);
    }

    window.addEventListener(localEntityChangedEvent, handleLocalEntityChanged);

    return () => {
      window.removeEventListener(localEntityChangedEvent, handleLocalEntityChanged);
    };
  }, [entityType, projectId]);

  useEffect(() => {
    if (!projectId || !onlineData) {
      return;
    }

    void cacheEntityList(entityType, projectId, onlineData.data)
      .then(() => getCachedEntityList<Data>(entityType, projectId))
      .then(setCachedData)
      .catch((error) => {
        console.error(`Unable to cache ${entityType}`, error);
      });
  }, [entityType, onlineData, projectId]);

  return useMemo(() => {
    const list = cachedData ?? (isOnline ? onlineData : undefined);

    return list ? filterCachedList(list, search) : undefined;
  }, [cachedData, isOnline, onlineData, search]);
}
