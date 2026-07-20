/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines */
/* eslint-disable max-params */
/* eslint-disable max-len */
import * as path from "path";
import * as fs from "fs";

import { PassThrough } from "stream";
import { MikroORM } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import EpubCreator from "epub-gen-memory";
import PDFDocument from "pdfkit";
import {
  AlignmentType,
  Document as WordDocument,
  HeadingLevel,
  Packer,
  PageBreak,
  Paragraph,
  TextRun,
} from "docx";

import { ExportParamsDto } from "packages/source/src/dtos/export.dto";
import { now } from "@internationalized/date";
import { PartService } from "../part/part.service";
import { ChapterService } from "../chapters/chapters.service";
import { ProjectService } from "../projects/projects.service";
import { CharacterService } from "../characters/characters.service";
import { ObjectService } from "../objects/objects.service";
import { PlaceService } from "../places/place.service";
import { NoteService } from "../notes/note.service";
import { ResearchService } from "../research/research.service";
import { EventService } from "../events/events.service";
import { HistoryService } from "../history/history.service";

type PdfBlock = {
  type: "h1" | "h2" | "h3" | "p";
  text: string;
};

type ExportContentKind = "content" | "section-cover" | "manuscript-toc";

type ExportContent = {
  title: string;
  content: string;
  kind?: ExportContentKind;
};

@Injectable()
export class ExportService {
  private readonly outputDir = path.join(process.cwd(), "exports");
  private readonly orm: MikroORM;
  private readonly projectService: ProjectService;
  private readonly partService: PartService;
  private readonly chapterService: ChapterService;
  private readonly charactersService: CharacterService;
  private readonly objectsService: ObjectService;
  private readonly placesService: PlaceService;
  private readonly notesService: NoteService;
  private readonly researchsService: ResearchService;
  private readonly eventsService: EventService;
  private readonly historyService: HistoryService;

