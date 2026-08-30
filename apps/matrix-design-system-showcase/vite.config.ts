import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    // GitHub Pages serves the monorepo's site from /chicio-blog/, and this showcase sits beneath it
    // alongside the matrix-rain one. Storybook builds absolute asset paths, so the base has to be
    // baked in at build time.
    base: process.env.STORYBOOK_BASE_PATH ?? "/",
});
