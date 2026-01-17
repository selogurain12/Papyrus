import { Migration } from '@mikro-orm/migrations';

export class Migration20260117164126 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "setting_entity" ("id" uuid not null, "language" varchar(255) not null default 'fr', "auto_save" boolean not null default true, "auto_save_interval" int not null default 5, "daily_word_count_goal" int not null default 1000, "theme" varchar(255) not null default 'light', "font_size" varchar(255) not null default 'medium', "font_family" varchar(255) not null default 'system', "enable_notifications" boolean not null default true, "daily_reminder" boolean not null default true, "goal_reminder" boolean not null default true, "backup_reminder" boolean not null default true, "enable_auto_backup" boolean not null default true, "backup_frequency" varchar(255) not null default 'daily', "export_format" varchar(255) not null default 'json', "show_statistics" boolean not null default true, "track_writing_time" boolean not null default true, "save_history" boolean not null default true, constraint "setting_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "user_entity" ("id" uuid not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, constraint "user_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "project_entity" ("id" uuid not null, "title" varchar(255) not null, "description" varchar(255) null, "genre" varchar(255) not null, "target_word_count" int not null default 10000, "current_word_count" int not null default 0, "status" varchar(255) not null default 'planning', "author" varchar(255) not null, "language" varchar(255) not null default 'fr', "deadline" timestamp(6) with time zone null, "settings_id" uuid not null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "user_id" uuid not null, constraint "project_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "research_entity" ("id" uuid not null, "title" varchar(255) not null, "content" text null, "type" varchar(255) not null, "sources" varchar(255) null, "tag" text[] null, "note" varchar(255) null, "link" varchar(255) null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "project_id" uuid not null, constraint "research_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "place_entity" ("id" uuid not null, "name" varchar(255) not null, "nickname" varchar(255) null, "type" text[] not null, "localisation" text not null, "physical_description" varchar(255) null, "atmosphere" text null, "history" text null, "population" text null, "usages" text null, "language" varchar(255) null, "government" varchar(255) null, "ressources" varchar(255) null, "narrative_importance" varchar(255) null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "project_id" uuid not null, constraint "place_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "part_entity" ("id" uuid not null, "title" varchar(255) not null, "status" varchar(255) not null default 'toStart ', "project_id" uuid not null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, constraint "part_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "object_entity" ("id" uuid not null, "name" varchar(255) not null, "importance" varchar(255) null, "description" text null, "appearance" text null, "significance" text null, "location" text null, "type" varchar(255) null, "history" text null, "color" varchar(255) null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "project_id" uuid not null, constraint "object_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "note_entity" ("id" uuid not null, "title" varchar(255) not null, "content" text null, "tags" text[] null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "project_id" uuid not null, constraint "note_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "mindmap_entity" ("id" uuid not null, "title" varchar(255) not null, "type" text not null, "project_id" uuid not null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, constraint "mindmap_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "event_entity" ("id" uuid not null, "title" varchar(255) not null, "description" varchar(255) null, "importance" varchar(255) null, "location" varchar(255) null, "additional_details" text null, "event_date" timestamp(6) with time zone not null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "project_id" uuid not null, constraint "event_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "character_entity" ("id" uuid not null, "name" varchar(255) not null, "role" varchar(255) not null, "description" varchar(255) null, "age" int null, "appearance" varchar(255) null, "personality" varchar(255) null, "story" varchar(255) null, "motivation" varchar(255) null, "color" varchar(255) null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "project_id" uuid not null, constraint "character_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "relationship_entity" ("id" uuid not null, "parent_relation_id" uuid not null, "child_relation_id" uuid not null, "type" varchar(255) not null, "project_id" uuid not null, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, constraint "relationship_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "chapter_entity" ("id" uuid not null, "title" varchar(255) not null, "status" varchar(255) not null default 'toStart ', "content" text null, "resume" text null, "chapter_number" int not null, "word_count" int not null default 0, "word_goal" int not null default 500, "created_at" timestamp(6) with time zone not null, "updated_at" timestamp(6) with time zone null, "deleted_at" timestamp(6) with time zone null, "project_id" uuid not null, "part_id" uuid not null, constraint "chapter_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "architecture_entity" ("id" uuid not null, "first_idea" text null, "plan" text null, "environnement" text null, "project_id" uuid not null, constraint "architecture_entity_pkey" primary key ("id"));`);

    this.addSql(`alter table "project_entity" add constraint "project_entity_settings_id_foreign" foreign key ("settings_id") references "setting_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "project_entity" add constraint "project_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);

    this.addSql(`alter table "research_entity" add constraint "research_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "place_entity" add constraint "place_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "part_entity" add constraint "part_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "object_entity" add constraint "object_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "note_entity" add constraint "note_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "mindmap_entity" add constraint "mindmap_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "event_entity" add constraint "event_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "character_entity" add constraint "character_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "relationship_entity" add constraint "relationship_entity_parent_relation_id_foreign" foreign key ("parent_relation_id") references "character_entity" ("id") on update cascade;`);
    this.addSql(`alter table "relationship_entity" add constraint "relationship_entity_child_relation_id_foreign" foreign key ("child_relation_id") references "character_entity" ("id") on update cascade;`);
    this.addSql(`alter table "relationship_entity" add constraint "relationship_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);

    this.addSql(`alter table "chapter_entity" add constraint "chapter_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);
    this.addSql(`alter table "chapter_entity" add constraint "chapter_entity_part_id_foreign" foreign key ("part_id") references "part_entity" ("id") on update cascade;`);

    this.addSql(`alter table "architecture_entity" add constraint "architecture_entity_project_id_foreign" foreign key ("project_id") references "project_entity" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "project_entity" drop constraint "project_entity_settings_id_foreign";`);

    this.addSql(`alter table "project_entity" drop constraint "project_entity_user_id_foreign";`);

    this.addSql(`alter table "research_entity" drop constraint "research_entity_project_id_foreign";`);

    this.addSql(`alter table "place_entity" drop constraint "place_entity_project_id_foreign";`);

    this.addSql(`alter table "part_entity" drop constraint "part_entity_project_id_foreign";`);

    this.addSql(`alter table "object_entity" drop constraint "object_entity_project_id_foreign";`);

    this.addSql(`alter table "note_entity" drop constraint "note_entity_project_id_foreign";`);

    this.addSql(`alter table "mindmap_entity" drop constraint "mindmap_entity_project_id_foreign";`);

    this.addSql(`alter table "event_entity" drop constraint "event_entity_project_id_foreign";`);

    this.addSql(`alter table "character_entity" drop constraint "character_entity_project_id_foreign";`);

    this.addSql(`alter table "relationship_entity" drop constraint "relationship_entity_project_id_foreign";`);

    this.addSql(`alter table "chapter_entity" drop constraint "chapter_entity_project_id_foreign";`);

    this.addSql(`alter table "architecture_entity" drop constraint "architecture_entity_project_id_foreign";`);

    this.addSql(`alter table "chapter_entity" drop constraint "chapter_entity_part_id_foreign";`);

    this.addSql(`alter table "relationship_entity" drop constraint "relationship_entity_parent_relation_id_foreign";`);

    this.addSql(`alter table "relationship_entity" drop constraint "relationship_entity_child_relation_id_foreign";`);

    this.addSql(`drop table if exists "setting_entity" cascade;`);

    this.addSql(`drop table if exists "user_entity" cascade;`);

    this.addSql(`drop table if exists "project_entity" cascade;`);

    this.addSql(`drop table if exists "research_entity" cascade;`);

    this.addSql(`drop table if exists "place_entity" cascade;`);

    this.addSql(`drop table if exists "part_entity" cascade;`);

    this.addSql(`drop table if exists "object_entity" cascade;`);

    this.addSql(`drop table if exists "note_entity" cascade;`);

    this.addSql(`drop table if exists "mindmap_entity" cascade;`);

    this.addSql(`drop table if exists "event_entity" cascade;`);

    this.addSql(`drop table if exists "character_entity" cascade;`);

    this.addSql(`drop table if exists "relationship_entity" cascade;`);

    this.addSql(`drop table if exists "chapter_entity" cascade;`);

    this.addSql(`drop table if exists "architecture_entity" cascade;`);
  }

}
