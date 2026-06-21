import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site is served from https://<user>.github.io/pet-the-duck-make-it-quack/
// so the base path must match the repo name for assets to resolve on GitHub Pages.
export default defineConfig({
  base: "/pet-the-duck-make-it-quack/",
  plugins: [react()],
});
