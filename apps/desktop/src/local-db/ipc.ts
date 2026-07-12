import { ipcMain } from "electron";

import {
  enqueueOperation,
  getEntity,
  getStats,
  listEntities,
  listPendingOperations,
  markOperationFailed,
  markOperationSynced,
  removeEntity,
  saveEntity,
} from "./repository";

let isRegistered = false;

export function registerLocalDatabaseIpc(): void {
  if (isRegistered) {
    return;
  }

  ipcMain.handle("local-db:save-entity", (_event, input) => saveEntity(input));
  ipcMain.handle("local-db:list-entities", (_event, filter) => listEntities(filter));
  ipcMain.handle("local-db:get-entity", (_event, input) =>
    getEntity(input.entityType as string, input.id as string)
  );
  ipcMain.handle("local-db:remove-entity", (_event, input) => removeEntity(input));
  ipcMain.handle("local-db:enqueue-operation", (_event, input) => enqueueOperation(input));
  ipcMain.handle("local-db:list-pending-operations", () => listPendingOperations());
  ipcMain.handle("local-db:mark-operation-synced", (_event, id) =>
    markOperationSynced(id as string)
  );
  ipcMain.handle("local-db:mark-operation-failed", (_event, input) => markOperationFailed(input));
  ipcMain.handle("local-db:get-stats", () => getStats());

  isRegistered = true;
}
