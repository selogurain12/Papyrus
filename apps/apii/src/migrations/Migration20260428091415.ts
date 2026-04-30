import { Migration } from '@mikro-orm/migrations';

export class Migration20260428091415 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "structure_entity" ("id" uuid not null, "premise" text null, "genre" text null, "theme" text null, "structure" text null, "objectives" text[] null, constraint "structure_entity_pkey" primary key ("id"));`);

    this.addSql(`alter table "project_entity" add column "structure_id" uuid not null;`);
    this.addSql(`alter table "project_entity" add constraint "project_entity_structure_id_foreign" foreign key ("structure_id") references "structure_entity" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "project_entity" drop constraint "project_entity_structure_id_foreign";`);

    this.addSql(`drop table if exists "structure_entity" cascade;`);

    this.addSql(`alter table "project_entity" drop column "structure_id";`);
  }

}
