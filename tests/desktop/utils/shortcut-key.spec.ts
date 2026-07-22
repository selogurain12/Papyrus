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
    expect(acceleratorToDisplay("CmdOrCtrl+Command+Cmd+Control+Ctrl")).toBe("⌘ ⌘ ⌘ ⌘ ⌘");
    expect(acceleratorToDisplay("Option+Super+Meta+Space+Up+Left+Right+Escape+Plus")).toBe(
      "⌥ Meta Meta Space ↑ ← → Esc +"
    );
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

  it("formats special keyboard keys for accelerators", () => {
    const baseEvent = {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    };

    expect(getAcceleratorFromKeyboardEvent({ ...baseEvent, key: " " } as KeyboardEvent)).toBe(
      "Space"
    );
    expect(getAcceleratorFromKeyboardEvent({ ...baseEvent, key: "ArrowUp" } as KeyboardEvent)).toBe(
      "Up"
    );
    expect(
      getAcceleratorFromKeyboardEvent({ ...baseEvent, key: "ArrowDown" } as KeyboardEvent)
    ).toBe("Down");
    expect(
      getAcceleratorFromKeyboardEvent({ ...baseEvent, key: "ArrowLeft" } as KeyboardEvent)
    ).toBe("Left");
    expect(
      getAcceleratorFromKeyboardEvent({ ...baseEvent, key: "ArrowRight" } as KeyboardEvent)
    ).toBe("Right");
    expect(getAcceleratorFromKeyboardEvent({ ...baseEvent, key: "Escape" } as KeyboardEvent)).toBe(
      "Escape"
    );
    expect(getAcceleratorFromKeyboardEvent({ ...baseEvent, key: "Enter" } as KeyboardEvent)).toBe(
      "Enter"
    );
    expect(getAcceleratorFromKeyboardEvent({ ...baseEvent, key: "+" } as KeyboardEvent)).toBe(
      "Plus"
    );
  });

  it("normalizes labels for search", () => {
    expect(normalizeShortcutLabel("  Écrire un chapitre  ")).toBe("ecrire un chapitre");
  });
});
