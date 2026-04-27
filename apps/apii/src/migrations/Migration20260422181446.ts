import { Migration } from '@mikro-orm/migrations';

export class Migration20260422181446 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "note_entity" add column "link_file" text null, add column "color" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "note_entity" drop column "link_file", drop column "color";`);
  }

}
