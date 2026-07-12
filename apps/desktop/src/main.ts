import { app, BrowserWindow, ipcMain, session } from "electron";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import started from "electron-squirrel-startup";
import { registerLocalDatabaseIpc } from "./local-db/ipc";

if (started) {
  app.quit();
}

registerLocalDatabaseIpc();

function getOfflineFilesDirectory() {
  return path.join(app.getPath("userData"), "offline-files");
}

ipcMain.handle("local-file:save", async (_event, input: { name: string; data: ArrayBuffer }) => {
  const directory = getOfflineFilesDirectory();
  const safeName = input.name.replace(/[^\w. -]/g, "_");
  const filePath = path.join(directory, `${Date.now()}-${safeName}`);

  await mkdir(directory, { recursive: true });
  await writeFile(filePath, new Uint8Array(input.data));

  return pathToFileURL(filePath).toString();
});

ipcMain.handle("local-file:read-data-url", async (_event, url: string) => {
  const filePath = fileURLToPath(url);
  const offlineDirectory = getOfflineFilesDirectory();
  const relativePath = path.relative(offlineDirectory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("This local file cannot be opened by Papyrus.");
  }

  const data = await readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  const mimeType = mimeTypes[extension] ?? "application/octet-stream";

  return `data:${mimeType};base64,${data.toString("base64")}`;
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  session.defaultSession.on("will-download", (_event, item) => {
    item.setSaveDialogOptions({
      defaultPath: path.join(app.getPath("downloads"), item.getFilename()),
    });
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
