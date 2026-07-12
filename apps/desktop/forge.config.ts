import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { rebuild } from "@electron/rebuild";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import fs from "node:fs";
import path from "node:path";

import desktopPackage from "./package.json";

type NodeAbi = {
  // eslint-disable-next-line no-unused-vars
  getAbi: (target: string, runtime: "electron") => string;
};

const nodeAbi = require("node-abi") as NodeAbi;

const rootPath = path.resolve(__dirname, "../..");
const desktopPath = __dirname;
const electronVersion = desktopPackage.devDependencies.electron;
const electronAbi = Number(nodeAbi.getAbi(electronVersion, "electron"));
const nativeDirectoryPath = path.resolve(__dirname, ".native");
const sourceBindingPath = path.join(
  rootPath,
  "node_modules/better-sqlite3/build/Release/better_sqlite3.node"
);
const targetBindingPath = path.join(nativeDirectoryPath, "better_sqlite3-electron.node");

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  hooks: {
    preStart: async () => {
      await rebuild({
        buildPath: desktopPath,
        electronVersion,
        forceABI: electronAbi,
        force: true,
        onlyModules: ["better-sqlite3"],
        projectRootPath: rootPath,
      });
      fs.mkdirSync(nativeDirectoryPath, { recursive: true });
      fs.copyFileSync(sourceBindingPath, targetBindingPath);
    },
  },
  makers: [new MakerSquirrel({}), new MakerZIP({}, ["darwin"]), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      // eslint-disable-next-line max-len
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/main.ts",
          config: "./vite.main.config.mts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "./vite.preload.config.mts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "./vite.renderer.config.mts",
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
