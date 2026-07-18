/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { Migration } from "@mikro-orm/migrations";

export class Migration20260718124545 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      do $$
      begin
        if exists (
          select 1
          from information_schema.columns
          where table_name = 'character_entity'
            and column_name = 'richesses'
        ) and not exists (
          select 1
          from information_schema.columns
          where table_name = 'character_entity'
            and column_name = 'class'
        ) then
          alter table "character_entity" rename column "richesses" to "class";
        end if;
      end $$;
    `);

    this.addSql("alter table \"character_entity\" add column if not exists \"class\" varchar(255) null;");

    this.addSql(
      "alter table \"character_entity\" alter column \"class\" type varchar(255) using \"class\"::text;"
    );
  }

  override async down(): Promise<void> {
    this.addSql(`
      do $$
      begin
        if exists (
          select 1
          from information_schema.columns
          where table_name = 'character_entity'
            and column_name = 'class'
        ) and not exists (
          select 1
          from information_schema.columns
          where table_name = 'character_entity'
            and column_name = 'richesses'
        ) then
          alter table "character_entity" rename column "class" to "richesses";
        end if;
      end $$;
    `);

    this.addSql("alter table \"character_entity\" add column if not exists \"richesses\" int4 null;");

    this.addSql(
      "alter table \"character_entity\" alter column \"richesses\" type int4 using nullif(\"richesses\"::text, '')::int4;"
    );
  }
}
