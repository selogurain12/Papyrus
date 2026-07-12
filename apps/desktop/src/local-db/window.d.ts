import type { LocalDatabaseApi } from "./types";

interface LocalFileApi {
  // eslint-disable-next-line no-unused-vars
  saveFile(input: { name: string; data: ArrayBuffer }): Promise<string>;
  // eslint-disable-next-line no-unused-vars
  readFileAsDataUrl(url: string): Promise<string>;
}

declare global {
  interface Window {
    papyrusLocalFile?: LocalFileApi;
    papyrusLocalDb?: LocalDatabaseApi;
  }
}

export {};
