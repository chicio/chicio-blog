import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const pathAlias = {
    "@": resolve(__dirname, "./src"),
};

const reactPlugin = react();

export default defineConfig({
    plugins: [reactPlugin],
    resolve: {
        alias: pathAlias,
    },
    test: {
        coverage: {
            provider: "v8",
            reporter: ["text", "json-summary"],
            // No threshold gate yet — codebase starts near-zero.
            // A ratchet can be added here once baseline coverage is established.
            include: ["src/lib/**", "src/components/design-system/**"],
        },
        projects: [
            {
                resolve: { alias: pathAlias },
                test: {
                    name: "node",
                    include: ["src/lib/**/*.test.ts"],
                    exclude: ["src/lib/consents/**"],
                    environment: "node",
                },
            },
            {
                resolve: { alias: pathAlias },
                plugins: [reactPlugin],
                test: {
                    name: "jsdom",
                    include: [
                        "src/components/**/*.test.tsx",
                        "src/components/**/*.test.ts",
                        "src/lib/consents/**/*.test.ts",
                    ],
                    environment: "jsdom",
                    globals: true,
                    setupFiles: ["./vitest.setup.ts"],
                },
            },
        ],
    },
});