  public constructor(
    orm: MikroORM,
    projectService: ProjectService,
    partService: PartService,
    chapterService: ChapterService,
    chararacterService: CharacterService,
    objectService: ObjectService,
    placeService: PlaceService,
    noteService: NoteService,
    researchService: ResearchService,
    eventService: EventService,
    historyService: HistoryService
  ) {
    this.orm = orm;
    this.projectService = projectService;
    this.partService = partService;
    this.chapterService = chapterService;
    this.charactersService = chararacterService;
    this.objectsService = objectService;
    this.placesService = placeService;
    this.notesService = noteService;
    this.researchsService = researchService;
    this.eventsService = eventService;
    this.historyService = historyService;

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  private escapeHtml(value: unknown): string {
    if (value === null || value === undefined) {
      return "Non spécifié";
    }

    const text =
      typeof value === "string"
        ? value
        : typeof value === "number"
          ? String(value)
          : typeof value === "boolean"
            ? String(value)
            : "Non spécifié";

    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private text(value: unknown): string {
    const content = this.escapeHtml(value);

    return content.trim() === "" ? "Non spécifié" : content;
  }

  private badges(values: string[] | null): string {
    if (!values || values.length === 0) {
      return "Non spécifié";
    }

    return values.map((value) => `<span class="badge">${this.escapeHtml(value)}</span>`).join("");
  }

  private meta(label: string, value: unknown): string {
    const text = this.text(value);

    if (text === "Non spécifié") {
      return "";
    }

    return `<span class="export-meta">${this.escapeHtml(label)} : ${text}</span>`;
  }

  private field(label: string, value: unknown): string {
    const text = this.text(value);

    if (text === "Non spécifié") {
      return "";
    }

    return `
      <p class="field">
        <span class="field-label">${this.escapeHtml(label)} :</span>
        <span class="field-value">${text}</span>
      </p>
    `;
  }

  private badgeField(label: string, values: string[] | null): string {
    if (!values || values.length === 0) {
      return "";
    }

    return `
      <div class="field">
        <span class="field-label">${this.escapeHtml(label)} :</span>
        <span class="field-value">${this.badges(values)}</span>
      </div>
    `;
  }

  private fields(content: string): string {
    return `
      <div class="fields">
        ${content}
      </div>
    `;
  }

  private section(title: string, content: string): string {
    return `
      <section class="export-section">
        <h3>${this.escapeHtml(title)}</h3>
        ${content}
      </section>
    `;
  }

  private sectionCover(
    title: string,
    description: string,
    count: number,
    label = "éléments"
  ): ExportContent {
    return {
      title,
      kind: "section-cover",
      content: `
        ${this.exportStyle()}

        <section class="section-cover">
          <p class="section-kicker">Section</p>
          <h1 class="section-title">${this.escapeHtml(title)}</h1>
          <p class="section-description">${this.escapeHtml(description)}</p>
          <p class="section-count">${count} ${this.escapeHtml(label)}</p>
        </section>
      `,
    };
  }

  private async appendExportSection(
    content: ExportContent[],
    enabled: boolean,
    config: {
      title: string;
      description: string;
      singularLabel: string;
      pluralLabel: string;
      load: () => Promise<ExportContent[]>;
    }
  ): Promise<void> {
    if (!enabled) {
      return;
    }

    const items = await config.load();

    content.push(
      this.sectionCover(
        config.title,
        config.description,
        items.length,
        items.length > 1 ? config.pluralLabel : config.singularLabel
      )
    );
    content.push(...items);
  }

  private noteBox(value: unknown): string {
    const text = this.text(value);

    if (text === "Non spécifié") {
      return "";
    }

    return `<div class="note-box"><p>${text}</p></div>`;
  }

  private tocEmpty(text: string): string {
    return `<p class="toc-empty">${this.escapeHtml(text)}</p>`;
  }

  private async manuscriptTocInHtml(projectId: string): Promise<ExportContent> {
    const parts = await this.partService.getAll({ disablePagination: true }, projectId);
    const rows: string[] = [];
    const emptyToc = this.tocEmpty("Aucune partie disponible");

    for (const [partIndex, part] of parts.data.entries()) {
      rows.push(`<p class="toc-part">${partIndex + 1}. ${this.text(part.title)}</p>`);

      const chapters = await this.chapterService.getByPart(part.id, projectId);

      if (chapters.data.length === 0) {
        rows.push(`<p class="toc-empty">${partIndex + 1}.0 Aucun chapitre</p>`);
      }

      for (const [chapterIndex, chapter] of chapters.data.entries()) {
        rows.push(
          `<p class="toc-chapter">${partIndex + 1}.${chapterIndex + 1} ${this.text(chapter.title)}</p>`
        );
      }
    }

    return {
      title: "Sommaire du manuscrit",
      kind: "manuscript-toc",
      content: `
        ${this.exportStyle()}

        <section class="manuscript-toc">
          <p class="section-kicker">Sommaire</p>
          <h1 class="section-title">Sommaire du manuscrit</h1>
          <p class="section-description">Repères des parties et chapitres exportés.</p>
          <div class="toc-list">
            ${rows.length > 0 ? rows.join("") : emptyToc}
          </div>
        </section>
      `,
    };
  }

  private lexicalToPlainText(value: unknown): string {
    if (typeof value !== "string") {
      return this.text(value);
    }

    try {
      const parsed = JSON.parse(value) as {
        root?: {
          children?: {
            children?: {
              text?: string;
            }[];
          }[];
        };
      };

      const paragraphs =
        parsed.root?.children?.map((child) =>
          child.children?.map((textNode) => textNode.text ?? "").join("")
        ) ?? [];

      return paragraphs
        .filter(Boolean)
        .map((paragraph) => `<p>${this.escapeHtml(paragraph)}</p>`)
        .join("");
    } catch {
      return this.text(value);
    }
  }

  private exportStyle(): string {
    return `
      <style>
        body {
          font-family: Arial, Helvetica, sans-serif;
          color: #1f2937;
          line-height: 1.6;
          background: #ffffff;
          max-width: 760px;
          margin: 0 auto;
        }

        h1, h2, h3 {
          page-break-after: avoid;
          break-after: avoid;
        }

        p {
          margin: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        body > h1:first-child {
          display: none;
        }

        .section-cover {
          min-height: 62vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          page-break-before: always;
          break-before: page;
          border-left: 4px solid #2563eb;
          padding: 40px 0 40px 28px;
        }

        .section-kicker {
          margin-bottom: 18px;
          color: #2563eb;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .section-title {
          margin: 0;
          font-size: 38px;
          line-height: 1.15;
          color: #0f172a;
        }

        .section-description {
          max-width: 620px;
          margin-top: 18px;
          color: #4b5563;
          font-size: 16px;
          font-style: italic;
        }

        .section-count {
          margin-top: 28px;
          color: #6b7280;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .export-card {
          margin: 0 0 38px 0;
          padding: 0 0 22px 0;
          border-bottom: 1px solid #e5e7eb;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .export-title {
          font-size: 30px;
          margin: 0;
          color: #0f172a;
          line-height: 1.2;
        }

        .export-subtitle {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
          margin-bottom: 24px;
          color: #64748b;
        }

        .export-section {
          margin-top: 24px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .export-section h3 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #334155;
          margin-bottom: 12px;
          padding-bottom: 7px;
          border-bottom: 1px solid #e2e8f0;
        }

        .fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 10px 18px;
        }

        .field {
          margin: 0;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: bold;
          color: #64748b;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .field-value {
          display: block;
          margin-top: 2px;
          color: #1f2937;
        }

        .badge {
          display: inline-block;
          border: 1px solid #cbd5e1;
          border-radius: 999px;
          padding: 2px 8px;
          margin-right: 4px;
          margin-bottom: 5px;
          font-size: 12px;
          color: #334155;
          background: #f8fafc;
        }

        .export-meta {
          display: inline-block;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 12px;
          background: #f8fafc;
        }

        .note-box {
          margin-top: 8px;
          padding: 12px 14px;
          border-left: 3px solid #cbd5e1;
          background: #f9fafb;
          color: #1f2937;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .manuscript-toc {
          min-height: 62vh;
          page-break-before: always;
          break-before: page;
          padding: 40px 0;
        }

        .toc-list {
          margin-top: 34px;
          padding-top: 18px;
          border-top: 1px solid #bfdbfe;
        }

        .toc-part {
          margin-top: 18px;
          color: #111827;
          font-weight: bold;
          font-size: 16px;
        }

        .toc-chapter {
          margin-top: 7px;
          margin-left: 24px;
          color: #475569;
          font-size: 13px;
        }

        .toc-empty {
          margin-top: 7px;
          margin-left: 24px;
          color: #94a3b8;
          font-style: italic;
          font-size: 13px;
        }

        .part-cover {
          min-height: 45vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 4px solid #7c3aed;
          padding-left: 28px;
        }

        .chapter-content {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.05em;
          text-align: justify;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .chapter-content p {
          margin: 0 0 1em 0;
        }

        .page-break {
          page-break-before: always;
          break-before: page;
        }
      </style>
    `;
  }

  public async chaptersInHtml(projectId: string): Promise<ExportContent[]> {
    const parts = await this.partService.getAll({ disablePagination: true }, projectId);
    const content: ExportContent[] = [];

    for (const part of parts.data) {
      content.push({
        title: part.title,
        content: `
          ${this.exportStyle()}
          <section class="part-cover page-break">
            <p class="section-kicker">Partie</p>
            <h1 class="section-title">${this.text(part.title)}</h1>
          </section>
        `,
      });

      const chapters = await this.chapterService.getByPart(part.id, projectId);

      for (const chapter of chapters.data) {
        content.push({
          title: chapter.title,
          content: `
            ${this.exportStyle()}
            <p class="section-kicker">Chapitre</p>
            <h2>${this.text(chapter.title)}</h2>
            <div class="chapter-content">
              ${this.lexicalToPlainText(chapter.content ?? "")}
            </div>
          `,
        });
      }
    }

    return content;
  }

  public async charactersInHtml(projectId: string): Promise<ExportContent[]> {
    const characters = await this.charactersService.getAll({ disablePagination: true }, projectId);

    return characters.data.map((chara) => {
      const stars = "★★★★★".slice(0, chara.roleStar) + "☆☆☆☆☆".slice(chara.roleStar);

      return {
        title: `${chara.firstName} ${chara.lastName}`,
        content: `
          ${this.exportStyle()}

          <div class="export-card">
            <h1 class="export-title">${this.text(chara.firstName)} ${this.text(chara.lastName)}</h1>
            <p class="export-subtitle">
              ${this.meta("Âge", chara.age ? `${chara.age} ans` : undefined)}
              ${this.meta("Naissance", chara.birthPlace)}
              ${this.meta("Rôle", stars)}
            </p>

            ${this.section(
              "État civil",
              this.fields(`
                ${this.field("Prénom", chara.firstName)}
                ${this.field("Nom", chara.lastName)}
                ${this.field("Surnom", chara.nickName)}
                ${this.field("Pronoms", chara.pronouns)}
                ${this.field("Genre", chara.gender)}
                ${this.field("Nationalité", chara.nationality)}
                ${this.field("Date de naissance", chara.birthDate)}
                ${this.field("Lieu de naissance", chara.birthPlace)}
                ${this.field("Résidence", chara.residencePlace)}
                ${this.field("Occupation", chara.occupation)}
              `)
            )}

            ${this.section(
              "Physique",
              this.fields(`
                ${this.field("Taille", chara.height ? `${chara.height} cm` : undefined)}
                ${this.field("Poids", chara.weight ? `${chara.weight} kg` : undefined)}
                ${this.field("Corpulence", chara.corpulence)}
                ${this.field("Cheveux", chara.hairColor)}
                ${this.field("Yeux", chara.eyesColor)}
                ${this.field("Voix", chara.voice)}
                ${this.field("Tenue", chara.outfit)}
                ${this.field("Accessoire", chara.accessory)}
                ${this.field("Description", chara.description)}
              `)
            )}

            ${this.section(
              "Caractère",
              this.fields(`
                ${this.badgeField("Qualités", chara.characterQualities)}
                ${this.badgeField("Défauts", chara.characterFlaws)}
                ${this.field("Goûts", chara.tastes)}
                ${this.field("Tics", chara.tics)}
                ${this.field("Peurs", chara.fears)}
              `)
            )}

            ${this.section(
              "Profil",
              this.fields(`
                ${this.field("Éducation", chara.education)}
                ${this.field("Classe sociale", chara.class)}
                ${this.field("Croyances", chara.belief)}
                ${this.field("Secrets", chara.secrets)}
                ${this.field("Lieux notables", chara.notablePlaces)}
                ${this.field("Expression typique", chara.typicalExpression)}
              `)
            )}

            ${this.section(
              "Évolution",
              this.fields(`
                ${this.field("Objectifs", chara.goals)}
                ${this.field("Passé", chara.past)}
                ${this.field("Présent", chara.present)}
                ${this.field("Futur", chara.future)}
              `)
            )}

            ${this.section("Autre", this.fields(this.field("Notes", chara.notes)))}
          </div>
        `,
      };
    });
  }

  public async placeInHtml(projectId: string): Promise<ExportContent[]> {
    const places = await this.placesService.getAll({ disablePagination: true }, projectId);

    const typeMap: Record<string, string> = {
      city: "Ville",
      village: "Village",
      country: "Pays",
      continent: "Continent",
      building: "Bâtiment",
      naturalFeature: "Caractéristique naturelle",
      other: "Autre",
    };

    const importanceMap: Record<string, string> = {
      high: "Élevée",
      medium: "Moyenne",
      low: "Basse",
    };

    return places.data.map((place) => ({
      title: place.name,
      content: `
        ${this.exportStyle()}

        <div class="export-card">
          <h1 class="export-title">${this.text(place.name)}</h1>
          <p class="export-subtitle">
            ${this.meta("Type", typeMap[place.type])}
            ${this.meta("Importance", importanceMap[place.narrativeImportance])}
            ${this.meta("Localisation", place.localisation)}
          </p>

          ${this.section(
            "Informations générales",
            this.fields(`
              ${this.field("Type", typeMap[place.type])}
              ${this.field("Importance", importanceMap[place.narrativeImportance])}
              ${this.field("Localisation", place.localisation)}
              ${this.field("Langue", place.language)}
              ${this.field("Gouvernement", place.government)}
              ${this.field("Population", place.population)}
              ${this.field("Ressources", place.ressources)}
            `)
          )}

          ${this.section(
            "Description",
            this.fields(`
              ${this.field("Description physique", place.physicalDescription)}
              ${this.field("Atmosphère", place.atmosphere)}
              ${this.field("Usages", place.usages)}
            `)
          )}

          ${this.section("Histoire", this.noteBox(place.history))}
        </div>
      `,
    }));
  }

  public async objectsInHtml(projectId: string): Promise<ExportContent[]> {
    const objects = await this.objectsService.getAll({ disablePagination: true }, projectId);

    const typeMap: Record<string, string> = {
      weapon: "Arme",
      vehicle: "Véhicule",
      artifact: "Artefact",
      tool: "Outil",
      clothing: "Vêtement",
      jewelry: "Bijou",
      furniture: "Meuble",
      technology: "Technologie",
      paper: "Document",
      equipment: "Équipement",
    };

    const importanceMap: Record<string, string> = {
      high: "Élevée",
      medium: "Moyenne",
      low: "Basse",
    };

    return objects.data.map((object) => ({
      title: object.name,
      content: `
        ${this.exportStyle()}

        <div class="export-card">
          <h1 class="export-title">${this.text(object.name)}</h1>
          <p class="export-subtitle">
            ${this.meta("Type", object.type ? typeMap[object.type] : undefined)}
            ${this.meta("Importance", importanceMap[object.importance])}
            ${this.meta("Localisation", object.location)}
          </p>

          ${this.section(
            "Informations générales",
            this.fields(`
              ${this.field("Type", object.type ? typeMap[object.type] : "Non spécifié")}
              ${this.field("Importance", importanceMap[object.importance])}
              ${this.field("Localisation", object.location)}
            `)
          )}

          ${this.section(
            "Description",
            this.fields(`
              ${this.field("Description", object.description)}
              ${this.field("Apparence", object.appearance)}
              ${this.field("Signification", object.significance)}
            `)
          )}

          ${this.section("Histoire", this.noteBox(object.history))}
        </div>
      `,
    }));
  }

  public async noteInHtml(projectId: string): Promise<ExportContent[]> {
    const notes = await this.notesService.getAll({ disablePagination: true }, projectId);

    return notes.data.map((note) => ({
      title: note.title,
      content: `
        ${this.exportStyle()}

        <div class="export-card">
          <h1 class="export-title">${this.text(note.title)}</h1>
          <p class="export-subtitle">
            ${this.meta("Fichier joint", note.linkFile)}
          </p>

          ${this.section("Tags", `<div class="fields">${this.badgeField("Tags", note.tags)}</div>`)}
          ${this.section("Contenu", this.noteBox(note.content))}
        </div>
      `,
    }));
  }

  public async researchInHtml(projectId: string): Promise<ExportContent[]> {
    const researchs = await this.researchsService.getAll({ disablePagination: true }, projectId);

    const typeLabels: Record<string, string> = {
      articles: "Articles",
      links: "Liens web",
      images: "Images",
      videos: "Vidéos",
      books: "Livres",
      all: "Autre",
    };

    return researchs.data.map((research) => ({
      title: research.title,
      content: `
        ${this.exportStyle()}

        <div class="export-card">
          <h1 class="export-title">${this.text(research.title)}</h1>
          <p class="export-subtitle">
            ${this.meta("Type", typeLabels[research.type])}
            ${this.meta("Source", research.sources)}
          </p>

          ${this.section(
            "Informations",
            this.fields(`
              ${this.field("Type", typeLabels[research.type])}
              ${this.field("Source", research.sources)}
              ${this.field("Lien", research.link)}
            `)
          )}

          ${this.section("Description", this.noteBox(research.description))}
          ${this.section("Tags", `<div class="fields">${this.badgeField("Tags", research.tag)}</div>`)}
          ${this.section("Note", this.noteBox(research.note))}
        </div>
      `,
    }));
  }

  public async eventInHtml(projectId: string): Promise<ExportContent[]> {
    const events = await this.eventsService.getAll({ disablePagination: true }, projectId);

    const importanceMap: Record<string, string> = {
      critical: "Critique",
      important: "Importante",
      action: "Action",
      normal: "Normale",
    };

    return events.data.map((event) => ({
      title: event.title,
      content: `
        ${this.exportStyle()}

        <div class="export-card">
          <h1 class="export-title">${this.text(event.title)}</h1>
          <p class="export-subtitle">
            ${this.meta(
              "Date",
              event.eventDate
                ? new Date(event.eventDate).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : undefined
            )}
            ${this.meta("Importance", importanceMap[event.importance ?? "normal"])}
            ${this.meta("Lieu", event.location)}
          </p>

          ${this.section(
            "Informations",
            this.fields(`
              ${this.field("Date", event.eventDate ? new Date(event.eventDate).toLocaleDateString("fr-FR") : "Date inconnue")}
              ${this.field("Importance", importanceMap[event.importance ?? "normal"])}
              ${this.field("Lieu", event.location)}
            `)
          )}

          ${this.section("Description", this.noteBox(event.description))}
          ${this.section("Notes supplémentaires", this.noteBox(event.additionalDetails))}
        </div>
      `,
    }));
  }

  private async getExportContent(
    projectId: string,
    filter: ExportParamsDto
  ): Promise<ExportContent[]> {
    const content: ExportContent[] = [];
    const manuscript = await this.chaptersInHtml(projectId);

    content.push(
      this.sectionCover(
        "Manuscrit",
        "Les parties et chapitres du projet sont présentés dans leur ordre narratif.",
        manuscript.length,
        manuscript.length > 1 ? "entrées" : "entrée"
      )
    );
    content.push(await this.manuscriptTocInHtml(projectId));
    content.push(...manuscript);

    await this.appendExportSection(content, Boolean(filter.characters), {
      title: "Personnages",
      description: "Vous trouverez ensuite les fiches détaillées des personnages de l'export.",
      singularLabel: "personnage",
      pluralLabel: "personnages",
      load: () => this.charactersInHtml(projectId),
    });

    await this.appendExportSection(content, Boolean(filter.places), {
      title: "Lieux",
      description: "Cette partie rassemble les lieux, leur atmosphère et leur importance.",
      singularLabel: "lieu",
      pluralLabel: "lieux",
      load: () => this.placeInHtml(projectId),
    });

    await this.appendExportSection(content, Boolean(filter.objects), {
      title: "Objets",
      description: "Les objets importants du récit sont listés avec leur rôle et leur histoire.",
      singularLabel: "objet",
      pluralLabel: "objets",
      load: () => this.objectsInHtml(projectId),
    });

    await this.appendExportSection(content, Boolean(filter.events), {
      title: "Chronologie",
      description: "Les événements du projet sont présentés avec leurs dates, lieux et détails.",
      singularLabel: "événement",
      pluralLabel: "événements",
      load: () => this.eventInHtml(projectId),
    });

    await this.appendExportSection(content, Boolean(filter.notes), {
      title: "Notes",
      description: "Cette section regroupe les notes de travail et les documents attachés.",
      singularLabel: "note",
      pluralLabel: "notes",
      load: () => this.noteInHtml(projectId),
    });

    await this.appendExportSection(content, Boolean(filter.researchs), {
      title: "Recherches",
      description: "Les sources, références et pistes documentaires sont regroupées ici.",
      singularLabel: "recherche",
      pluralLabel: "recherches",
      load: () => this.researchInHtml(projectId),
    });

    return content;
  }

  public async exportEpub(
    projectId: string,
    userId: string,
    filter: ExportParamsDto
  ): Promise<{ fileName: string; buffer: Buffer }> {
    const project = await this.projectService.get(projectId, userId);
    const content = await this.getExportContent(projectId, filter);

    const epubBuffer = await EpubCreator(
      {
        title: project.title,
        author: project.author,
        description: project.description ?? "",
        lang: project.language,
        date: new Date().toISOString(),
      },
      content
    );

    await this.historyService.create(
      {
        type: "create",
        entity: "export",
        date: now("UTC").toString(),
        title: "Généréation au format epub",
        project,
      },
      projectId
    );

    return {
      fileName: `${project.title}.epub`,
      buffer: epubBuffer,
    };
  }

  private decodeHtml(value: string): string {
    return (
      value
        .replace(/&amp;/gu, "&")
        .replace(/&lt;/gu, "<")
        .replace(/&gt;/gu, ">")

        // eslint-disable-next-line quotes
        .replace(/&quot;/gu, '"')
        .replace(/&#039;/gu, "'")
        .replace(/&nbsp;/gu, " ")
    );
  }

  private stripHtml(value: string): string {
    return this.decodeHtml(
      value
        .replace(/<style[\s\S]*?<\/style>/gu, "")
        .replace(/<[^>]+>/gu, "")
        .replace(/\s+/gu, " ")
        .trim()
    );
  }

  private getHtmlBlocks(html: string): PdfBlock[] {
    const blocks: PdfBlock[] = [];
    const cleanHtml = html.replace(/<style[\s\S]*?<\/style>/gu, "");
    const regex = /<(h1|h2|h3|p)[^>]*>([\s\S]*?)<\/\1>/giu;

    for (const match of cleanHtml.matchAll(regex)) {
      const tag = match[1].toLowerCase() as PdfBlock["type"];
      const text = this.stripHtml(match[2]);

      if (text.trim() !== "") {
        blocks.push({ type: tag, text });
      }
    }

    if (blocks.length === 0) {
      const text = this.stripHtml(cleanHtml);

      if (text.trim() !== "") {
        blocks.push({ type: "p", text });
      }
    }

    return blocks;
  }

  private ensureSpace(doc: PDFKit.PDFDocument, height = 80): void {
    const maxY = doc.page.height - doc.page.margins.bottom;

    if (doc.y + height >= maxY) {
      doc.addPage();
    }
  }

  private writeDivider(doc: PDFKit.PDFDocument): void {
    const startX = doc.page.margins.left;
    const endX = doc.page.width - doc.page.margins.right;
    const y = doc.y + 4;

    doc.moveTo(startX, y).lineTo(endX, y).lineWidth(0.5).strokeColor("#e2e8f0").stroke();

    doc.moveDown(0.8);
  }

  private writePdfTitlePage(doc: PDFKit.PDFDocument, title: string): void {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const left = doc.page.margins.left;
    const right = pageWidth - doc.page.margins.right;

    doc.rect(0, 0, pageWidth, pageHeight).fill("#ffffff");
    doc.rect(left, 150, 4, 170).fill("#2563eb");
    doc
      .fillColor("#0f172a")
      .font("Helvetica-Bold")
      .fontSize(32)
      .text(title, left + 24, 164, {
        width: right - left - 24,
        align: "left",
        lineGap: 4,
      });
    doc
      .moveDown(0.8)
      .font("Helvetica")
      .fontSize(13)
      .fillColor("#475569")
      .text("Dossier exporté depuis Papyrus", {
        width: right - left - 24,
      });
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#64748b")
      .text(new Date().toLocaleDateString("fr-FR"), left + 24, pageHeight - 120);
  }

  private writePdfPageNumbers(doc: PDFKit.PDFDocument): void {
    const range = doc.bufferedPageRange();

    for (let index = range.start; index < range.start + range.count; index += 1) {
      doc.switchToPage(index);

      const pageNumber = index + 1;
      const y = doc.page.height - 36;

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#94a3b8")
        .text(String(pageNumber), doc.page.margins.left, y, {
          align: "center",
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        });
    }
  }

  private writePdfSectionCover(doc: PDFKit.PDFDocument, item: ExportContent): void {
    const blocks = this.getHtmlBlocks(item.content);
    const title = blocks.find((block) => block.type === "h1")?.text ?? item.title;
    const description = blocks.find(
      (block) => block.text !== title && block.text !== "Section"
    )?.text;
    const count = blocks.at(-1)?.text;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const left = doc.page.margins.left;
    const right = pageWidth - doc.page.margins.right;

    doc.rect(0, 0, pageWidth, pageHeight).fill("#ffffff");
    doc.rect(left, 142, 4, 210).fill("#2563eb");
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#2563eb")
      .text("SECTION", left + 24, 152, {
        characterSpacing: 2,
        width: right - left - 24,
      });
    doc
      .font("Helvetica-Bold")
      .fontSize(32)
      .fillColor("#0f172a")
      .text(title, left + 24, 180, {
        width: right - left - 24,
        lineGap: 4,
      });

    if (description) {
      doc
        .moveDown(0.8)
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#475569")
        .text(description, {
          width: right - left - 24,
          lineGap: 3,
        });
    }

    if (count && count !== description) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#64748b")
        .text(count.toUpperCase(), left + 24, 360, {
          characterSpacing: 1,
          width: right - left - 24,
        });
    }
  }

  private writePdfTocBlock(doc: PDFKit.PDFDocument, block: PdfBlock): void {
    const isPart = /^\d+\./u.test(block.text) && !/^\d+\.\d+/u.test(block.text);

    this.ensureSpace(doc, 36);
    doc
      .font(isPart ? "Helvetica-Bold" : "Helvetica")
      .fontSize(isPart ? 13 : 11)
      .fillColor(isPart ? "#111827" : "#475569")
      .text(block.text, {
        indent: isPart ? 0 : 20,
        lineGap: 2,
      });
    doc.moveDown(isPart ? 0.5 : 0.25);
  }

  private writePdfManuscriptToc(doc: PDFKit.PDFDocument, item: ExportContent): void {
    const blocks = this.getHtmlBlocks(item.content);

    for (const block of blocks) {
      if (block.type === "h1") {
        doc.font("Helvetica-Bold").fontSize(28).fillColor("#0f172a").text(block.text);
        doc.moveDown(0.4);
      } else if (block.text === "Sommaire") {
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor("#2563eb")
          .text(block.text.toUpperCase(), {
            characterSpacing: 2,
          });
        doc.moveDown(0.4);
      } else if (block.text.startsWith("Repères")) {
        doc.font("Helvetica").fontSize(12).fillColor("#64748b").text(block.text);
        doc.moveDown(1);
      } else {
        this.writePdfTocBlock(doc, block);
      }
    }
  }

  private writeBlock(doc: PDFKit.PDFDocument, block: PdfBlock): void {
    if (block.type === "h1") {
      this.ensureSpace(doc, 120);

      doc.moveDown(1);
      doc.font("Helvetica-Bold").fontSize(26).fillColor("#0f172a").text(block.text, {
        align: "left",
        lineGap: 3,
      });
      doc.moveDown(0.8);

      return;
    }

    if (block.type === "h2") {
      this.ensureSpace(doc, 90);

      doc.moveDown(0.8);
      doc.font("Times-Bold").fontSize(20).fillColor("#0f172a").text(block.text);
      doc.moveDown(0.6);

      return;
    }

    if (block.type === "h3") {
      this.ensureSpace(doc, 80);

      doc.moveDown(1);
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#334155").text(block.text.toUpperCase(), {
        characterSpacing: 1,
      });
      this.writeDivider(doc);

      return;
    }

    this.ensureSpace(doc, 50);

    doc.font("Helvetica").fontSize(11).fillColor("#334155").text(block.text, {
      align: "justify",
      lineGap: 3,
    });

    doc.moveDown(0.5);
  }

