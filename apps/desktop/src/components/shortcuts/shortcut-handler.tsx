import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useProject } from "../../context/project-provider";
import { usePreferences } from "../../context/preference-provider";
import { chapterRoute } from "../../routes/chapter/index.route";
import { characterRoute } from "../../routes/character/index.route";
import { eventRoute } from "../../routes/event/index.route";
import { exportRoute } from "../../routes/export/index.route";
import { createMindmapRoute, mindmapRoute } from "../../routes/mindmap/index.route";
import { noteRoute } from "../../routes/note/index.route";
import { objectRoute } from "../../routes/object/index.route";
import { placeRoute } from "../../routes/place/index.route";
import { projectHomeRoute } from "../../routes/project/index.route";
import { researchRoute } from "../../routes/research/index.route";
import { settingsRoute } from "../../routes/settings/index.route";
import { structureRoute } from "../../routes/structure/index.routes";
import { ShortcutActionId } from "../../utils/shortcut-actions";
import {
  dispatchOpenCreateChapter,
  dispatchOpenCreateCharacter,
  dispatchOpenCreateEvent,
  dispatchOpenCreateNote,
  dispatchOpenCreateObject,
  dispatchOpenCreatePart,
  dispatchOpenCreatePlace,
  dispatchOpenCreateResearch,
  dispatchOpenDeleteSelectedChapter,
  dispatchOpenDeleteSelectedCharacter,
  dispatchOpenDeleteSelectedEvent,
  dispatchOpenDeleteSelectedNote,
  dispatchOpenDeleteSelectedObject,
  dispatchOpenDeleteSelectedPart,
  dispatchOpenDeleteSelectedPlace,
  dispatchOpenEditSelectedChapter,
  dispatchOpenEditSelectedCharacter,
  dispatchOpenEditSelectedEvent,
  dispatchOpenEditSelectedNote,
  dispatchOpenEditSelectedObject,
  dispatchOpenEditSelectedPart,
  dispatchOpenEditSelectedPlace,
  dispatchOpenEditStructure,
} from "../../utils/shortcut-events";
import {
  getAcceleratorFromKeyboardEvent,
  normalizeShortcutLabel,
  shortcutToAccelerator,
} from "../../utils/shortcut-key";

