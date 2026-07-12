/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { queryClient } from "../../context/query-client";
import { useOnlineStatus } from "../../hooks/use-online-status";
import { getLocalDatabaseApi } from "../../local-db/renderer";
import type { JsonValue, LocalEntity, SyncQueueItem } from "../../local-db/types";
import { apiUrl } from "../../utils/client/client";

interface SyncEntityConfig {
  apiPath: string;
  queryKeyPrefix: string;
  usesProjectPrefix?: boolean;
}

const syncEntityConfigs: Record<string, SyncEntityConfig> = {
  settings: { apiPath: "settings", queryKeyPrefix: "setting.get", usesProjectPrefix: false },
  projects: { apiPath: "projects", queryKeyPrefix: "project.getAll" },
  characters: { apiPath: "characters", queryKeyPrefix: "character.getAll" },
  places: { apiPath: "places", queryKeyPrefix: "place.getAll" },
  objects: { apiPath: "objects", queryKeyPrefix: "object.getAll" },
  events: { apiPath: "events", queryKeyPrefix: "event.getAll" },
  notes: { apiPath: "notes", queryKeyPrefix: "note.getAll" },
  research: { apiPath: "researchs", queryKeyPrefix: "research.getAll" },
  goals: { apiPath: "goals", queryKeyPrefix: "goal.getAll" },
  parts: { apiPath: "parts", queryKeyPrefix: "part.getAll" },
  chapters: { apiPath: "chapters", queryKeyPrefix: "chapter.getAll" },
  mindmaps: { apiPath: "mindmaps", queryKeyPrefix: "mindmap.getAll" },
  structures: { apiPath: "structure", queryKeyPrefix: "structure.get" },
};

function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}

function getToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Unable to read auth token for offline sync", error);
    return null;
  }
}

function getProjectId(operation: SyncQueueItem, entity: LocalEntity | null): string | null {
  const payload = operation.payload as { project?: { id?: string } };

  return entity?.projectId ?? payload.project?.id ?? null;
}

function removeId<Data extends JsonValue>(payload: Data): JsonValue {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { id: _id, ...rest } = payload as Record<string, JsonValue>;

  return rest;
}

function isLocalAttachment(value: JsonValue | undefined) {
  return typeof value === "string" && (value.startsWith("data:") || value.startsWith("file://"));
}

function isEmptyAttachment(value: JsonValue | undefined) {
  return value === null || value === undefined || value === "";
}

function preserveLocalAttachments(
  entityType: string,
  serverPayload: JsonValue,
  localPayload: JsonValue
): JsonValue {
  if (
    !serverPayload ||
    typeof serverPayload !== "object" ||
    Array.isArray(serverPayload) ||
    !localPayload ||
    typeof localPayload !== "object" ||
    Array.isArray(localPayload)
  ) {
    return serverPayload;
  }

  const serverRecord = { ...(serverPayload as Record<string, JsonValue>) };
  const localRecord = localPayload as Record<string, JsonValue>;

  if (
    entityType === "research" &&
    isEmptyAttachment(serverRecord.link) &&
    isLocalAttachment(localRecord.link)
  ) {
    serverRecord.link = localRecord.link;
  }

  if (
    entityType === "notes" &&
    isEmptyAttachment(serverRecord.linkFile) &&
    isLocalAttachment(localRecord.linkFile)
  ) {
    serverRecord.linkFile = localRecord.linkFile;
  }

  return serverRecord;
}

async function resolveReferenceId(
  entityType: string,
  id: string,
  reference?: Record<string, JsonValue>
) {
  const entity = await getLocalDatabaseApi().getEntity(entityType, id);

  if (entity?.serverId) {
    return entity.serverId;
  }

  const projectId =
    reference?.project && typeof reference.project === "object"
      ? (reference.project as Record<string, JsonValue>).id
      : null;

  if (typeof projectId === "string" && typeof reference?.title === "string") {
    const candidates = await getLocalDatabaseApi().listEntities({
      entityType,
      projectId,
      includeDeleted: true,
    });
    const matchingEntity = candidates.find((candidate) => {
      const payload = candidate.payload as Record<string, JsonValue>;

      return candidate.serverId && payload.title === reference.title;
    });

    if (matchingEntity?.serverId) {
      return matchingEntity.serverId;
    }
  }

  return id;
}

