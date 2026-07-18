/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable quotes */
import { Migration } from "@mikro-orm/migrations";

export class Migration20260718184101 extends Migration {
  override async up(): Promise<void> {
    this.addSql('alter table "event_entity" add column "chapter_id" uuid null;');
    this.addSql(
      "alter table \"event_entity\" add constraint \"event_entity_chapter_id_foreign\" foreign key (\"chapter_id\") references \"chapter_entity\" (\"id\") on update cascade on delete cascade;"
    );
  }

  override async down(): Promise<void> {
    this.addSql('alter table "event_entity" drop constraint "event_entity_chapter_id_foreign";');

    this.addSql('alter table "event_entity" drop column "chapter_id";');
  }
}
