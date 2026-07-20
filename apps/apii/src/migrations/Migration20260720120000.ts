/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/require-await */
import { Migration } from "@mikro-orm/migrations";

export class Migration20260720120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql('alter table "character_entity" add column if not exists "avatar_link" text null;');
    this.addSql('alter table "object_entity" add column if not exists "avatar_link" text null;');
    this.addSql('alter table "place_entity" add column if not exists "avatar_link" text null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "character_entity" drop column if exists "avatar_link";');
    this.addSql('alter table "object_entity" drop column if exists "avatar_link";');
    this.addSql('alter table "place_entity" drop column if exists "avatar_link";');
  }
}
