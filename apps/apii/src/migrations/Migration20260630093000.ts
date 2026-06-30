/* eslint-disable quotes */
import { Migration } from "@mikro-orm/migrations";

export class Migration20260630093000 extends Migration {
  public override up(): void {
    this.addSql(
      'alter table if exists "setting_entity" ' +
        'add column if not exists "compact_mode" boolean not null default false;'
    );
    this.addSql(
      'alter table if exists "setting_entity" ' +
        'add column if not exists "show_line_numbers" boolean not null default false;'
    );
    this.addSql(
      'alter table if exists "setting_entity" ' +
        'add column if not exists "focus_mode" boolean not null default true;'
    );
    this.addSql(
      'alter table if exists "setting_entity" ' +
        'add column if not exists "spellcheck" boolean not null default true;'
    );
    this.addSql(
      'alter table if exists "setting_entity" ' +
        "add column if not exists \"shortcuts\" jsonb not null default '[]'::jsonb;"
    );
  }

  public override down(): void {
    this.addSql('alter table if exists "setting_entity" drop column if exists "shortcuts";');
    this.addSql('alter table if exists "setting_entity" drop column if exists "spellcheck";');
    this.addSql('alter table if exists "setting_entity" drop column if exists "focus_mode";');
    this.addSql(
      'alter table if exists "setting_entity" drop column if exists "show_line_numbers";'
    );
    this.addSql('alter table if exists "setting_entity" drop column if exists "compact_mode";');
  }
}
