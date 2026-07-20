import type { ListResult } from "@papyrus/source";

import { getLocalDatabaseApi } from "./renderer";
import type { JsonValue, LocalEntity } from "./types";

export const localEntityChangedEvent = "papyrus:local-entity-changed";

export function notifyLocalEntityChanged(entityType: string) {
  window.dispatchEvent(new CustomEvent(localEntityChangedEvent, { detail: { entityType } }));
}

function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}

function fromJsonValue<Data>(value: JsonValue): Data {
  return value as unknown as Data;
}

function isPendingLocalEntity(entity: LocalEntity) {
  return entity.serverId === null && entity.syncStatus === "pending";
}

function isLocalAttachment(value: JsonValue | undefined) {
  return typeof value === "string" && (value.startsWith("data:") || value.startsWith("file://"));
}

function isEmptyAttachment(value: JsonValue | undefined) {
  return value === null || value === undefined || value === "";
}

function hasAvatarLink(entityType: string) {
  return ["characters", "places", "objects"].includes(entityType);
}

// eslint-disable-next-line complexity
function preserveLocalAttachments(
  entityType: string,
  serverPayload: JsonValue,
  localPayload?: JsonValue
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

  if (
    hasAvatarLink(entityType) &&
    isEmptyAttachment(serverRecord.avatarLink) &&
    isLocalAttachment(localRecord.avatarLink)
  ) {
    serverRecord.avatarLink = localRecord.avatarLink;
  }

  return serverRecord;
}

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

export async function cacheEntityList<Data extends { id: string }>(
  entityType: string,
  projectId: string,
  items: Data[]
) {
  const localDatabase = getLocalDatabaseApi();
  const serverIds = new Set(items.map((item) => item.id));
  const existingItems = await localDatabase.listEntities({
    entityType,
    projectId,
  });

  await Promise.all(
    items.map((item) => {
      const existingItem = existingItems.find(
        (existing) => existing.id === item.id || existing.serverId === item.id
      );
      const payload = preserveLocalAttachments(
        entityType,
        toJsonValue(item),
        existingItem?.payload
      );

      return localDatabase.saveEntity({
        entityType,
        id: item.id,
        serverId: item.id,
        projectId,
        payload,
        syncStatus: "synced",
      });
    })
  );

  await Promise.all(
    existingItems
      .filter((item) => !isPendingLocalEntity(item) && !serverIds.has(item.serverId ?? item.id))
      .map((item) =>
        localDatabase.removeEntity({
          entityType,
          id: item.id,
        })
      )
  );
}

export async function getCachedEntityList<Data>(
  entityType: string,
  projectId: string
): Promise<ListResult<Data>> {
  const entities = await getLocalDatabaseApi().listEntities({
    entityType,
    projectId,
  });

  return {
    data: entities.map((entity) => fromJsonValue<Data>(entity.payload)),
    total: entities.length,
  };
}

export function filterCachedList<Data>(list: ListResult<Data>, search?: string | null) {
  const normalizedSearch = search?.trim().toLocaleLowerCase();

  if (!normalizedSearch) {
    return list;
  }

  const data = list.data.filter((item) =>
    JSON.stringify(item).toLocaleLowerCase().includes(normalizedSearch)
  );

  return {
    data,
    total: data.length,
  };
}

export async function createOfflineEntity<CreateData extends object, Data extends { id: string }>(
  entityType: string,
  projectId: string,
  data: CreateData
): Promise<Data> {
  const localEntity = {
    ...data,
    id: createId(),
  } as unknown as Data;

  await getLocalDatabaseApi().saveEntity({
    entityType,
    id: localEntity.id,
    projectId,
    payload: toJsonValue(localEntity),
    operation: "create",
  });
  notifyLocalEntityChanged(entityType);

  return localEntity;
}

export async function updateOfflineEntity<UpdateData extends object, Data extends { id: string }>(
  entityType: string,
  projectId: string,
  entity: Data,
  data: UpdateData
): Promise<Data> {
  const localDatabase = getLocalDatabaseApi();
  const existingEntity = await localDatabase.getEntity(entityType, entity.id);
  const updatedEntity = {
    ...entity,
    ...data,
    id: entity.id,
  } as Data;

  await localDatabase.saveEntity({
    entityType,
    id: entity.id,
    serverId: existingEntity ? existingEntity.serverId : entity.id,
    projectId,
    payload: toJsonValue(updatedEntity),
    operation: "update",
  });
  notifyLocalEntityChanged(entityType);

  return updatedEntity;
}

export async function deleteOfflineEntity(
  entityType: string,
  id: string,
  queryKeyPrefix?: string
): Promise<void> {
  await getLocalDatabaseApi().removeEntity({
    entityType,
    id,
    operation: "delete",
  });
  notifyLocalEntityChanged(entityType);

  if (queryKeyPrefix) {
    await import("../context/query-client").then(({ queryClient }) =>
      queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] })
    );
  }
}
