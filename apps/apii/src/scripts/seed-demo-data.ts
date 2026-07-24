/* eslint-disable no-console */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { EntityManager } from "@mikro-orm/postgresql";
import { NestFactory } from "@nestjs/core";
import { parseZonedDateTime } from "@internationalized/date";
import * as bcrypt from "bcrypt";
import type { MindElixirData } from "@papyrus/source";
import { AppModule } from "../app.module";
import { ChapterEntity } from "../modules/chapters/chapters.entity";
import { CharacterEntity } from "../modules/characters/characters.entity";
import { EventEntity } from "../modules/events/events.entity";
import { GoalEntity } from "../modules/goals/goal.entity";
import { HistoryEntity } from "../modules/history/history.entity";
import { MindmapEntity } from "../modules/mindmaps/mindmap.entity";
import { NoteEntity } from "../modules/notes/note.entity";
import { ObjectEntity } from "../modules/objects/objects.entity";
import { PartEntity } from "../modules/part/part.entity";
import { PlaceEntity } from "../modules/places/place.entity";
import { ProjectEntity } from "../modules/projects/projects.entity";
import { RelationshipEntity } from "../modules/relationships/relationship.entity";
import { ResearchEntity } from "../modules/research/research.entity";
import { SettingEntity } from "../modules/settings/settings.entity";
import { StructureEntity } from "../modules/structure/structure.entity";
import { UserEntity } from "../modules/users/users.entity";
import { loadApiEnv } from "../utils/load-api-env";

loadApiEnv();

const demoEmail = "demo@papyrus.app";
const demoPassword = "PapyrusDemo2026!";