interface ShortcutHandlerProps {
  projectName: string;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

const legacyShortcutLabels: Record<string, ShortcutActionId> = {
  "creer un personnage": "create-character",
  "ajouter un personnage": "create-character",
  "create character": "create-character",
  "add character": "create-character",
  "creer un lieu": "create-place",
  "ajouter un lieu": "create-place",
  "create place": "create-place",
  "add place": "create-place",
  "creer un objet": "create-object",
  "ajouter un objet": "create-object",
  "create object": "create-object",
  "add object": "create-object",
  "creer une recherche": "create-research",
  "ajouter une recherche": "create-research",
  "create research": "create-research",
  "add research": "create-research",
  "creer un evenement": "create-event",
  "ajouter un evenement": "create-event",
  "create event": "create-event",
  "add event": "create-event",
  "creer une note": "create-note",
  "ajouter une note": "create-note",
  "create note": "create-note",
  "add note": "create-note",
  "creer une partie": "create-part",
  "ajouter une partie": "create-part",
  "create part": "create-part",
  "add part": "create-part",
  "creer un chapitre": "create-chapter",
  "ajouter un chapitre": "create-chapter",
  "create chapter": "create-chapter",
  "add chapter": "create-chapter",
  "creer une carte mentale": "create-mindmap",
  "ajouter une carte mentale": "create-mindmap",
  "create mind map": "create-mindmap",
  "add mind map": "create-mindmap",
};

const legacyShortcutIds: Partial<Record<string, ShortcutActionId>> = {
  create: "create-chapter",
  export: "go-to-export",
  "toggle-theme": "toggle-theme",
};

function getShortcutActionId(shortcutId: string, shortcutLabel: string) {
  return (
    legacyShortcutLabels[normalizeShortcutLabel(shortcutLabel)] ??
    legacyShortcutIds[shortcutId] ??
    (shortcutId.split(":")[0] as ShortcutActionId)
  );
}

export function ShortcutHandler({ projectName }: ShortcutHandlerProps) {
  const { currentProject } = useProject();
  const { preferences, updatePreferences } = usePreferences();
  const navigate = useNavigate();

  useEffect(() => {
    function navigateAndDispatch(to: string, callback: () => void) {
      void navigate({
        to,
        params: { name: projectName },
      }).then(() => {
        window.setTimeout(callback, 0);
      });
    }

    function navigateTo(to: string) {
      void navigate({ to, params: { name: projectName } });
    }

    const actionHandlers: Record<ShortcutActionId, () => void> = {
      "create-character": () => navigateAndDispatch(characterRoute.to, dispatchOpenCreateCharacter),
      "create-place": () => navigateAndDispatch(placeRoute.to, dispatchOpenCreatePlace),
      "create-object": () => navigateAndDispatch(objectRoute.to, dispatchOpenCreateObject),
      "create-research": () => navigateAndDispatch(researchRoute.to, dispatchOpenCreateResearch),
      "create-event": () => navigateAndDispatch(eventRoute.to, dispatchOpenCreateEvent),
      "create-note": () => navigateAndDispatch(noteRoute.to, dispatchOpenCreateNote),
      "create-part": () => navigateAndDispatch(chapterRoute.to, dispatchOpenCreatePart),
      "create-chapter": () => navigateAndDispatch(chapterRoute.to, dispatchOpenCreateChapter),
      "create-mindmap": () => navigateTo(createMindmapRoute.to),
      "edit-selected-character": dispatchOpenEditSelectedCharacter,
      "delete-selected-character": dispatchOpenDeleteSelectedCharacter,
      "edit-selected-place": dispatchOpenEditSelectedPlace,
      "delete-selected-place": dispatchOpenDeleteSelectedPlace,
      "edit-selected-object": dispatchOpenEditSelectedObject,
      "delete-selected-object": dispatchOpenDeleteSelectedObject,
      "edit-selected-event": dispatchOpenEditSelectedEvent,
      "delete-selected-event": dispatchOpenDeleteSelectedEvent,
      "edit-selected-note": dispatchOpenEditSelectedNote,
      "delete-selected-note": dispatchOpenDeleteSelectedNote,
      "edit-selected-part": dispatchOpenEditSelectedPart,
      "delete-selected-part": dispatchOpenDeleteSelectedPart,
      "edit-selected-chapter": dispatchOpenEditSelectedChapter,
      "delete-selected-chapter": dispatchOpenDeleteSelectedChapter,
      "edit-structure": dispatchOpenEditStructure,
      "go-to-dashboard": () => navigateTo(projectHomeRoute.to),
      "go-to-characters": () => navigateTo(characterRoute.to),
      "go-to-places": () => navigateTo(placeRoute.to),
      "go-to-objects": () => navigateTo(objectRoute.to),
      "go-to-chapters": () => navigateTo(chapterRoute.to),
      "go-to-research": () => navigateTo(researchRoute.to),
      "go-to-events": () => navigateTo(eventRoute.to),
      "go-to-structure": () => navigateTo(structureRoute.to),
      "go-to-mindmaps": () => navigateTo(mindmapRoute.to),
      "go-to-notes": () => navigateTo(noteRoute.to),
      "go-to-export": () => navigateTo(exportRoute.to),
      "go-to-settings": () => navigateTo(settingsRoute.to),
      "toggle-theme": () =>
        updatePreferences({ theme: preferences.theme === "dark" ? "light" : "dark" }),
    };

    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return;
      }

      const pressedShortcut = getAcceleratorFromKeyboardEvent(event);

      if (!pressedShortcut) {
        return;
      }

      const matchedShortcut = currentProject?.settings.shortcuts.find(
        (shortcut) => shortcutToAccelerator(shortcut.shortcut) === pressedShortcut
      );

      if (!matchedShortcut) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const action = actionHandlers[getShortcutActionId(matchedShortcut.id, matchedShortcut.label)];
      action?.();
    }

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [
    currentProject?.settings.shortcuts,
    navigate,
    preferences.theme,
    projectName,
    updatePreferences,
  ]);

  return null;
}
