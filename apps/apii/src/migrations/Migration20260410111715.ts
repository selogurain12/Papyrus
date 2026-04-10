import { Migration } from '@mikro-orm/migrations';

export class Migration20260410111715 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "research_entity" ("id" uuid not null, "title" varchar(255) not null, "content" text null, "type" varchar(255) not null, "sources" varchar(255) null, "tag" text[] null, "note" varchar(255) null, "link" text null, "description" varchar(255) null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "project_id" uuid not null, constraint "research_entity_pkey" primary key ("id"));`);

    this.addSql(`alter table "research_entity" add constraint "research_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "research_entity" cascade;`);
  }

}
