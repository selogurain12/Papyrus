/* eslint-disable no-undef */
const path = require("node:path");
const fs = require("node:fs");

const { rebuild } = require("@electron/rebuild");
const nodeAbi = require("node-abi");

const desktopPackage = require("../package.json");

const rootPath = path.resolve(__dirname, "../../..");
const desktopPath = path.resolve(__dirname, "..");
const electronVersion = desktopPackage.devDependencies.electron;
const electronAbi = Number(nodeAbi.getAbi(electronVersion, "electron"));
const sourceBindingPath = path.join(
  rootPath,
  "node_modules/better-sqlite3/build/Release/better_sqlite3.node"
);
const nativeDirectoryPath = path.resolve(__dirname, "../.native");
const targetBindingPath = path.join(nativeDirectoryPath, "better_sqlite3-electron.node");

rebuild({
  buildPath: desktopPath,
  electronVersion,
  forceABI: electronAbi,
  force: true,
  onlyModules: ["better-sqlite3"],
  projectRootPath: rootPath,
})
  .then(() => {
    fs.mkdirSync(nativeDirectoryPath, { recursive: true });
    fs.copyFileSync(sourceBindingPath, targetBindingPath);
    console.log(`Native modules rebuilt for Electron ${electronVersion}.`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
