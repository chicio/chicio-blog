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
            thresholds: {
                statements: 64,
                branches: 59,
                functions: 61,
                lines: 65,
            },
            include: ["src/lib/**", "src/components/design-system/**"],
            // Matrix CG/canvas effects cannot run in jsdom, so they are excluded from
            // coverage rather than carried by meaningless smoke tests.
            exclude: [
                "src/components/design-system/atoms/effects/matrix-rain/**",
                "src/components/design-system/molecules/effects/matrix-background/**",
                "src/components/design-system/molecules/effects/matrix-header-background/**",
                "src/components/design-system/molecules/effects/matrix-terminal/**",
            ],
        },
        projects: [
            {
                resolve: { alias: pathAlias },
                test: {
                    name: "node",
                    include: ["src/lib/**/*.test.ts", "src/app/**/*.test.ts", "src/*.test.ts"],
                    exclude: [
                        "src/lib/consents/**",
                        "src/lib/local-storage/**",
                        "src/lib/session-storage/**",
                        "src/lib/pwa/**",
                        "src/lib/videogames/**",
                        "src/lib/background-sync/**",
                    ],
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
                        "src/lib/local-storage/**/*.test.ts",
                        "src/lib/session-storage/**/*.test.ts",
                        "src/lib/pwa/**/*.test.ts",
                        "src/lib/videogames/**/*.test.ts",
                        "src/lib/background-sync/**/*.test.ts",
                    ],
                    environment: "jsdom",
                    globals: true,
                    setupFiles: ["./vitest.setup.ts"],
                },
            },
        ],
    },
});
