export const openCreatePartEvent = "papyrus:open-create-part";
export const openCreateChapterEvent = "papyrus:open-create-chapter";
export const openCreateCharacterEvent = "papyrus:open-create-character";
export const openCreatePlaceEvent = "papyrus:open-create-place";
export const openCreateObjectEvent = "papyrus:open-create-object";
export const openCreateResearchEvent = "papyrus:open-create-research";
export const openCreateEventEvent = "papyrus:open-create-event";
export const openCreateNoteEvent = "papyrus:open-create-note";
export const openEditSelectedCharacterEvent = "papyrus:open-edit-selected-character";
export const openDeleteSelectedCharacterEvent = "papyrus:open-delete-selected-character";
export const openEditSelectedPlaceEvent = "papyrus:open-edit-selected-place";
export const openDeleteSelectedPlaceEvent = "papyrus:open-delete-selected-place";
export const openEditSelectedObjectEvent = "papyrus:open-edit-selected-object";
export const openDeleteSelectedObjectEvent = "papyrus:open-delete-selected-object";
export const openEditSelectedEventEvent = "papyrus:open-edit-selected-event";
export const openDeleteSelectedEventEvent = "papyrus:open-delete-selected-event";
export const openEditSelectedNoteEvent = "papyrus:open-edit-selected-note";
export const openDeleteSelectedNoteEvent = "papyrus:open-delete-selected-note";
export const openEditSelectedPartEvent = "papyrus:open-edit-selected-part";
export const openDeleteSelectedPartEvent = "papyrus:open-delete-selected-part";
export const openEditSelectedChapterEvent = "papyrus:open-edit-selected-chapter";
export const openDeleteSelectedChapterEvent = "papyrus:open-delete-selected-chapter";
export const openEditStructureEvent = "papyrus:open-edit-structure";

export function dispatchOpenCreatePart() {
  window.dispatchEvent(new CustomEvent(openCreatePartEvent));
}

export function dispatchOpenCreateChapter() {
  window.dispatchEvent(new CustomEvent(openCreateChapterEvent));
}

export function dispatchOpenCreateCharacter() {
  window.dispatchEvent(new CustomEvent(openCreateCharacterEvent));
}

export function dispatchOpenCreatePlace() {
  window.dispatchEvent(new CustomEvent(openCreatePlaceEvent));
}

export function dispatchOpenCreateObject() {
  window.dispatchEvent(new CustomEvent(openCreateObjectEvent));
}

export function dispatchOpenCreateResearch() {
  window.dispatchEvent(new CustomEvent(openCreateResearchEvent));
}

export function dispatchOpenCreateEvent() {
  window.dispatchEvent(new CustomEvent(openCreateEventEvent));
}

export function dispatchOpenCreateNote() {
  window.dispatchEvent(new CustomEvent(openCreateNoteEvent));
}

function dispatchShortcutEvent(eventName: string) {
  window.dispatchEvent(new CustomEvent(eventName));
}

export const dispatchOpenEditSelectedCharacter = () =>
  dispatchShortcutEvent(openEditSelectedCharacterEvent);
export const dispatchOpenDeleteSelectedCharacter = () =>
  dispatchShortcutEvent(openDeleteSelectedCharacterEvent);
export const dispatchOpenEditSelectedPlace = () =>
  dispatchShortcutEvent(openEditSelectedPlaceEvent);
export const dispatchOpenDeleteSelectedPlace = () =>
  dispatchShortcutEvent(openDeleteSelectedPlaceEvent);
export const dispatchOpenEditSelectedObject = () =>
  dispatchShortcutEvent(openEditSelectedObjectEvent);
export const dispatchOpenDeleteSelectedObject = () =>
  dispatchShortcutEvent(openDeleteSelectedObjectEvent);
export const dispatchOpenEditSelectedEvent = () =>
  dispatchShortcutEvent(openEditSelectedEventEvent);
export const dispatchOpenDeleteSelectedEvent = () =>
  dispatchShortcutEvent(openDeleteSelectedEventEvent);
export const dispatchOpenEditSelectedNote = () => dispatchShortcutEvent(openEditSelectedNoteEvent);
export const dispatchOpenDeleteSelectedNote = () =>
  dispatchShortcutEvent(openDeleteSelectedNoteEvent);
export const dispatchOpenEditSelectedPart = () => dispatchShortcutEvent(openEditSelectedPartEvent);
export const dispatchOpenDeleteSelectedPart = () =>
  dispatchShortcutEvent(openDeleteSelectedPartEvent);
export const dispatchOpenEditSelectedChapter = () =>
  dispatchShortcutEvent(openEditSelectedChapterEvent);
export const dispatchOpenDeleteSelectedChapter = () =>
  dispatchShortcutEvent(openDeleteSelectedChapterEvent);
export const dispatchOpenEditStructure = () => dispatchShortcutEvent(openEditStructureEvent);
