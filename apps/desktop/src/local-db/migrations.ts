import type { Database } from "better-sqlite3";

interface Migration {
  id: number;
  name: string;
  // eslint-disable-next-line no-unused-vars
  up(database: Database): void;
}

const migrations: Migration[] = [
  {
    id: 1,
    name: "create_offline_store",
    up(database) {
      database.exec(`
        create table if not exists local_entities (
          entity_type text not null,
          id text not null,
          server_id text,
          project_id text,
          payload text not null,
          sync_status text not null default 'synced',
          deleted_at text,
          created_at text not null,
          updated_at text not null,
          last_synced_at text,
          primary key (entity_type, id),
          check (sync_status in ('synced', 'pending', 'conflict'))
        );

        create index if not exists local_entities_entity_type_idx
          on local_entities (entity_type);

        create index if not exists local_entities_project_id_idx
          on local_entities (project_id);

        create index if not exists local_entities_sync_status_idx
          on local_entities (sync_status);

        create table if not exists sync_queue (
          id text primary key,
          entity_type text not null,
          entity_id text not null,
          operation text not null,
          payload text not null,
          created_at text not null,
          updated_at text not null,
          retry_count integer not null default 0,
          last_error text,
          check (operation in ('create', 'update', 'delete'))
        );

        create index if not exists sync_queue_created_at_idx
          on sync_queue (created_at);
      `);
    },
  },
];

export function runMigrations(database: Database): void {
  database.exec(`
    create table if not exists local_database_migrations (
      id integer primary key,
      name text not null,
      applied_at text not null
    );
  `);

  const appliedIds = new Set(
    database
      .prepare("select id from local_database_migrations")
      .all()
      .map((row) => (row as { id: number }).id)
  );

  const applyMigration = database.transaction((migration: Migration) => {
    migration.up(database);

    if (!appliedIds.has(migration.id)) {
      database
        .prepare("insert into local_database_migrations (id, name, applied_at) values (?, ?, ?)")
        .run(migration.id, migration.name, new Date().toISOString());
    }
  });

  migrations.forEach((migration) => applyMigration(migration));
}
