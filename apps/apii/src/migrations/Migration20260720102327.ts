/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
import { Migration } from "@mikro-orm/migrations";

export class Migration20260720102327 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      "alter table \"project_entity\" add column if not exists \"cover_link\" varchar(255) null;"
    );
  }

  override async down(): Promise<void> {
    this.addSql("alter table \"project_entity\" drop column if exists \"cover_link\";");
  }
}
