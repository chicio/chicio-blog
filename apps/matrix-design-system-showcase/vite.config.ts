import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Storybook's react-vite builder reads this for plugins. There is deliberately no `base` here:
// Storybook emits relative asset paths, so the build already works unchanged under any subpath —
// verified by building with two different bases and diffing the output, which was identical.
export default defineConfig({
    plugins: [react(), tailwindcss()],
});
