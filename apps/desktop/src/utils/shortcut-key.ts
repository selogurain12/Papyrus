const modifierKeys = new Set(["Alt", "AltGraph", "Control", "Meta", "Shift"]);

const displayToAcceleratorModifiers: Record<string, string> = {
  "⌘": "CommandOrControl",
  Ctrl: "CommandOrControl",
  Control: "CommandOrControl",
  "⌥": "Alt",
  Option: "Alt",
  Alt: "Alt",
  "⇧": "Shift",
  Shift: "Shift",
};

const acceleratorToDisplayModifiers: Record<string, string> = {
  CommandOrControl: "⌘",
  CmdOrCtrl: "⌘",
  Command: "⌘",
  Cmd: "⌘",
  Control: "Ctrl",
  Ctrl: "Ctrl",
  Alt: "⌥",
  Option: "⌥",
  Shift: "⇧",
  Super: "Meta",
  Meta: "Meta",
};

function formatAcceleratorKey(key: string) {
  if (key === " ") return "Space";
  if (key === "ArrowUp") return "Up";
  if (key === "ArrowDown") return "Down";
  if (key === "ArrowLeft") return "Left";
  if (key === "ArrowRight") return "Right";
  if (key === "Escape") return "Escape";
  if (key === "Enter") return "Enter";
  if (key === "+") return "Plus";
  if (key.length === 1) return key.toUpperCase();
  return key;
}

function formatDisplayKey(key: string) {
  if (key === "Space") return "Space";
  if (key === "Up") return "↑";
  if (key === "Down") return "↓";
  if (key === "Left") return "←";
  if (key === "Right") return "→";
  if (key === "Escape") return "Esc";
  if (key === "Plus") return "+";
  return key;
}

function normalizeAcceleratorPart(part: string) {
  const trimmedPart = part.trim();
  return displayToAcceleratorModifiers[trimmedPart] ?? trimmedPart;
}

export function shortcutToAccelerator(shortcut: string) {
  if (!shortcut.includes("+") && shortcut.includes(" ")) {
    return shortcut.split(" ").filter(Boolean).map(normalizeAcceleratorPart).join("+");
  }

  return shortcut.split("+").filter(Boolean).map(normalizeAcceleratorPart).join("+");
}

export function acceleratorToDisplay(accelerator: string) {
  return shortcutToAccelerator(accelerator)
    .split("+")
    .filter(Boolean)
    .map((part) => acceleratorToDisplayModifiers[part] ?? formatDisplayKey(part))
    .join(" ");
}

export function getAcceleratorFromKeyboardEvent(
  event: Pick<KeyboardEvent, "altKey" | "ctrlKey" | "key" | "metaKey" | "shiftKey">
) {
  if (modifierKeys.has(event.key)) {
    return "";
  }

  const keys = [
    event.metaKey || event.ctrlKey ? "CommandOrControl" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    formatAcceleratorKey(event.key),
  ].filter(Boolean);

  return [...new Set(keys)].join("+");
}

export function normalizeShortcutLabel(label: string) {
  return label
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}
