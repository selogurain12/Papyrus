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
import { PartService } from "../part/part.service";
import { ChapterService } from "../chapters/chapters.service";
import { ProjectService } from "../projects/projects.service";
import { CharacterService } from "../characters/characters.service";
import { ObjectService } from "../objects/objects.service";
import { PlaceService } from "../places/place.service";
import { NoteService } from "../notes/note.service";
import { ResearchService } from "../research/research.service";
import { EventService } from "../events/events.service";

type PdfBlock = {
  type: "h1" | "h2" | "h3" | "p";
  text: string;
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
    eventService: EventService
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

  private noteBox(value: unknown): string {
    const text = this.text(value);

    if (text === "Non spécifié") {
      return "";
    }

    return `<div class="note-box">${text}</div>`;
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
          font-family: Georgia, serif;
          color: #1f2937;
          line-height: 1.75;
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

        .export-card {
          margin-bottom: 42px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .export-title {
          font-size: 30px;
          margin: 0;
          color: #111827;
        }

        .export-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-top: 8px;
          margin-bottom: 26px;
          font-style: italic;
        }

        .export-section {
          margin-top: 30px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .export-section h3 {
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #111827;
          margin-bottom: 14px;
          padding-bottom: 6px;
          border-bottom: 1px solid #d1d5db;
        }

        .fields {
          margin-left: 4px;
        }

        .field {
          margin-bottom: 8px;
        }

        .field-label {
          font-weight: bold;
          color: #111827;
        }

        .field-value {
          color: #374151;
        }

        .badge {
          display: inline-block;
          border: 1px solid #d1d5db;
          border-radius: 999px;
          padding: 2px 9px;
          margin-right: 5px;
          margin-bottom: 4px;
          font-size: 12px;
          color: #374151;
        }

        .note-box {
          margin-top: 8px;
          color: #374151;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .chapter-content {
          text-align: justify;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .page-break {
          page-break-before: always;
          break-before: page;
        }
      </style>
    `;
  }

  public async chaptersInHtml(projectId: string): Promise<{ title: string; content: string }[]> {
    const parts = await this.partService.getAll({ disablePagination: true }, projectId);
    const content: { title: string; content: string }[] = [];

    for (const part of parts.data) {
      content.push({
        title: part.title,
        content: `
          ${this.exportStyle()}
          <h1 class="page-break">${this.text(part.title)}</h1>
        `,
      });

      const chapters = await this.chapterService.getByPart(part.id, projectId);

      for (const chapter of chapters.data) {
        content.push({
          title: chapter.title,
          content: `
            ${this.exportStyle()}
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

  public async charactersInHtml(projectId: string): Promise<{ title: string; content: string }[]> {
    const characters = await this.charactersService.getAll({ disablePagination: true }, projectId);

    return characters.data.map((chara) => {
      const stars = "★★★★★".slice(0, chara.roleStar) + "☆☆☆☆☆".slice(chara.roleStar);

      return {
        title: `${chara.firstName} ${chara.lastName}`,
        content: `
          ${this.exportStyle()}

          <div class="export-card">
            <h1 class="export-title">${this.text(chara.firstName)} ${this.text(chara.lastName)}</h1>
            <p class="export-subtitle">${this.text(chara.age)} ans — ${this.text(chara.birthPlace)} — Rôle : ${stars}</p>

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
                ${this.field("Qualités", this.badges(chara.characterQualities))}
                ${this.field("Défauts", this.badges(chara.characterFlaws))}
                ${this.field("Goûts", chara.tastes)}
                ${this.field("Tics", chara.tics)}
                ${this.field("Peurs", chara.fears)}
              `)
            )}

            ${this.section(
              "Profil",
              this.fields(`
                ${this.field("Éducation", chara.education)}
                ${this.field("Richesses", chara.richesses)}
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

  public async placeInHtml(projectId: string): Promise<{ title: string; content: string }[]> {
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
          <p class="export-subtitle">${this.text(typeMap[place.type])} — Importance ${this.text(importanceMap[place.narrativeImportance])}</p>

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

  public async objectsInHtml(projectId: string): Promise<{ title: string; content: string }[]> {
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
          <p class="export-subtitle">${object.type ? this.text(typeMap[object.type]) : "Non spécifié"} — Importance ${this.text(importanceMap[object.importance])}</p>

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

  public async noteInHtml(projectId: string): Promise<{ title: string; content: string }[]> {
    const notes = await this.notesService.getAll({ disablePagination: true }, projectId);

    return notes.data.map((note) => ({
      title: note.title,
      content: `
        ${this.exportStyle()}

        <div class="export-card">
          <h1 class="export-title">${this.text(note.title)}</h1>
          <p class="export-subtitle">${note.linkFile ? `Fichier joint : ${this.text(note.linkFile)}` : "Aucun fichier joint"}</p>

          ${this.section("Tags", `<p>${this.badges(note.tags)}</p>`)}
          ${this.section("Contenu", this.noteBox(note.content))}
        </div>
      `,
    }));
  }

  public async researchInHtml(projectId: string): Promise<{ title: string; content: string }[]> {
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
          <p class="export-subtitle">${this.text(typeLabels[research.type])}</p>

          ${this.section(
            "Informations",
            this.fields(`
              ${this.field("Type", typeLabels[research.type])}
              ${this.field("Source", research.sources)}
              ${this.field("Lien", research.link)}
            `)
          )}

          ${this.section("Description", this.noteBox(research.description))}
          ${this.section("Tags", `<p>${this.badges(research.tag)}</p>`)}
          ${this.section("Note", this.noteBox(research.note))}
        </div>
      `,
    }));
  }

  public async eventInHtml(projectId: string): Promise<{ title: string; content: string }[]> {
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
            ${
              event.eventDate
                ? new Date(event.eventDate).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "Date inconnue"
            } — ${this.text(importanceMap[event.importance ?? "normal"])}
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
  ): Promise<{ title: string; content: string }[]> {
    const content: { title: string; content: string }[] = [];

    content.push(...(await this.chaptersInHtml(projectId)));

    if (filter.characters) {
      content.push(...(await this.charactersInHtml(projectId)));
    }

    if (filter.places) {
      content.push(...(await this.placeInHtml(projectId)));
    }

    if (filter.objects) {
      content.push(...(await this.objectsInHtml(projectId)));
    }

    if (filter.events) {
      content.push(...(await this.eventInHtml(projectId)));
    }

    if (filter.notes) {
      content.push(...(await this.noteInHtml(projectId)));
    }

    if (filter.researchs) {
      content.push(...(await this.researchInHtml(projectId)));
    }

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
        // eslint-disable-next-line prettier/prettier
        .replace(/&quot;/gu, "\"")
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

    doc.moveTo(startX, y).lineTo(endX, y).lineWidth(0.5).strokeColor("#d1d5db").stroke();

    doc.moveDown(0.8);
  }

  private writeBlock(doc: PDFKit.PDFDocument, block: PdfBlock): void {
    if (block.type === "h1") {
      this.ensureSpace(doc, 120);

      doc.moveDown(1);
      doc.font("Times-Bold").fontSize(24).fillColor("#111827").text(block.text, {
        align: "center",
      });
      doc.moveDown(1.2);

      return;
    }

    if (block.type === "h2") {
      this.ensureSpace(doc, 90);

      doc.moveDown(0.8);
      doc.font("Times-Bold").fontSize(19).fillColor("#111827").text(block.text);
      doc.moveDown(0.6);

      return;
    }

    if (block.type === "h3") {
      this.ensureSpace(doc, 80);

      doc.moveDown(1);
      doc.font("Times-Bold").fontSize(12).fillColor("#111827").text(block.text.toUpperCase(), {
        characterSpacing: 1,
      });
      this.writeDivider(doc);

      return;
    }

    this.ensureSpace(doc, 50);

    doc.font("Times-Roman").fontSize(12).fillColor("#374151").text(block.text, {
      align: "justify",
      lineGap: 4,
    });

    doc.moveDown(0.5);
  }

  private writeHtmlToPdf(doc: PDFKit.PDFDocument, html: string): void {
    const blocks = this.getHtmlBlocks(html);

    for (const block of blocks) {
      this.writeBlock(doc, block);
    }
  }

  private async generatePdf(
    title: string,
    content: { title: string; content: string }[]
  ): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 72, right: 72 },
        bufferPages: true,
      });

      const stream = new PassThrough();
      const chunks: Uint8Array[] = [];

      doc.pipe(stream);

      doc.font("Times-Bold").fontSize(28).fillColor("#111827").text(title, {
        align: "center",
      });

      doc.moveDown(2);

      for (const [index, item] of content.entries()) {
        if (index > 0) {
          doc.addPage();
        }

        this.writeHtmlToPdf(doc, item.content);
      }

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
          spacing: { before: 360, after: 240 },
          alignment: AlignmentType.CENTER,
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
              color: "111827",
            }),
          ],
          spacing: { before: 280, after: 160 },
        });
      }

      return new Paragraph({
        children: [
          new TextRun({
            text: block.text,
            size: 24,
            color: "374151",
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 160 },
      });
    });
  }

  private generateDocx(
    title: string,
    content: { title: string; content: string }[]
  ): Promise<Buffer> {
    const children: Paragraph[] = [
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
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

      children.push(...this.htmlBlocksToDocxParagraphs(item.content));
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

    return {
      fileName: `${project.title}.docx`,
      buffer,
    };
  }

  private generateTxt(title: string, content: { title: string; content: string }[]): Buffer {
    const lines: string[] = [];

    lines.push(title.toUpperCase());
    lines.push("=".repeat(title.length));
    lines.push("");

    for (const item of content) {
      const blocks = this.getHtmlBlocks(item.content);

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

    return {
      fileName: `${project.title}.txt`,
      buffer,
    };
  }
}
