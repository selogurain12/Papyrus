import type { LocalDatabaseApi, LocalEntity } from "../../../apps/desktop/src/local-db/types";
import {
  cacheEntityList,
  createOfflineEntity,
  deleteOfflineEntity,
  filterCachedList,
  getCachedEntityList,
  localEntityChangedEvent,
  notifyLocalEntityChanged,
  updateOfflineEntity,
} from "../../../apps/desktop/src/local-db/offline-entity-store";

const createEntity = (overrides: Partial<LocalEntity>): LocalEntity => ({
  createdAt: "2026-07-14T00:00:00.000Z",
  deletedAt: null,
  entityType: "characters",
  id: "local-id",
  lastSyncedAt: null,
  payload: { id: "local-id", title: "Ada" },
  projectId: "project-id",
  serverId: null,
  syncStatus: "pending",
  updatedAt: "2026-07-14T00:00:00.000Z",
  ...overrides,
});

const createLocalDb = (overrides: Partial<LocalDatabaseApi> = {}): LocalDatabaseApi => ({
  enqueueOperation: jest.fn(),
  getEntity: jest.fn(),
  getStats: jest.fn(),
  listEntities: jest.fn().mockResolvedValue([]),
  listPendingOperations: jest.fn(),
  markOperationFailed: jest.fn(),
  markOperationSynced: jest.fn(),
  removeEntity: jest.fn(),
  saveEntity: jest.fn(),
  ...overrides,
});

describe("offline entity store", () => {
  let localDb: LocalDatabaseApi;

  beforeEach(() => {
    localDb = createLocalDb();
    Object.defineProperty(window, "papyrusLocalDb", {
      configurable: true,
      value: localDb,
    });
  });

  it("dispatches a local change event for the given entity type", () => {
    const listener = jest.fn();
    window.addEventListener(localEntityChangedEvent, listener);

    notifyLocalEntityChanged("characters");

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({
      entityType: "characters",
    });
  });

  it("caches server data, preserves local research files and removes stale synced entries", async () => {
    const staleEntity = createEntity({
      id: "stale-id",
      serverId: "stale-id",
      syncStatus: "synced",
    });
    const pendingEntity = createEntity({
      id: "pending-id",
      serverId: null,
      syncStatus: "pending",
    });
    const existingResearch = createEntity({
      entityType: "research",
      id: "server-id",
      serverId: "server-id",
      payload: { id: "server-id", link: "file:///tmp/source.pdf", title: "Local" },
      syncStatus: "synced",
    });
    localDb.listEntities = jest.fn().mockResolvedValue([staleEntity, pendingEntity, existingResearch]);

    await cacheEntityList("research", "project-id", [
      { id: "server-id", link: null, title: "Server" },
    ]);

    expect(localDb.saveEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: "research",
        id: "server-id",
        payload: { id: "server-id", link: "file:///tmp/source.pdf", title: "Server" },
        serverId: "server-id",
        syncStatus: "synced",
      })
    );
    expect(localDb.removeEntity).toHaveBeenCalledWith({
      entityType: "research",
      id: "stale-id",
    });
    expect(localDb.removeEntity).not.toHaveBeenCalledWith({
      entityType: "research",
      id: "pending-id",
    });
  });

  it("reads and filters cached entities", async () => {
    localDb.listEntities = jest.fn().mockResolvedValue([
      createEntity({ payload: { id: "1", name: "Ada Lovelace" } }),
      createEntity({ id: "2", payload: { id: "2", name: "Grace Hopper" } }),
    ]);

    const cached = await getCachedEntityList<{ id: string; name: string }>(
      "characters",
      "project-id"
    );

    expect(cached.total).toBe(2);
    expect(filterCachedList(cached, "grace")).toEqual({
      data: [{ id: "2", name: "Grace Hopper" }],
      total: 1,
    });
    expect(filterCachedList(cached, "   ")).toBe(cached);
  });

  it("creates, updates and deletes offline entities", async () => {
    const listener = jest.fn();
    window.addEventListener(localEntityChangedEvent, listener);
    localDb.getEntity = jest.fn().mockResolvedValue(createEntity({ serverId: "server-id" }));

    const created = await createOfflineEntity<{ name: string }, { id: string; name: string }>(
      "characters",
      "project-id",
      { name: "Ada" }
    );
    const updated = await updateOfflineEntity(
      "characters",
      "project-id",
      created,
      { name: "Ada L." }
    );
    await deleteOfflineEntity("characters", created.id);

    expect(created.id).toEqual(expect.any(String));
    expect(updated).toEqual({ id: created.id, name: "Ada L." });
    expect(localDb.saveEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: "characters",
        operation: "create",
        payload: created,
      })
    );
    expect(localDb.saveEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: "characters",
        operation: "update",
        payload: updated,
        serverId: "server-id",
      })
    );
    expect(localDb.removeEntity).toHaveBeenCalledWith({
      entityType: "characters",
      id: created.id,
      operation: "delete",
    });
    expect(listener).toHaveBeenCalledTimes(3);
  });
});
