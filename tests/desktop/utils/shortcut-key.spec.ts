import {
  acceleratorToDisplay,
  getAcceleratorFromKeyboardEvent,
  normalizeShortcutLabel,
  shortcutToAccelerator,
} from "../../../apps/desktop/src/utils/shortcut-key";

describe("shortcut key utilities", () => {
  it("converts display shortcuts to Electron accelerators", () => {
    expect(shortcutToAccelerator("⌘ ⇧ P")).toBe("CommandOrControl+Shift+P");
    expect(shortcutToAccelerator("Ctrl+Alt+S")).toBe("CommandOrControl+Alt+S");
  });

  it("converts accelerators to display labels", () => {
    expect(acceleratorToDisplay("CommandOrControl+Shift+P")).toBe("⌘ ⇧ P");
    expect(acceleratorToDisplay("Alt+Down")).toBe("⌥ ↓");
  });

  it("builds accelerators from keyboard events", () => {
    expect(
      getAcceleratorFromKeyboardEvent({
        altKey: true,
        ctrlKey: false,
        key: "a",
        metaKey: true,
        shiftKey: true,
      } as KeyboardEvent)
    ).toBe("CommandOrControl+Alt+Shift+A");
    expect(
      getAcceleratorFromKeyboardEvent({
        altKey: false,
        ctrlKey: false,
        key: "F5",
        metaKey: false,
        shiftKey: false,
      } as KeyboardEvent)
    ).toBe("F5");
    expect(
      getAcceleratorFromKeyboardEvent({
        altKey: false,
        ctrlKey: false,
        key: "Shift",
        metaKey: false,
        shiftKey: true,
      } as KeyboardEvent)
    ).toBe("");
  });

  it("normalizes labels for search", () => {
    expect(normalizeShortcutLabel("  Écrire un chapitre  ")).toBe("ecrire un chapitre");
  });
});
