import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  Cloud,
  Download,
  FileText,
  Github,
  Goal,
  Laptop,
  LockKeyhole,
  Map,
  Moon,
  Search,
  Sparkles,
  UsersRound,
  WifiOff,
} from "lucide-react";

import "./styles.css";

const features = [
  {
    icon: UsersRound,
    title: "Personnages, lieux et objets",
    text: "Centralisez les elements de votre univers et gardez une vision claire de chaque detail important.",
  },
  {
    icon: FileText,
    title: "Chapitres et structure",
    text: "Organisez vos parties, suivez vos chapitres et ouvrez l'editeur sans perdre le fil de votre roman.",
  },
  {
    icon: Goal,
    title: "Objectifs d'ecriture",
    text: "Suivez vos objectifs quotidiens, vos deadlines et votre progression depuis un tableau calme et lisible.",
  },
  {
    icon: WifiOff,
    title: "Mode hors ligne",
    text: "Continuez a creer meme sans connexion, puis synchronisez vos donnees quand le reseau revient.",
  },
  {
    icon: Search,
    title: "Recherches et notes",
    text: "Conservez vos sources, fichiers, images et idees dans le meme espace que votre projet.",
  },
  {
    icon: Brain,
    title: "Cartes mentales",
    text: "Reliez les idees, les arcs narratifs et les relations pour explorer votre histoire autrement.",
  },
];

const downloadOptions = [
  {
    label: "Telecharger pour macOS",
    detail: "Apple Silicon - zip",
    href: "/downloads/Papyrus Desktop-darwin-arm64-1.0.0.zip",
    primary: true,
  },
  {
    label: "Version Windows",
    detail: "Bientot disponible",
    href: "#versions",
    primary: false,
  },
  {
    label: "Voir le projet",
    detail: "Depot GitHub",
    href: "https://github.com/",
    primary: false,
  },
];

const timeline = [
  "Creation du projet et structure narrative",
  "Fiches personnages, lieux, objets et recherches",
  "Ecriture, objectifs, notifications et export",
];

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a aria-label="Papyrus accueil" className="brand" href="#top">
          <img alt="" className="brand-icon" src="/icon.svg" />
          <span>Papyrus</span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#features">Fonctionnalites</a>
          <a href="#workflow">Workflow</a>
          <a href="#versions">Telecharger</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">
              <Sparkles aria-hidden="true" size={18} />
              Studio d'ecriture desktop
            </p>
            <h1>Papyrus</h1>
            <p className="hero-subtitle">
              L'application pour construire un univers, suivre vos objectifs et ecrire votre projet
              sans disperser personnages, recherches, notes et chapitres.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" download href={downloadOptions[0].href}>
                <Download aria-hidden="true" size={20} />
                Telecharger l'application
              </a>
              <a className="button button-secondary" href="#features">
                Explorer
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            </div>
            <div className="trust-row" aria-label="Points forts">
              <span>
                <CheckCircle2 aria-hidden="true" size={18} />
                Hors ligne
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" size={18} />
                Objectifs
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" size={18} />
                Export
              </span>
            </div>
          </div>

          <div className="product-preview" aria-label="Apercu de Papyrus">
            <div className="window-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-grid">
              <aside className="preview-sidebar">
                <img alt="" className="preview-logo" src="/icon.svg" />
                <strong>Papyrus</strong>
                <span>Studio d'ecriture</span>
                {["Tableau de bord", "Personnages", "Chapitres", "Objectifs"].map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </aside>
              <div className="preview-content">
                <div className="preview-header">
                  <div>
                    <span>Projet actuel</span>
                    <strong>Les Chroniques d'Encre</strong>
                  </div>
                  <button type="button">Sauvegarder</button>
                </div>
                <div className="preview-cards">
                  <article>
                    <BookOpen aria-hidden="true" size={24} />
                    <strong>42</strong>
                    <span>chapitres</span>
                  </article>
                  <article>
                    <Goal aria-hidden="true" size={24} />
                    <strong>78%</strong>
                    <span>objectif</span>
                  </article>
                  <article>
                    <CalendarDays aria-hidden="true" size={24} />
                    <strong>5</strong>
                    <span>jours restants</span>
                  </article>
                </div>
                <div className="preview-editor">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-section" id="features">
          <div className="section-heading">
            <p className="eyebrow">Tout au meme endroit</p>
            <h2>Un espace complet pour suivre votre projet d'ecriture</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <feature.icon aria-hidden="true" size={26} />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="workflow-visual">
            <Map aria-hidden="true" size={34} />
            <div>
              <p>Structure</p>
              <strong>Votre roman garde une colonne vertebrale claire.</strong>
            </div>
          </div>
          <div className="workflow-copy">
            <p className="eyebrow">Workflow simple</p>
            <h2>De l'idee brute au manuscrit organise</h2>
            <div className="timeline">
              {timeline.map((item, index) => (
                <div className="timeline-item" key={item}>
                  <span>{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="download-section" id="versions">
          <div>
            <p className="eyebrow">Telechargement</p>
            <h2>Installez Papyrus sur votre ordinateur</h2>
            <p>
              Deposez vos builds dans <code>public/downloads</code> pour que les boutons pointent
              vers les fichiers reels.
            </p>
          </div>
          <div className="download-grid">
            {downloadOptions.map((option) => (
              <a
                className={option.primary ? "download-card download-card-primary" : "download-card"}
                download={option.primary}
                href={option.href}
                key={option.label}
              >
                {option.primary ? <Laptop aria-hidden="true" /> : <Github aria-hidden="true" />}
                <strong>{option.label}</strong>
                <span>{option.detail}</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <img alt="" className="brand-icon" src="/icon.svg" />
          <span>Papyrus</span>
        </div>
        <div className="footer-badges" aria-label="Capacites">
          <span>
            <Cloud aria-hidden="true" size={16} />
            Sync
          </span>
          <span>
            <LockKeyhole aria-hidden="true" size={16} />
            Local-first
          </span>
          <span>
            <Moon aria-hidden="true" size={16} />
            Mode sombre
          </span>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
