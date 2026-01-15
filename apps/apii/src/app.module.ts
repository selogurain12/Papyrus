import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ArchitectureModule } from "./modules/architecture/architecture.module";
import { AuthentificationModule } from "./modules/authentification/authentification.module";
import { ChapterModule } from "./modules/chapters/chapters.module";
import { CharacterModule } from "./modules/characters/characters.module";
import { MindmapModule } from "./modules/mindmaps/mindmap.module";
import { NoteModule } from "./modules/notes/note.module";
import { ObjectModule } from "./modules/objects/objects.module";
import { PartModule } from "./modules/part/part.module";
import { PlaceModule } from "./modules/places/place.module";
import { ProjectModule } from "./modules/projects/projects.module";
import { RelationshipModule } from "./modules/relationships/relationship.module";
import { ResearchModule } from "./modules/research/research.module";
import { SettingModule } from "./modules/settings/settings.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({
      entities: ["./dist/**/*.entity.js"],
      entitiesTs: ["./src/**/*.entity.ts"],
      dbName: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.DBHOST,
      port: Number(process.env.PGPORT),
      debug: true,
      driver: PostgreSqlDriver,
      allowGlobalContext: true,
    }),
    ArchitectureModule,
    AuthentificationModule,
    ChapterModule,
    CharacterModule,
    // EventModule,
    MindmapModule,
    NoteModule,
    ObjectModule,
    PartModule,
    PlaceModule,
    ProjectModule,
    RelationshipModule,
    ResearchModule,
    SettingModule,
    UsersModule,
  ],
})
export class AppModule {}
