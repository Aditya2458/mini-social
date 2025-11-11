import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-redirects",
      closeBundle() {
        fs.copyFileSync(
          resolve(__dirname, "public", "_redirects"),
          resolve(__dirname, "dist", "_redirects")
        );
      },
    },
  ],
  build: {
    outDir: "dist",
  },
  // This ensures _redirects is copied after build
  publicDir: "public",
});
