import { Migration } from '@mikro-orm/migrations';

export class Migration20260305125820 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "place_entity" add column "color" varchar(255) not null;`);
    this.addSql(`alter table "place_entity" alter column "type" type varchar(255) using ("type"::varchar(255));`);
    this.addSql(`alter table "place_entity" alter column "narrative_importance" type varchar(255) using ("narrative_importance"::varchar(255));`);
    this.addSql(`alter table "place_entity" alter column "narrative_importance" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "place_entity" drop column "color";`);

    this.addSql(`alter table "place_entity" alter column "type" type text[] using ("type"::text[]);`);
    this.addSql(`alter table "place_entity" alter column "narrative_importance" type varchar(255) using ("narrative_importance"::varchar(255));`);
    this.addSql(`alter table "place_entity" alter column "narrative_importance" drop not null;`);
  }

}
