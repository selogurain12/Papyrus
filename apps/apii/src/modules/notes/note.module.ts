import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { NoteEntity } from "./note.entity";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";
import { NoteMapper } from "./note.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([NoteEntity]), ProjectModule],
  controllers: [NoteController],
  providers: [NoteService, NoteMapper],
  exports: [NoteService, NoteMapper],
})
export class NoteModule {}