const richEditorContent = (paragraphs: string[]): string =>
  JSON.stringify({
    root: {
      children: paragraphs.map((text) => ({
        children: [
          { detail: 0, format: 0, mode: "normal", style: "", text, type: "text", version: 1 },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
        textFormat: 0,
        textStyle: "",
      })),
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });

const demoMindmap: MindElixirData = {
  nodeData: {
    id: "root",
    topic: "Les Brumes d'Aster",
    expanded: true,
    children: [
      {
        id: "characters",
        topic: "Personnages",
        expanded: true,
        children: [
          { id: "maelis", topic: "Maelis Orlan - archiviste" },
          { id: "kael", topic: "Kael Varyn - cartographe" },
          { id: "soren", topic: "Soren Vahl - antagoniste" },
        ],
      },
      {
        id: "places",
        topic: "Lieux",
        expanded: true,
        children: [
          { id: "aster", topic: "Aster, cité suspendue" },
          { id: "archives", topic: "Archives basses" },
          { id: "marais", topic: "Marais de Verre" },
        ],
      },
      {
        id: "themes",
        topic: "Thèmes",
        expanded: true,
        children: [
          { id: "memory", topic: "Mémoire collective" },
          { id: "truth", topic: "Vérité officielle" },
          { id: "family", topic: "Héritage familial" },
        ],
      },
    ],
  },
  direction: 2,
  arrows: [],
  summaries: [],
};

async function resetDemoUser(em: EntityManager) {
  await em.getConnection().execute(`
    delete from "relationship_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "event_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "goal_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "history_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "mindmap_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "note_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "object_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "place_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "research_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "chapter_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "part_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "character_entity"
    where "project_id" in (
      select "p"."id"
      from "project_entity" as "p"
      inner join "user_entity" as "u" on "u"."id" = "p"."user_id"
      where "u"."email" = '${demoEmail}'
    );

    delete from "project_entity"
    where "user_id" in (
      select "id" from "user_entity" where "email" = '${demoEmail}'
    );

    delete from "user_entity" where "email" = '${demoEmail}';
  `);
}

async function ensureDemoSchema(em: EntityManager) {
  await em.getConnection().execute(`
    alter table "character_entity" add column if not exists "avatar_link" text;
    alter table "object_entity" add column if not exists "avatar_link" text;
    alter table "place_entity" add column if not exists "avatar_link" text;
    alter table "project_entity" add column if not exists "cover_link" text;
    alter table "event_entity" add column if not exists "chapter_id" uuid;
  `);
}

async function createDemoData(em: EntityManager) {
  const user = new UserEntity({
    firstName: "Camille",
    lastName: "Demo",
    email: demoEmail,
    password: await bcrypt.hash(demoPassword, 10),
  });

  const settings = new SettingEntity();
  settings.language = "fr";
  settings.autoSave = true;
  settings.autoSaveInterval = 2;
  settings.dailyWordCountGoal = 1200;
  settings.compactMode = false;
  settings.enableNotifications = true;
  settings.exportFormat = "docx";

  const structure = new StructureEntity();
  structure.premise =
    "Dans une cité suspendue où les souvenirs sont archivés comme des livres, une jeune restauratrice découvre que l'histoire officielle de son peuple a été réécrite.";
  structure.genre = "Fantasy à mystère";
  structure.theme = "Mémoire, vérité, transmission et choix moral.";
  structure.structure =
    "Structure en trois actes : découverte de l'anomalie, enquête dans les archives interdites, révélation publique lors du solstice.";
  structure.objectives = [
    "Installer une atmosphère de cité verticale et fragile.",
    "Faire évoluer Maelis d'observatrice prudente à actrice du changement.",
    "Maintenir un mystère central jusqu'au troisième acte.",
  ];

  const project = new ProjectEntity({
    title: "Les Brumes d'Aster",
    description:
      "Roman de fantasy atmosphérique centré sur une cité suspendue, des archives vivantes et une héroïne qui remet en cause la mémoire officielle.",
    genre: "fantasy",
    targetWordCount: 85000,
    currentWordCount: 24680,
    status: "writing",
    author: "Camille Demo",
    language: "fr",
    deadline: parseZonedDateTime("2026-12-15T23:59:00+01:00[Europe/Paris]"),
    settings,
    structure,
    user,
    tags: ["fantasy", "mystère", "archives", "cité suspendue"],
    coverLink:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80",
  });

  const partOne = new PartEntity({
    title: "Acte I - Les archives fissurées",
    status: "inProgress",
    project,
  });
  const partTwo = new PartEntity({
    title: "Acte II - La cité sous les brumes",
    status: "toStart",
    project,
  });
  const partThree = new PartEntity({
    title: "Acte III - Le solstice des vérités",
    status: "toStart",
    project,
  });

  const chapterOne = new ChapterEntity({
    title: "Chapitre 1 - La reliure impossible",
    status: "completed",
    content: richEditorContent([
      "La cloche de verre sonna trois fois au-dessus d'Aster, et chaque vibration fit trembler les rayonnages de l'atelier.",
      "Maelis Orlan posa sa lame de restauration sur la table. Le livre qu'elle réparait venait de changer de titre sous ses yeux.",
      "À la place du registre attendu, une phrase s'était imprimée dans l'encre fraîche : personne ne se souvient de la première chute.",
    ]),
    resume:
      "Maelis découvre un registre altéré dans les archives officielles. Cette anomalie introduit le mystère central du roman.",
    chapterNumber: 1,
    wordCount: 4280,
    wordGoal: 4000,
    project,
    part: partOne,
  });

  const chapterTwo = new ChapterEntity({
    title: "Chapitre 2 - Le cartographe sans ombre",
    status: "inProgress",
    content: richEditorContent([
      "Kael Varyn attendait au bord du pont des Lanternes, sa carte roulée contre lui comme une preuve trop lourde.",
      "Il affirmait avoir trouvé une rue qui n'existait sur aucun plan, mais que tous les habitants évitaient instinctivement.",
    ]),
    resume:
      "Maelis rencontre Kael, un cartographe qui connaît les passages oubliés de la cité. Leur alliance se met en place.",
    chapterNumber: 2,
    wordCount: 3620,
    wordGoal: 4500,
    project,
    part: partOne,
  });

  const chapterThree = new ChapterEntity({
    title: "Chapitre 3 - Les marches du dessous",
    status: "toStart",
    content: null,
    resume:
      "Maelis et Kael descendent sous la cité pour trouver les archives basses, un lieu officiellement détruit.",
    chapterNumber: 3,
    wordCount: 0,
    wordGoal: 4500,
    project,
    part: partOne,
  });

  const chapterFour = new ChapterEntity({
    title: "Interlude - Lettre non envoyée",
    status: "inProgress",
    content: richEditorContent([
      "Père, si cette lettre te parvient, c'est que j'ai compris pourquoi tu as choisi le silence.",
    ]),
    resume: "Court interlude épistolaire révélant une part du passé familial de Maelis.",
    chapterNumber: 4,
    wordCount: 950,
    wordGoal: 1500,
    project,
    part: null,
  });

  const maelis = new CharacterEntity({
    role: "protagonist",
    roleStar: 5,
    firstName: "Maelis",
    lastName: "Orlan",
    nickName: "Mae",
    pronouns: "elle",
    gender: "female",
    nationality: "Astérienne",
    age: 27,
    birthDate: parseZonedDateTime("1999-04-12T08:30:00+02:00[Europe/Paris]"),
    birthPlace: "Quartier des Verriers",
    residencePlace: "Atelier des reliures hautes",
    occupation: "Restauration de livres anciens",
    height: 168,
    weight: 58,
    corpulence: "Fine, nerveuse",
    hairColor: "Châtain sombre",
    eyesColor: "Gris vert",
    voice: "Calme, précise, presque basse",
    outfit: "Tablier d'atelier, manches retroussées, gants tachés d'encre",
    accessory: "Une loupe de son père",
    description:
      "Maelis observe avant d'agir. Sa retenue cache une grande obstination et une peur ancienne de trahir sa famille.",
    characterQualities: ["patiente", "observatrice", "loyale"],
    characterFlaws: ["méfiante", "solitaire", "se sous-estime"],
    tastes: "Le thé noir, les marges annotées, les nuits de pluie contre les vitres.",
    tics: "Tapote la tranche des livres quand elle réfléchit.",
    fears: "Découvrir que son père a participé au mensonge officiel.",
    education: "Formation d'archiviste et de restauratrice",
    class: "Classe moyenne artisanale",
    belief: "La mémoire doit être protégée, même lorsqu'elle dérange.",
    secrets: "Elle conserve un carnet interdit trouvé dans les affaires de son père.",
    notablePlaces: "Archives hautes, pont des Lanternes, ancien atelier familial",
    typicalExpression: "Les livres ne mentent pas, ils se défendent.",
    goals: "Comprendre l'origine de la phrase apparue dans le registre.",
    past: "A grandi dans l'ombre d'un père archiviste disparu.",
    present: "Travaille pour l'institution qui cache peut-être la vérité.",
    future: "Devra choisir entre protéger Aster et révéler son histoire.",
    notes: "Personnage principal à faire évoluer vers une parole publique assumée.",
    color: "blue",
    avatarLink:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    project,
  });

  const kael = new CharacterEntity({
    role: "ally",
    roleStar: 4,
    firstName: "Kael",
    lastName: "Varyn",
    nickName: "Le cartographe",
    pronouns: "il",
    gender: "male",
    nationality: "Astérien",
    age: 31,
    birthDate: null,
    birthPlace: "Nacelle basse",
    residencePlace: "Observatoire des vents",
    occupation: "Cartographie des ponts et courants",
    height: 181,
    weight: 74,
    corpulence: "Élancé",
    hairColor: "Noir",
    eyesColor: "Ambre",
    voice: "Rapide, ironique",
    outfit: "Manteau long rempli de cartes pliées",
    accessory: "Compas magnétique déréglé",
    description:
      "Kael plaisante pour cacher son inquiétude. Il connaît les zones interdites de la cité.",
    characterQualities: ["inventif", "courageux", "drôle"],
    characterFlaws: ["impatient", "provocateur"],
    tastes: "Les hauteurs, les mécanismes anciens, les repas improvisés.",
    tics: "Redessine les lieux sur tout ce qu'il trouve.",
    fears: "Être responsable d'une nouvelle chute.",
    education: "Apprentissage auprès des ingénieurs des ponts",
    class: "Classe populaire",
    belief: "Une carte doit montrer ce qui existe, pas ce que le pouvoir autorise.",
    secrets: "Il a déjà traversé la rue effacée.",
    notablePlaces: "Pont des Lanternes, observatoire, vieux monte-charge",
    typicalExpression: "Si le plan dit non, c'est que le plan est incomplet.",
    goals: "Prouver que la cité dissimule des quartiers entiers.",
    past: "A perdu sa soeur lors d'un accident officiellement nié.",
    present: "Aide Maelis à explorer les zones absentes des cartes.",
    future: "Devient le témoin clé de la vérité publique.",
    notes: "Bon contrepoint plus vif à Maelis.",
    color: "green",
    avatarLink:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    project,
  });

  const soren = new CharacterEntity({
    role: "antagonist",
    roleStar: 4,
    firstName: "Soren",
    lastName: "Vahl",
    nickName: "Le Conservateur",
    pronouns: "il",
    gender: "male",
    nationality: "Astérien",
    age: 54,
    birthDate: null,
    birthPlace: "Inconnu",
    residencePlace: "Tour du Conseil",
    occupation: "Conservateur général des archives",
    height: 176,
    weight: 70,
    corpulence: "Droit, très contrôlé",
    hairColor: "Poivre et sel",
    eyesColor: "Bleu pâle",
    voice: "Très posée",
    outfit: "Uniforme sombre du Conseil",
    accessory: "Anneau des conservateurs",
    description:
      "Soren croit sincèrement protéger la cité. Son opposition vient d'une peur politique plus que d'une cruauté gratuite.",
    characterQualities: ["rigoureux", "stratégique"],
    characterFlaws: ["autoritaire", "manipulateur"],
    tastes: "Le silence, l'ordre, les cérémonies codifiées.",
    tics: "Lisse son anneau avant de mentir.",
    fears: "Que la vérité provoque une panique collective.",
    education: "Académie du Conseil",
    class: "Élite politique",
    belief: "Une mémoire contrôlée vaut mieux qu'une vérité destructrice.",
    secrets: "Il connaît la cause réelle de la première chute.",
    notablePlaces: "Tour du Conseil, salle des registres scellés",
    typicalExpression: "Tout souvenir n'est pas bon à rendre.",
    goals: "Empêcher Maelis d'ouvrir les archives basses.",
    past: "A survécu enfant à un effondrement dont les archives ont été effacées.",
    present: "Dirige la censure des registres instables.",
    future: "Devra reconnaître que son contrôle entretient le danger.",
    notes: "Antagoniste nuancé : éviter le méchant caricatural.",
    color: "purple",
    avatarLink:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    project,
  });

  const aster = new PlaceEntity({
    name: "Aster",
    nickname: "La cité au-dessus des brumes",
    type: "Cité suspendue",
    localisation: "Au-dessus du golfe de Veyr, tenue par douze pylônes de verre noir.",
    physicalDescription:
      "Aster est composée de terrasses, de ponts et de quartiers superposés. Le bas disparaît souvent dans une brume bleutée.",
    atmosphere: "Belle, fragile, très verticale. Les habitants parlent bas près des garde-corps.",
    history:
      "La cité aurait été élevée après la première chute, mais les archives donnent plusieurs versions incompatibles.",
    population: "Artisans, archivistes, ingénieurs des vents, familles anciennes du Conseil.",
    usages: "Les registres publics rythment les cérémonies et les décisions politiques.",
    language: "fr",
    government: "Conseil des Conservateurs",
    ressources: "Verre noir, encre minérale, énergie éolienne",
    narrativeImportance: "high",
    color: "green",
    avatarLink:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80",
    project,
  });

  const archives = new PlaceEntity({
    name: "Archives basses",
    nickname: "Le ventre d'Aster",
    type: "Lieu interdit",
    localisation:
      "Sous les plateformes habitables, derrière les anciens ascenseurs de maintenance.",
    physicalDescription: "Salles humides, rayonnages tordus, livres gonflés par la brume.",
    atmosphere: "Oppressante, presque organique. Les pages semblent respirer.",
    history: "Officiellement détruites. En réalité scellées après la première chute.",
    population: "Aucune population permanente, seulement des traces d'anciens archivistes.",
    usages: "Contient les registres non corrigés de la cité.",
    language: "fr",
    government: null,
    ressources: "Documents originaux, sceaux anciens",
    narrativeImportance: "high",
    color: "cyan",
    avatarLink:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    project,
  });

  const lens = new ObjectEntity({
    name: "Loupe d'Orlan",
    type: "Instrument d'archive",
    importance: "high",
    description: "Loupe héritée du père de Maelis, capable de révéler les repentirs d'encre.",
    appearance: "Monture de laiton, verre légèrement bleuté, manche fendu.",
    significance:
      "Objet déclencheur : elle permet de lire la phrase cachée dans le premier registre.",
    location: "Atelier de Maelis",
    history: "Utilisée par plusieurs générations d'archivistes Orlan.",
    color: "yellow",
    avatarLink:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80",
    project,
  });

  const seal = new ObjectEntity({
    name: "Sceau des Conservateurs",
    type: "Symbole politique",
    importance: "medium",
    description: "Anneau-sceau utilisé pour verrouiller les registres sensibles.",
    appearance: "Argent noirci, motif de tour entourée de brume.",
    significance: "Il matérialise le pouvoir de Soren et le verrouillage de la mémoire officielle.",
    location: "Tour du Conseil",
    history: "Créé après la première chute pour contrôler la circulation des archives.",
    color: "gray",
    avatarLink:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    project,
  });

  const dailyGoal = new GoalEntity({
    type: "daily",
    title: "Écrire 1200 mots par jour",
    goals: 1200,
    unit: "words",
    project,
    deadline: parseZonedDateTime("2026-07-24T23:59:00+02:00[Europe/Paris]"),
    description: "Objectif de rythme pour maintenir l'avancée du premier acte.",
    status: "urgent",
    currentBaseline: 23480,
  });
  dailyGoal.current = 820;

  const weeklyGoal = new GoalEntity({
    type: "weekly",
    title: "Terminer l'acte I",
    goals: 3,
    unit: "chapters",
    project,
    deadline: parseZonedDateTime("2026-07-28T23:59:00+02:00[Europe/Paris]"),
    description: "Finaliser les trois premiers chapitres et l'interlude.",
    status: "warning",
    currentBaseline: 1,
  });
  weeklyGoal.current = 2;

  const projectGoal = new GoalEntity({
    type: "project",
    title: "Atteindre 85 000 mots",
    goals: 85000,
    unit: "words",
    project,
    deadline: parseZonedDateTime("2026-12-15T23:59:00+01:00[Europe/Paris]"),
    description: "Objectif global du premier jet.",
    status: null,
    currentBaseline: 0,
  });
  projectGoal.current = 24680;

  const notes = [
    new NoteEntity({
      title: "Ambiance générale",
      content:
        "Insister sur les sons : cloches de verre, câbles qui vibrent, papier humide. La cité doit sembler belle mais jamais totalement sûre.",
      linkFile: null,
      color: "green",
      project,
      tags: ["ambiance", "style"],
    }),
    new NoteEntity({
      title: "Règle magique des archives",
      content:
        "Les archives ne changent pas le passé : elles changent ce que la société accepte de se rappeler. La magie est politique.",
      linkFile: null,
      color: "purple",
      project,
      tags: ["magie", "worldbuilding"],
    }),
  ];

  const research = [
    new ResearchEntity({
      title: "Architecture suspendue",
      type: "images",
      sources:
        "Références visuelles : ponts suspendus, cités verticales, passerelles industrielles.",
      tag: ["architecture", "décor"],
      note: "Créer une ville praticable, pas seulement jolie.",
      description: "Moodboard pour les quartiers hauts et les ponts d'Aster.",
      link: "https://fr.wikipedia.org/wiki/Pont_suspendu",
      project,
    }),
    new ResearchEntity({
      title: "Restauration de manuscrits",
      type: "articles",
      sources: "Articles sur la conservation du papier, humidité, reliure et encres anciennes.",
      tag: ["archives", "métier"],
      note: "Utiliser un vocabulaire précis sans ralentir le rythme.",
      description: "Base documentaire pour rendre le métier de Maelis crédible.",
      link: "https://fr.wikipedia.org/wiki/Conservation-restauration_du_patrimoine_culturel",
      project,
    }),
  ];

  const events = [
    new EventEntity({
      title: "La première chute",
      description: "Événement fondateur effacé des registres publics.",
      importance: "critical",
      location: "Anciennes plateformes basses",
      additionalDetails: "La version officielle parle d'un incident technique mineur.",
      eventDate: parseZonedDateTime("1896-03-18T04:12:00+00:00[UTC]"),
      project,
      chapter: null,
    }),
    new EventEntity({
      title: "Découverte du registre altéré",
      description: "Maelis lit la phrase impossible pendant une restauration.",
      importance: "important",
      location: "Atelier des reliures hautes",
      additionalDetails: "Déclencheur du chapitre 1.",
      eventDate: parseZonedDateTime("2026-09-14T21:30:00+02:00[Europe/Paris]"),
      project,
      chapter: chapterOne,
    }),
    new EventEntity({
      title: "Traversée du pont des Lanternes",
      description: "Première alliance entre Maelis et Kael.",
      importance: "action",
      location: "Pont des Lanternes",
      additionalDetails: "Scène à tension légère, avec brume montante.",
      eventDate: parseZonedDateTime("2026-09-16T23:10:00+02:00[Europe/Paris]"),
      project,
      chapter: chapterTwo,
    }),
  ];

  const mindmap = new MindmapEntity({
    title: "Intrigue principale",
    data: demoMindmap,
    project,
  });

  const histories = [
    new HistoryEntity({
      type: "create",
      entity: "part",
      date: parseZonedDateTime("2026-07-20T09:00:00+02:00[Europe/Paris]"),
      title: "Création du projet Les Brumes d'Aster",
      project,
    }),
    new HistoryEntity({
      type: "update",
      entity: "chapter",
      date: parseZonedDateTime("2026-07-21T18:30:00+02:00[Europe/Paris]"),
      title: "Modification du chapitre La reliure impossible",
      project,
    }),
    new HistoryEntity({
      type: "create",
      entity: "character",
      date: parseZonedDateTime("2026-07-22T14:10:00+02:00[Europe/Paris]"),
      title: "Ajout du personnage Kael Varyn",
      project,
    }),
    new HistoryEntity({
      type: "create",
      entity: "export",
      date: parseZonedDateTime("2026-07-23T10:45:00+02:00[Europe/Paris]"),
      title: "Génération d'un export DOCX de démonstration",
      project,
    }),
  ];

  const relationship = new RelationshipEntity({
    parentRelation: maelis,
    childRelation: kael,
    type: "Alliance fragile",
    project,
  });

  em.persist([
    user,
    settings,
    structure,
    project,
    partOne,
    partTwo,
    partThree,
    chapterOne,
    chapterTwo,
    chapterThree,
    chapterFour,
    maelis,
    kael,
    soren,
    relationship,
    aster,
    archives,
    lens,
    seal,
    dailyGoal,
    weeklyGoal,
    projectGoal,
    ...notes,
    ...research,
    ...events,
    mindmap,
    ...histories,
  ]);

  await em.flush();
}

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const em = app.get(EntityManager).fork();

  try {
    await ensureDemoSchema(em);
    await resetDemoUser(em);
    await createDemoData(em);
    console.log("Données de démonstration créées.");
    console.log(`Email : ${demoEmail}`);
    console.log(`Mot de passe : ${demoPassword}`);
  } finally {
    await app.close();
  }
}

void main();
