import { randomUUID } from "node:crypto";

import { getLocalDatabase } from "./database";
import type {
  JsonValue,
  LocalDatabaseStats,
  LocalEntity,
  LocalEntityInput,
  LocalEntityListFilter,
  LocalEntityRemoveInput,
  QueueOperationInput,
  SyncQueueItem,
  SyncQueueUpdateInput,
} from "./types";

interface LocalEntityRow {
  entity_type: string;
  id: string;
  server_id: string | null;
  project_id: string | null;
  payload: string;
  sync_status: LocalEntity["syncStatus"];
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  last_synced_at: string | null;
}

interface SyncQueueRow {
  id: string;
  entity_type: string;
  entity_id: string;
  operation: SyncQueueItem["operation"];
  payload: string;
  created_at: string;
  updated_at: string;
  retry_count: number;
  last_error: string | null;
}

function serialize(payload: JsonValue): string {
  return JSON.stringify(payload);
}

function parsePayload(payload: string): JsonValue {
  return JSON.parse(payload) as JsonValue;
}

function mapEntity(row: LocalEntityRow): LocalEntity {
  return {
    entityType: row.entity_type,
    id: row.id,
    serverId: row.server_id,
    projectId: row.project_id,
    payload: parsePayload(row.payload),
    syncStatus: row.sync_status,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastSyncedAt: row.last_synced_at,
  };
}

function mapQueueItem(row: SyncQueueRow): SyncQueueItem {
  return {
    id: row.id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    operation: row.operation,
    payload: parsePayload(row.payload),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    retryCount: row.retry_count,
    lastError: row.last_error,
  };
}

// eslint-disable-next-line complexity
export function saveEntity(input: LocalEntityInput): LocalEntity {
  const database = getLocalDatabase();
  const id = input.id ?? randomUUID();
  const now = new Date().toISOString();
  const existing = getEntity(input.entityType, id);
  const syncStatus = input.syncStatus ?? (input.operation ? "pending" : "synced");

  database
    .prepare(
      `
        insert into local_entities (
          entity_type,
          id,
          server_id,
          project_id,
          payload,
          sync_status,
          deleted_at,
          created_at,
          updated_at,
          last_synced_at
        ) values (?, ?, ?, ?, ?, ?, null, ?, ?, ?)
        on conflict(entity_type, id) do update set
          server_id = excluded.server_id,
          project_id = excluded.project_id,
          payload = excluded.payload,
          sync_status = excluded.sync_status,
          deleted_at = null,
          updated_at = excluded.updated_at
      `
    )
    .run(
      input.entityType,
      id,
      input.serverId ?? null,
      input.projectId ?? null,
      serialize(input.payload),
      syncStatus,
      existing?.createdAt ?? now,
      now,
      syncStatus === "synced" ? now : null
    );

  if (input.operation) {
    enqueueOperation({
      entityType: input.entityType,
      entityId: id,
      operation: input.operation,
      payload: input.payload,
    });
  }

  const entity = getEntity(input.entityType, id);

  if (!entity) {
    throw new Error("Impossible de relire l'entite locale apres sauvegarde.");
  }

  return entity;
}

export function listEntities(filter: LocalEntityListFilter): LocalEntity[] {
  const database = getLocalDatabase();
  const projectFilter = filter.projectId === undefined ? "" : "and project_id is ?";
  const deletedFilter = filter.includeDeleted === true ? "" : "and deleted_at is null";

  const rows = database
    .prepare(
      `
        select * from local_entities
        where entity_type = ?
        ${projectFilter}
        ${deletedFilter}
        order by updated_at desc
      `
    )
    .all(
      ...(filter.projectId === undefined
        ? [filter.entityType]
        : [filter.entityType, filter.projectId])
    ) as LocalEntityRow[];

  return rows.map(mapEntity);
}

export function getEntity(entityType: string, id: string): LocalEntity | null {
  const row = getLocalDatabase()
    .prepare("select * from local_entities where entity_type = ? and id = ?")
    .get(entityType, id) as LocalEntityRow | undefined;

  return row ? mapEntity(row) : null;
}

export function removeEntity(input: LocalEntityRemoveInput): void {
  const now = new Date().toISOString();
  const syncStatus = input.operation ? "pending" : "synced";

  getLocalDatabase()
    .prepare(
      `
        update local_entities
        set deleted_at = ?,
            updated_at = ?,
            sync_status = ?
        where entity_type = ? and id = ?
      `
    )
    .run(now, now, syncStatus, input.entityType, input.id);

  if (input.operation) {
    enqueueOperation({
      entityType: input.entityType,
      entityId: input.id,
      operation: input.operation,
      payload: { id: input.id },
    });
  }
}

export function enqueueOperation(input: QueueOperationInput): SyncQueueItem {
  const id = randomUUID();
  const now = new Date().toISOString();

  getLocalDatabase()
    .prepare(
      `
        insert into sync_queue (
          id,
          entity_type,
          entity_id,
          operation,
          payload,
          created_at,
          updated_at
        ) values (?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(id, input.entityType, input.entityId, input.operation, serialize(input.payload), now, now);

  return {
    id,
    entityType: input.entityType,
    entityId: input.entityId,
    operation: input.operation,
    payload: input.payload,
    createdAt: now,
    updatedAt: now,
    retryCount: 0,
    lastError: null,
  };
}

export function listPendingOperations(): SyncQueueItem[] {
  const rows = getLocalDatabase()
    .prepare("select * from sync_queue order by created_at asc")
    .all() as SyncQueueRow[];

  return rows.map(mapQueueItem);
}

export function markOperationSynced(id: string): void {
  getLocalDatabase().prepare("delete from sync_queue where id = ?").run(id);
}

export function markOperationFailed(input: SyncQueueUpdateInput): void {
  getLocalDatabase()
    .prepare(
      `
        update sync_queue
        set retry_count = retry_count + 1,
            last_error = ?,
            updated_at = ?
        where id = ?
      `
    )
    .run(input.error, new Date().toISOString(), input.id);
}

export function getStats(): LocalDatabaseStats {
  const database = getLocalDatabase();

  const pendingOperations = database.prepare("select count(*) as count from sync_queue").get() as {
    count: number;
  };
  const pendingEntities = database
    .prepare("select count(*) as count from local_entities where sync_status = 'pending'")
    .get() as { count: number };
  const conflictedEntities = database
    .prepare("select count(*) as count from local_entities where sync_status = 'conflict'")
    .get() as { count: number };

  return {
    pendingOperations: pendingOperations.count,
    pendingEntities: pendingEntities.count,
    conflictedEntities: conflictedEntities.count,
  };
}
