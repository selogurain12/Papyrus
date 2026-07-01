import { SettingShortcutDto } from "@papyrus/source";

export type ShortcutActionId =
  | "create-character"
  | "create-place"
  | "create-object"
  | "create-research"
  | "create-event"
  | "create-note"
  | "create-part"
  | "create-chapter"
  | "create-mindmap"
  | "edit-selected-character"
  | "delete-selected-character"
  | "edit-selected-place"
  | "delete-selected-place"
  | "edit-selected-object"
  | "delete-selected-object"
  | "edit-selected-event"
  | "delete-selected-event"
  | "edit-selected-note"
  | "delete-selected-note"
  | "edit-selected-part"
  | "delete-selected-part"
  | "edit-selected-chapter"
  | "delete-selected-chapter"
  | "edit-structure"
  | "go-to-dashboard"
  | "go-to-characters"
  | "go-to-places"
  | "go-to-objects"
  | "go-to-chapters"
  | "go-to-research"
  | "go-to-events"
  | "go-to-structure"
  | "go-to-mindmaps"
  | "go-to-notes"
  | "go-to-export"
  | "go-to-settings"
  | "toggle-theme";

export type ShortcutActionOption = {
  id: ShortcutActionId;
  label: string;
  defaultShortcut?: string;
};

export const shortcutActions: ShortcutActionOption[] = [
  { id: "create-character", label: "Créer un personnage" },
  { id: "create-place", label: "Créer un lieu" },
  { id: "create-object", label: "Créer un objet" },
  { id: "create-research", label: "Créer une recherche" },
  { id: "create-event", label: "Créer un événement" },
  { id: "create-note", label: "Créer une note" },
  { id: "create-part", label: "Créer une partie", defaultShortcut: "CommandOrControl+P" },
  { id: "create-chapter", label: "Créer un chapitre", defaultShortcut: "CommandOrControl+N" },
  { id: "create-mindmap", label: "Créer une carte mentale" },
  { id: "edit-selected-character", label: "Modifier le personnage sélectionné" },
  { id: "delete-selected-character", label: "Supprimer le personnage sélectionné" },
  { id: "edit-selected-place", label: "Modifier le lieu sélectionné" },
  { id: "delete-selected-place", label: "Supprimer le lieu sélectionné" },
  { id: "edit-selected-object", label: "Modifier l'objet sélectionné" },
  { id: "delete-selected-object", label: "Supprimer l'objet sélectionné" },
  { id: "edit-selected-event", label: "Modifier l'événement sélectionné" },
  { id: "delete-selected-event", label: "Supprimer l'événement sélectionné" },
  { id: "edit-selected-note", label: "Modifier la note sélectionnée" },
  { id: "delete-selected-note", label: "Supprimer la note sélectionnée" },
  { id: "edit-selected-part", label: "Modifier la partie sélectionnée" },
  { id: "delete-selected-part", label: "Supprimer la partie sélectionnée" },
  { id: "edit-selected-chapter", label: "Modifier le chapitre sélectionné" },
  { id: "delete-selected-chapter", label: "Supprimer le chapitre sélectionné" },
  { id: "edit-structure", label: "Modifier la structure" },
  { id: "go-to-dashboard", label: "Ouvrir le tableau de bord" },
  { id: "go-to-characters", label: "Ouvrir les personnages" },
  { id: "go-to-places", label: "Ouvrir les lieux" },
  { id: "go-to-objects", label: "Ouvrir les objets" },
  { id: "go-to-chapters", label: "Ouvrir les chapitres" },
  { id: "go-to-research", label: "Ouvrir les recherches" },
  { id: "go-to-events", label: "Ouvrir la chronologie" },
  { id: "go-to-structure", label: "Ouvrir la structure" },
  { id: "go-to-mindmaps", label: "Ouvrir les cartes mentales" },
  { id: "go-to-notes", label: "Ouvrir les notes" },
  { id: "go-to-export", label: "Ouvrir l'export", defaultShortcut: "CommandOrControl+E" },
  { id: "go-to-settings", label: "Ouvrir les paramètres", defaultShortcut: "CommandOrControl+," },
  { id: "toggle-theme", label: "Basculer le thème", defaultShortcut: "CommandOrControl+Shift+T" },
];

export const defaultShortcuts: SettingShortcutDto[] = shortcutActions
  .filter((action) => action.defaultShortcut)
  .map((action) => ({
    id: action.id,
    label: action.label,
    shortcut: action.defaultShortcut ?? "",
  }));
