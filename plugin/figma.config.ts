import type { FigmaConfig, PluginManifest } from "vite-figma-plugin/lib/types";
import { version } from "./package.json";

export const manifest: PluginManifest = {
  name: "Figma Tickets Helper", 
  id: "1529155818113586255n", 
  api: "1.0.0",
  main: "code.js",
  ui: "index.html",
  editorType: [
    "figma", 
    "figjam", 
    "dev", 
  ],
  documentAccess: "dynamic-page",
  networkAccess: {
    allowedDomains: ["*"],
    reasoning: "For accessing remote assets",
  },
};

const extraPrefs = {
  copyZipAssets: ["public-zip/*"],
};

export const config: FigmaConfig = {
  manifest,
  version,
  ...extraPrefs,
};
