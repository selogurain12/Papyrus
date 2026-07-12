/* eslint-disable no-unused-vars */
export type SyncStatus = "synced" | "pending" | "conflict";

export type QueueOperation = "create" | "update" | "delete";

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface LocalEntity {
  entityType: string;
  id: string;
  serverId: string | null;
  projectId: string | null;
  payload: JsonValue;
  syncStatus: SyncStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt: string | null;
}

export interface LocalEntityInput {
  entityType: string;
  id?: string;
  serverId?: string | null;
  projectId?: string | null;
  payload: JsonValue;
  syncStatus?: SyncStatus;
  operation?: QueueOperation;
}

export interface LocalEntityListFilter {
  entityType: string;
  projectId?: string | null;
  includeDeleted?: boolean;
}

export interface LocalEntityRemoveInput {
  entityType: string;
  id: string;
  operation?: QueueOperation;
}

export interface QueueOperationInput {
  entityType: string;
  entityId: string;
  operation: QueueOperation;
  payload: JsonValue;
}

export interface SyncQueueItem {
  id: string;
  entityType: string;
  entityId: string;
  operation: QueueOperation;
  payload: JsonValue;
  createdAt: string;
  updatedAt: string;
  retryCount: number;
  lastError: string | null;
}

export interface SyncQueueUpdateInput {
  id: string;
  error: string;
}

export interface LocalDatabaseStats {
  pendingOperations: number;
  pendingEntities: number;
  conflictedEntities: number;
}

export interface LocalDatabaseApi {
  saveEntity(input: LocalEntityInput): Promise<LocalEntity>;
  listEntities(filter: LocalEntityListFilter): Promise<LocalEntity[]>;
  getEntity(entityType: string, id: string): Promise<LocalEntity | null>;
  removeEntity(input: LocalEntityRemoveInput): Promise<void>;
  enqueueOperation(input: QueueOperationInput): Promise<SyncQueueItem>;
  listPendingOperations(): Promise<SyncQueueItem[]>;
  markOperationSynced(id: string): Promise<void>;
  markOperationFailed(input: SyncQueueUpdateInput): Promise<void>;
  getStats(): Promise<LocalDatabaseStats>;
}
