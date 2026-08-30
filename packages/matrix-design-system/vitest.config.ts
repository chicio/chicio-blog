import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        name: "matrix-design-system",
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
        coverage: {
            provider: "v8",
            thresholds: {
                statements: 94,
                branches: 83,
                functions: 91,
                lines: 95,
            },
            reporter: ["text", "json-summary"],
            include: ["src/**"],
            // Canvas/WebGPU effects cannot run in jsdom, so they are excluded rather than carried
            // by meaningless smoke tests.
            exclude: [
                "src/atoms/effects/matrix-rain/**",
                "src/molecules/effects/matrix-background/**",
                "src/molecules/effects/matrix-header-background/**",
                "src/molecules/effects/matrix-terminal/**",
                "src/test-utils/**",
                "src/index.ts",
                "src/**/index.ts",
            ],
        },
    },
});