async function prepareCreatePayload(entityType: string, payload: JsonValue): Promise<JsonValue> {
  const body = removeId(payload);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  const record = { ...(body as Record<string, JsonValue>) };

  if ((entityType === "research" || entityType === "notes") && isLocalAttachment(record.link)) {
    record.link = null;
  }

  if (entityType === "notes" && isLocalAttachment(record.linkFile)) {
    record.linkFile = null;
  }

  if (entityType === "chapters" && record.part && typeof record.part === "object") {
    const part = record.part as Record<string, JsonValue>;

    if (typeof part.id === "string") {
      record.part = {
        ...part,
        id: await resolveReferenceId("parts", part.id, part),
      };
    }
  }

  return record;
}

async function sendOperationToServer(
  config: SyncEntityConfig,
  projectId: string,
  operation: SyncQueueItem,
  serverEntityId: string,
  payload: JsonValue,
  token: string
): Promise<JsonValue | null> {
  const isDelete = operation.operation === "delete";
  const baseUrl =
    config.usesProjectPrefix === false
      ? `${apiUrl}/${config.apiPath}`
      : `${apiUrl}/${projectId}/${config.apiPath}`;
  const url =
    operation.operation === "create"
      ? `${baseUrl}/create`
      : `${baseUrl}/${isDelete ? "delete" : "update"}/${serverEntityId}`;

  const body =
    operation.operation === "create"
      ? await prepareCreatePayload(operation.entityType, payload)
      : payload;

  const response = await fetch(url, {
    // eslint-disable-next-line no-nested-ternary
    method: operation.operation === "create" ? "POST" : isDelete ? "DELETE" : "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: isDelete ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `${operation.entityType} sync failed with status ${response.status}${
        errorText ? `: ${errorText}` : ""
      }`
    );
  }

  return isDelete ? null : toJsonValue(await response.json());
}

async function syncEntityOperation(operation: SyncQueueItem, token: string): Promise<void> {
  const config = syncEntityConfigs[operation.entityType];

  if (!config) {
    return;
  }

  const localDatabase = getLocalDatabaseApi();
  const entity = await localDatabase.getEntity(operation.entityType, operation.entityId);
  const projectId = getProjectId(operation, entity);

  if (!projectId) {
    throw new Error(`Impossible de synchroniser ${operation.entityType} sans projet.`);
  }

  const payload = entity?.payload ?? operation.payload;
  const serverEntityId = entity?.serverId ?? operation.entityId;
  const serverPayload = await sendOperationToServer(
    config,
    projectId,
    operation,
    serverEntityId,
    payload,
    token
  );

  if (serverPayload) {
    const payloadToStore = preserveLocalAttachments(operation.entityType, serverPayload, payload);
    const serverEntity = payloadToStore as { id?: string };
    const serverId = serverEntity.id ?? operation.entityId;

    await localDatabase.saveEntity({
      entityType: operation.entityType,
      id: serverId,
      serverId,
      projectId,
      payload: payloadToStore,
      syncStatus: "synced",
    });

    if (operation.operation === "create" && operation.entityId !== serverId) {
      await localDatabase.saveEntity({
        entityType: operation.entityType,
        id: operation.entityId,
        serverId,
        projectId,
        payload: payloadToStore,
        syncStatus: "synced",
      });
      await localDatabase.removeEntity({
        entityType: operation.entityType,
        id: operation.entityId,
      });
    }
  }

  await localDatabase.markOperationSynced(operation.id);

  await queryClient.invalidateQueries({ queryKey: [config.queryKeyPrefix] });
}

async function syncPendingOperations(): Promise<number> {
  const token = getToken();

  if (!token) {
    return 0;
  }

  const localDatabase = getLocalDatabaseApi();
  const operations = await localDatabase.listPendingOperations();
  let syncedCount = 0;

  for (const operation of operations) {
    try {
      if (syncEntityConfigs[operation.entityType]) {
        await syncEntityOperation(operation, token);
        syncedCount += 1;
      }
    } catch (error) {
      await localDatabase.markOperationFailed({
        id: operation.id,
        error: error instanceof Error ? error.message : "Erreur de synchronisation inconnue",
      });
      console.error("Offline sync failed", error);
    }
  }

  return syncedCount;
}

export function OfflineSyncManager() {
  const { t } = useTranslation("common");
  const isOnline = useOnlineStatus();
  const syncPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!isOnline || syncPromiseRef.current) {
      return;
    }

    syncPromiseRef.current = syncPendingOperations()
      .then((syncedCount) => {
        if (syncedCount > 0) {
          toast.success(t("sync.savedToApi", { count: syncedCount }));
        }
      })
      .finally(() => {
        syncPromiseRef.current = null;
      });
  }, [isOnline, t]);

  return null;
}
