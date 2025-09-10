import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { figmaPlugin, figmaPluginInit, runAction } from "vite-figma-plugin";
import tailwindcss from '@tailwindcss/vite'

import react from "@vitejs/plugin-react"; 

import { config } from "./figma.config";

const action = process.env.ACTION;
const mode = process.env.MODE;

if (action)
  runAction(
    {},
    // config,
    action
  );

figmaPluginInit();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(), 
    viteSingleFile(),
    figmaPlugin(config, mode),
  ],
  build: {
    assetsInlineLimit: Infinity,
    emptyOutDir: false,
    // outDir: "assets",
    outDir: ".tmp",
  },
});