  private writeHtmlToPdf(doc: PDFKit.PDFDocument, html: string): void {
    const blocks = this.getHtmlBlocks(html);

    for (const block of blocks) {
      this.writeBlock(doc, block);
    }
  }

  private writeExportContentToPdf(doc: PDFKit.PDFDocument, item: ExportContent): void {
    if (item.kind === "section-cover") {
      this.writePdfSectionCover(doc, item);
      return;
    }

    if (item.kind === "manuscript-toc") {
      this.writePdfManuscriptToc(doc, item);
      return;
    }

    this.writeHtmlToPdf(doc, item.content);
  }

  private async generatePdf(title: string, content: ExportContent[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 72, right: 72 },
        bufferPages: true,
      });

      const stream = new PassThrough();
      const chunks: Uint8Array[] = [];

      doc.pipe(stream);

      this.writePdfTitlePage(doc, title);

      for (const item of content) {
        doc.addPage();

        this.writeExportContentToPdf(doc, item);
      }

      this.writePdfPageNumbers(doc);
      doc.end();

      stream.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      stream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  public async exportPdf(
    projectId: string,
    userId: string,
    query: ExportParamsDto
  ): Promise<{ fileName: string; buffer: Buffer }> {
    const project = await this.projectService.get(projectId, userId);
    const content = await this.getExportContent(projectId, query);
    const buffer = await this.generatePdf(project.title, content);

    await this.historyService.create(
      {
        type: "create",
        entity: "export",
        date: now("UTC").toString(),
        title: "Généréation au format pdf",
        project,
      },
      projectId
    );

    return {
      fileName: `${project.title}.pdf`,
      buffer,
    };
  }

  private htmlBlocksToDocxParagraphs(html: string): Paragraph[] {
    const blocks = this.getHtmlBlocks(html);

    return blocks.map((block) => {
      if (block.type === "h1") {
        return new Paragraph({
          text: block.text,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 360, after: 220 },
          alignment: AlignmentType.LEFT,
        });
      }

      if (block.type === "h2") {
        return new Paragraph({
          text: block.text,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 180 },
        });
      }

      if (block.type === "h3") {
        return new Paragraph({
          children: [
            new TextRun({
              text: block.text.toUpperCase(),
              bold: true,
              size: 24,
              color: "334155",
            }),
          ],
          spacing: { before: 260, after: 140 },
        });
      }

      return new Paragraph({
        children: [
          new TextRun({
            text: block.text,
            size: 23,
            color: "334155",
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 140 },
      });
    });
  }

  private sectionCoverToDocxParagraphs(item: ExportContent): Paragraph[] {
    const blocks = this.getHtmlBlocks(item.content);
    const title = blocks.find((block) => block.type === "h1")?.text ?? item.title;
    const paragraphs = blocks.filter((block) => block.type === "p" && block.text !== "Section");

    return [
      new Paragraph({
        children: [
          new TextRun({
            text: "SECTION",
            bold: true,
            color: "2563EB",
            size: 20,
          }),
        ],
        spacing: { before: 1200, after: 240 },
      }),
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 300 },
      }),
      ...paragraphs.map(
        (block) =>
          new Paragraph({
            children: [
              new TextRun({
                text: block.text,
                italics: block !== paragraphs.at(-1),
                color: block === paragraphs.at(-1) ? "64748B" : "475569",
                size: block === paragraphs.at(-1) ? 22 : 26,
              }),
            ],
            spacing: { after: 180 },
          })
      ),
    ];
  }

  private exportContentToDocxParagraphs(item: ExportContent): Paragraph[] {
    if (item.kind === "section-cover") {
      return this.sectionCoverToDocxParagraphs(item);
    }

    return this.htmlBlocksToDocxParagraphs(item.content);
  }

  private generateDocx(title: string, content: ExportContent[]): Promise<Buffer> {
    const children: Paragraph[] = [
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.LEFT,
        spacing: { before: 1200, after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Dossier exporté depuis Papyrus",
            italics: true,
            color: "475569",
            size: 26,
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: { after: 720 },
      }),
    ];

    for (const [index, item] of content.entries()) {
      if (index > 0) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }

      children.push(...this.exportContentToDocxParagraphs(item));
    }

    const document = new WordDocument({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children,
        },
      ],
    });

    return Packer.toBuffer(document);
  }

  public async exportDocx(
    projectId: string,
    userId: string,
    query: ExportParamsDto
  ): Promise<{ fileName: string; buffer: Buffer }> {
    const project = await this.projectService.get(projectId, userId);
    const content = await this.getExportContent(projectId, query);
    const buffer = await this.generateDocx(project.title, content);

    await this.historyService.create(
      {
        type: "create",
        entity: "export",
        date: now("UTC").toString(),
        title: "Généréation au format docx",
        project,
      },
      projectId
    );

    return {
      fileName: `${project.title}.docx`,
      buffer,
    };
  }

  private generateTxt(title: string, content: ExportContent[]): Buffer {
    const lines: string[] = [];

    lines.push(title.toUpperCase());
    lines.push("=".repeat(title.length));
    lines.push("Dossier exporté depuis Papyrus");
    lines.push(new Date().toLocaleDateString("fr-FR"));
    lines.push("");

    for (const item of content) {
      const blocks = this.getHtmlBlocks(item.content);

      if (item.kind === "section-cover") {
        lines.push("");
        lines.push("##################################################");
        lines.push(item.title.toUpperCase());
        lines.push("##################################################");
        lines.push("");
      }

      for (const block of blocks) {
        if (block.type === "h1") {
          lines.push("");
          lines.push(block.text.toUpperCase());
          lines.push("=".repeat(block.text.length));
          lines.push("");
          continue;
        }

        if (block.type === "h2") {
          lines.push("");
          lines.push(block.text);
          lines.push("-".repeat(block.text.length));
          lines.push("");
          continue;
        }

        if (block.type === "h3") {
          lines.push("");
          lines.push(block.text.toUpperCase());
          lines.push("");
          continue;
        }

        lines.push(block.text);
        lines.push("");
      }

      lines.push("");
    }

    return Buffer.from(lines.join("\n"), "utf-8");
  }

  public async exportTxt(
    projectId: string,
    userId: string,
    query: ExportParamsDto
  ): Promise<{ fileName: string; buffer: Buffer }> {
    const project = await this.projectService.get(projectId, userId);
    const content = await this.getExportContent(projectId, query);
    const buffer = this.generateTxt(project.title, content);

    await this.historyService.create(
      {
        type: "create",
        entity: "export",
        date: now("UTC").toString(),
        title: "Généréation au format txt",
        project,
      },
      projectId
    );

    return {
      fileName: `${project.title}.txt`,
      buffer,
    };
  }
}
