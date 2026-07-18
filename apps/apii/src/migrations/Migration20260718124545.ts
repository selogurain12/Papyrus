/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { Migration } from "@mikro-orm/migrations";

export class Migration20260718124545 extends Migration {
  override async up(): Promise<void> {
    this.addSql("alter table \"character_entity\" drop column \"richesses\";");

    this.addSql("alter table \"character_entity\" add column \"class\" varchar(255) null;");
  }

  override async down(): Promise<void> {
    this.addSql("alter table \"character_entity\" drop column \"class\";");

    this.addSql("alter table \"character_entity\" add column \"richesses\" int4 null;");
  }
}
