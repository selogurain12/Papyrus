/* eslint-disable max-lines */
import { MikroORM } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { DashboardDto, dashboardContract } from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { fromDate } from "@internationalized/date";
import { ChapterEntity } from "../chapters/chapters.entity";
import { CharacterEntity } from "../characters/characters.entity";
import { ObjectEntity } from "../objects/objects.entity";
import { PlaceEntity } from "../places/place.entity";
import { ProjectEntity } from "../projects/projects.entity";

@Injectable()
export class DashboardService {
  private readonly orm: MikroORM;

  public constructor(orm: MikroORM) {
    this.orm = orm;
  }

  public async get(projectId: string): Promise<DashboardDto> {
    const em = this.orm.em.fork();
    const project = await em.getRepository(ProjectEntity).findOne({
      id: projectId,
      deletedAt: { $eq: null },
    });

    if (!project) {
      throw new TsRestException(dashboardContract.get, {
        status: 404,
        body: {
          error: "ProjectNotFound",
          message: `ProjectEntity with id ${projectId} not found`,
        },
      });
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const [
      charactersCount,
      placesCount,
      chaptersCount,
      inProgressChaptersCount,
      weeklyChaptersCount,
      recentPlacesCount,
      monthlyCharactersCount,
      todayChapters,
      chapters,
      developedCharactersCount,
      detailedPlacesCount,
    ] = await Promise.all([
      this.countByProject(CharacterEntity, projectId),
      this.countByProject(PlaceEntity, projectId),
      this.countByProject(ChapterEntity, projectId),
      em.count(ChapterEntity, {
        project: { id: projectId },
        deletedAt: { $eq: null },
        status: "inProgress",
      }),
      em.count(ChapterEntity, {
        project: { id: projectId },
        deletedAt: { $eq: null },
        createdAt: { $gte: fromDate(startOfWeek, "UTC") },
      }),
      em.count(PlaceEntity, {
        project: { id: projectId },
        deletedAt: { $eq: null },
        createdAt: { $gte: fromDate(startOfWeek, "UTC") },
      }),
      em.count(CharacterEntity, {
        project: { id: projectId },
        deletedAt: { $eq: null },
        createdAt: { $gte: fromDate(startOfWeek, "UTC") },
      }),
      em.find(ChapterEntity, {
        project: { id: projectId },
        deletedAt: { $eq: null },
        updatedAt: { $gte: fromDate(startOfToday, "UTC") },
      }),
      em.find(ChapterEntity, { project: { id: projectId }, deletedAt: { $eq: null } }),
      em.count(CharacterEntity, {
        project: { id: projectId },
        deletedAt: { $eq: null },
        $or: [
          { description: { $ne: null } },
          { goals: { $ne: null } },
          { past: { $ne: null } },
          { present: { $ne: null } },
          { future: { $ne: null } },
          { notes: { $ne: null } },
        ],
      }),
      em.count(PlaceEntity, {
        project: { id: projectId },
        deletedAt: { $eq: null },
        $or: [
          { physicalDescription: { $ne: null } },
          { atmosphere: { $ne: null } },
          { history: { $ne: null } },
          { population: { $ne: null } },
          { usages: { $ne: null } },
        ],
      }),
    ]);

    const wordsFromChapters = chapters.reduce((total, chapter) => total + chapter.wordCount, 0);
    const currentWordCount = Math.max(project.currentWordCount, wordsFromChapters);
    const targetWordCount = Math.max(project.targetWordCount, 1);
    const wordsToday = todayChapters.reduce((total, chapter) => total + chapter.wordCount, 0);

    return {
      summaryCards: [
        {
          label: "Mots écrits",
          value: this.formatNumber(currentWordCount),
          icon: "bookOpen",
          color: "blue",
          change: `${this.formatNumber(wordsToday)} aujourd'hui`,
        },
        {
          label: "Personnages",
          value: this.formatNumber(charactersCount),
          icon: "users",
          color: "purple",
          change: `+${monthlyCharactersCount} cette semaine`,
        },
        {
          label: "Lieux créés",
          value: this.formatNumber(placesCount),
          icon: "mapPin",
          color: "green",
          change: `+${recentPlacesCount} récemment`,
        },
        {
          label: "Chapitres",
          value: this.formatNumber(chaptersCount),
          icon: "calendar",
          color: "orange",
          change: `${inProgressChaptersCount} en cours`,
        },
      ],
      progress: [
        { label: "Mots aujourd'hui", value: wordsToday, target: 1500, color: "blue" },
        { label: "Chapitres cette semaine", value: weeklyChaptersCount, target: 3, color: "green" },
        {
          label: "Personnages développés",
          value: developedCharactersCount,
          target: Math.max(charactersCount, 1),
          color: "purple",
        },
        {
          label: "Lieux détaillés",
          value: detailedPlacesCount,
          target: Math.max(placesCount, 1),
          color: "orange",
        },
      ],
      writingStreak: {
        days: wordsToday > 0 ? 1 : 0,
        message:
          wordsToday > 0
            ? "Vous avez avancé aujourd'hui. Continuez sur cette lancée."
            : "Ajoutez ou mettez à jour un chapitre pour lancer la série d'écriture.",
        currentWordCount,
        targetWordCount,
        progress: this.getProgress(currentWordCount, targetWordCount),
      },
    };
  }

  private async countByProject(
    entity:
      | typeof CharacterEntity
      | typeof PlaceEntity
      | typeof ObjectEntity
      | typeof ChapterEntity,
    projectId: string
  ): Promise<number> {
    const em = this.orm.em.fork();
    return await em.count(entity, { project: { id: projectId }, deletedAt: { $eq: null } });
  }

  private getProgress(value: number, target: number): number {
    return Math.min(100, Math.round((value / Math.max(target, 1)) * 100));
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat("fr-FR").format(value);
  }

  private toDate(value?: { toDate?: () => Date; toString: () => string } | null): Date | null {
    if (!value) {
      return null;
    }
    if (typeof value.toDate === "function") {
      return value.toDate();
    }
    return new Date(value.toString());
  }

  private formatRelativeTime(date: Date): string {
    const diff = Date.now() - date.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));
    if (minutes < 1) {
      return "à l'instant";
    }
    if (minutes < 60) {
      return `il y a ${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `il y a ${hours} h`;
    }
    const days = Math.floor(hours / 24);
    return days === 1 ? "hier" : `il y a ${days} jours`;
  }

  private withArticle(label: string): string {
    if (["objet", "événement"].includes(label)) {
      return `de l'${label}`;
    }
    if (["note", "recherche", "partie"].includes(label)) {
      return `de la ${label}`;
    }
    return `du ${label}`;
  }
}
