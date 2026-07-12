// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

import type {
  LocalDatabaseApi,
  LocalEntityInput,
  LocalEntityListFilter,
  LocalEntityRemoveInput,
  QueueOperationInput,
  SyncQueueUpdateInput,
} from "./local-db/types";

const localDatabaseApi: LocalDatabaseApi = {
  saveEntity: (input: LocalEntityInput) => ipcRenderer.invoke("local-db:save-entity", input),
  listEntities: (filter: LocalEntityListFilter) =>
    ipcRenderer.invoke("local-db:list-entities", filter),
  getEntity: (entityType: string, id: string) =>
    ipcRenderer.invoke("local-db:get-entity", { entityType, id }),
  removeEntity: (input: LocalEntityRemoveInput) =>
    ipcRenderer.invoke("local-db:remove-entity", input),
  enqueueOperation: (input: QueueOperationInput) =>
    ipcRenderer.invoke("local-db:enqueue-operation", input),
  listPendingOperations: () => ipcRenderer.invoke("local-db:list-pending-operations"),
  markOperationSynced: (id: string) => ipcRenderer.invoke("local-db:mark-operation-synced", id),
  markOperationFailed: (input: SyncQueueUpdateInput) =>
    ipcRenderer.invoke("local-db:mark-operation-failed", input),
  getStats: () => ipcRenderer.invoke("local-db:get-stats"),
};

const localFileApi = {
  saveFile: (input: { name: string; data: ArrayBuffer }): Promise<string> =>
    ipcRenderer.invoke("local-file:save", input),
  readFileAsDataUrl: (url: string): Promise<string> =>
    ipcRenderer.invoke("local-file:read-data-url", url),
};

contextBridge.exposeInMainWorld("papyrusLocalDb", localDatabaseApi);
contextBridge.exposeInMainWorld("papyrusLocalFile", localFileApi);
