/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable quotes */
import { Migration } from "@mikro-orm/migrations";

export class Migration20260718184101 extends Migration {
  override async up(): Promise<void> {
    this.addSql('alter table "event_entity" add column if not exists "chapter_id" uuid null;');
    this.addSql(
      `do $$
      begin
        if not exists (
          select 1
          from information_schema.table_constraints
          where table_name = 'event_entity'
            and constraint_name = 'event_entity_chapter_id_foreign'
        ) then
          alter table "event_entity"
            add constraint "event_entity_chapter_id_foreign"
            foreign key ("chapter_id")
            references "chapter_entity" ("id")
            on update cascade
            on delete cascade;
        end if;
      end $$;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      'alter table "event_entity" drop constraint if exists "event_entity_chapter_id_foreign";'
    );

    this.addSql('alter table "event_entity" drop column if exists "chapter_id";');
  }
}
