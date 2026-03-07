import { Migration } from '@mikro-orm/migrations';

export class Migration20260223185007 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "character_entity" drop column "appearance", drop column "personality", drop column "story", drop column "motivation";`);

    this.addSql(`alter table "character_entity" add column "role_star" int not null, add column "last_name" varchar(255) not null, add column "nick_name" varchar(255) not null, add column "pronouns" varchar(255) not null, add column "gender" varchar(255) not null, add column "nationality" varchar(255) not null, add column "birth_date" timestamp(6) with time zone null, add column "birth_place" varchar(255) not null, add column "residence_place" varchar(255) not null, add column "occupation" varchar(255) not null, add column "height" int not null, add column "weight" int not null, add column "corpulence" varchar(255) not null, add column "hair_color" varchar(255) not null, add column "eyes_color" varchar(255) not null, add column "voice" varchar(255) not null, add column "outfit" varchar(255) not null, add column "accessory" varchar(255) not null, add column "character_qualities" text[] not null, add column "character_flaws" text[] not null, add column "tastes" varchar(255) not null, add column "tics" varchar(255) not null, add column "fears" varchar(255) not null, add column "education" varchar(255) not null, add column "richesses" int not null, add column "belief" varchar(255) not null, add column "secrets" varchar(255) not null, add column "notable_places" varchar(255) not null, add column "typical_expression" varchar(255) not null, add column "goals" varchar(255) not null, add column "past" varchar(255) not null, add column "present" varchar(255) not null, add column "future" varchar(255) not null, add column "notes" text not null;`);
    this.addSql(`alter table "character_entity" rename column "name" to "first_name";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "character_entity" drop column "role_star", drop column "last_name", drop column "nick_name", drop column "pronouns", drop column "gender", drop column "nationality", drop column "birth_date", drop column "birth_place", drop column "residence_place", drop column "occupation", drop column "height", drop column "weight", drop column "corpulence", drop column "hair_color", drop column "eyes_color", drop column "voice", drop column "outfit", drop column "accessory", drop column "character_qualities", drop column "character_flaws", drop column "tastes", drop column "tics", drop column "fears", drop column "education", drop column "richesses", drop column "belief", drop column "secrets", drop column "notable_places", drop column "typical_expression", drop column "goals", drop column "past", drop column "present", drop column "future", drop column "notes";`);

    this.addSql(`alter table "character_entity" add column "appearance" varchar(255) null, add column "personality" varchar(255) null, add column "story" varchar(255) null, add column "motivation" varchar(255) null;`);
    this.addSql(`alter table "character_entity" rename column "first_name" to "name";`);
  }

}
