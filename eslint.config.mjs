import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const chicio = require("./tools/eslint/index.js");

const ignores = {
    ignores: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        ".claude/**",
        ".agents/**",
        // design-sync scaffolding for claude.ai/design: framework shims and preview cards, not app
        // code. The shims deliberately render <img> and destructure Next-only props to drop them,
        // and previews import the compiled bundle by package name — all of which trip app rules.
        ".design-sync/**",
        // generated .d.ts tree the design-sync converter reads (cfg.buildCmd emits it; gitignored)
        "dist/**",
        // design-sync build output: the compiled bundle and generated preview cards (gitignored)
        "ds-bundle/**",
        ".ds-sync/**",
        "public/**",
        "tools/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "e2e/**",
        "vitest.config.ts",
        "vitest.setup.ts",
        "playwright.config.ts",
        "src/test-utils/**",
    ],
};

// `_`-prefixed parameters are the conventional way to drop a prop from a rest spread — the design
// system does this to keep framework-only props off the DOM, where React would warn about them.
// Scoped to the design system: relaxing this repo-wide would let unused values through everywhere.
const unusedVarsRules = {
    files: ["src/components/design-system/**/*.{ts,tsx}"],
    rules: {
        "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
        ],
    },
};

// PlainImage is the design system's documented framework-free fallback: rendering a real <img> is
// its entire purpose. Scoped to that one component so every other design-system file still has to
// justify a raw <img> — reaching for one instead of the injected imageComponent is the mistake the
// framework-agnostic split exists to prevent.
const plainImageRules = {
    files: ["src/components/design-system/atoms/effects/plain-image/**/*.tsx"],
    rules: {
        "@next/next/no-img-element": "off",
    },
};

const componentStoreRules = {
    files: ["src/components/**/*.tsx"],
    ignores: ["src/components/**/use-*.tsx"],
    plugins: { chicio },
    rules: {
        "react/jsx-no-bind": ["error", { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        "chicio/prefer-component-store": "error",
        "chicio/folder-composition": "error",
    },
};

const storeHookRules = {
    files: ["src/components/**/use-*-store.ts"],
    plugins: { chicio },
    rules: {
        "chicio/store-return-shape": "error",
    },
};

const indexBarrelRules = {
    files: ["src/components/**/index.ts"],
    plugins: { chicio },
    rules: {
        "chicio/index-only-component": "error",
    },
};

const eslintConfig = [
    ignores,
    ...coreWebVitals,
    ...typescript,
    unusedVarsRules,
    plainImageRules,
    componentStoreRules,
    storeHookRules,
    indexBarrelRules,
];

export default eslintConfig;
