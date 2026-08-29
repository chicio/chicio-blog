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
                statements: 92,
                branches: 84,
                functions: 89,
                lines: 92,
            },
            include: [
                "src/lib/**",
                "src/components/design-system/**",
                // Moved out of design-system/ by the boundary audit; they stay measured so the
                // ratchet keeps covering the same code it did before the move.
                "src/components/features/content/page-template/**",
                "src/components/features/content/content-page-template/**",
                "src/components/features/content/reading-content-page-template/**",
                "src/components/features/hooks/**",
                "src/components/features/command-palette/**",
            ],
            // Matrix CG/canvas effects cannot run in jsdom, so they are excluded from
            // coverage rather than carried by meaningless smoke tests.
            // Build/ops entry-point scripts (tsx side-effect scripts run via npm scripts,
            // touching fs/network) are excluded for the same reason — they have no
            // meaningful unit-test surface and would only be covered by mock-heavy noise.
            exclude: [
                "src/components/design-system/atoms/effects/matrix-rain/**",
                "src/components/design-system/molecules/effects/matrix-background/**",
                "src/components/design-system/molecules/effects/matrix-header-background/**",
                "src/components/design-system/molecules/effects/matrix-terminal/**",
                "src/lib/chat/chat-knowledge-upload.ts",
                "src/lib/images/copy-content-media.ts",
                "src/lib/build/prebuild.ts",
            ],
        },
        projects: [
            {
                resolve: { alias: pathAlias },
                test: {
                    name: "node",
                    include: ["src/lib/**/*.test.ts", "src/app/**/*.test.ts", "src/*.test.ts"],
                    exclude: [
                        "src/lib/matrix-rain/**",
                        "src/lib/terminal/terminal-events.test.ts",
                        "src/lib/consents/**",
                        "src/lib/local-storage/**",
                        "src/lib/session-storage/**",
                        "src/lib/pwa/**",
                        "src/lib/videogames/**",
                        "src/lib/background-sync/**",
                        "src/lib/easter-eggs/spoon-activation.test.ts",
                        "src/lib/easter-eggs/easter-egg-found.test.ts",
                        "src/lib/easter-eggs/trigger-easter-egg.test.ts",
                        "src/lib/content/easter-eggs/reveal-all-signal.test.ts",
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
                        "src/lib/matrix-rain/**/*.test.ts",
                        "src/lib/terminal/terminal-events.test.ts",
                        "src/lib/consents/**/*.test.ts",
                        "src/lib/local-storage/**/*.test.ts",
                        "src/lib/session-storage/**/*.test.ts",
                        "src/lib/pwa/**/*.test.ts",
                        "src/lib/videogames/**/*.test.ts",
                        "src/lib/background-sync/**/*.test.ts",
                        "src/lib/easter-eggs/spoon-activation.test.ts",
                        "src/lib/easter-eggs/easter-egg-found.test.ts",
                        "src/lib/easter-eggs/trigger-easter-egg.test.ts",
                        "src/lib/content/easter-eggs/reveal-all-signal.test.ts",
                    ],
                    environment: "jsdom",
                    globals: true,
                    setupFiles: ["./vitest.setup.ts"],
                },
            },
        ],
    },
});
